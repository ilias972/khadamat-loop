import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import { logger } from '../config/logger';

const ENABLED = (process.env.SMS_ENABLED ?? 'false').toLowerCase() === 'true';
const PROVIDER = (process.env.SMS_PROVIDER ?? 'twilio').toLowerCase();
const QUIET_START = env.smsQuietStart; // HH:mm
const QUIET_END = env.smsQuietEnd; // HH:mm
const MAX_RETRIES = env.smsMaxRetries;
const RETRY_BACKOFF = env.smsRetryBackoffMs;

function truncate(body: string, max=480) { return body.length > max ? body.slice(0, max-1) + '…' : body; }

function parseTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return { h, m };
}

function inQuietHours(now: Date = new Date()) {
  const { h: sh, m: sm } = parseTime(QUIET_START);
  const { h: eh, m: em } = parseTime(QUIET_END);
  const start = new Date(now);
  start.setHours(sh, sm, 0, 0);
  const end = new Date(now);
  end.setHours(eh, em, 0, 0);
  if (end <= start) {
    if (now >= start) end.setDate(end.getDate() + 1);
    else start.setDate(start.getDate() - 1);
  }
  if (now >= start && now < end) {
    return { inRange: true, msUntilEnd: end.getTime() - now.getTime() };
  }
  return { inRange: false, msUntilEnd: 0 };
}

async function sendViaTwilio(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN, from = process.env.TWILIO_FROM;
  if (!sid || !token || !from) throw new Error('TWILIO ENV missing');
  const basic = Buffer.from(`${sid}:${token}`).toString('base64');
  const params = new URLSearchParams({ To: to, From: from, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST', headers: { 'Authorization': `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: params
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'twilio_error');
  return { providerMessageId: json.sid as string, status: 'SENT' as const };
}

async function sendViaVonage(to: string, body: string) {
  const key = process.env.VONAGE_API_KEY, secret = process.env.VONAGE_API_SECRET, from = process.env.VONAGE_FROM || 'Khadamat';
  if (!key || !secret) throw new Error('VONAGE ENV missing');
  const params = new URLSearchParams({ api_key: key, api_secret: secret, to, from, text: body, type: 'unicode' });
  const res = await fetch('https://rest.nexmo.com/sms/json', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: params });
  const json = await res.json();
  const m = json.messages?.[0];
  if (!m || m.status !== '0') throw new Error(m?.['error-text'] || 'vonage_error');
  return { providerMessageId: m['message-id'] as string, status: 'SENT' as const };
}

export async function sendSMS({
  userId,
  to,
  body,
  type,
  bookingId,
  client = prisma,
  sendNow = client === prisma,
}: {
  userId: number;
  to: string;
  body: string;
  type: string;
  bookingId?: number;
  client?: any;
  sendNow?: boolean;
}) {
  try {
    await client.smsMessage.create({
      data: {
        userId,
        to,
        body: truncate(body),
        type,
        bookingId: bookingId ?? null,
        status: 'QUEUED',
        provider: PROVIDER,
      },
    });
  } catch {
    return { skipped: true };
  }

  if (!sendNow || client !== prisma) {
    return { queued: true };
  }

  const { inRange, msUntilEnd } = inQuietHours();
  const attemptSend = async (attempt: number): Promise<void> => {
    if (!ENABLED) {
      await prisma.smsMessage.updateMany({
        where: { userId, bookingId: bookingId ?? null, type },
        data: { status: 'SENT', provider: 'disabled' },
      });
      return;
    }
    try {
      const res =
        PROVIDER === 'vonage' ? await sendViaVonage(to, body) : await sendViaTwilio(to, body);
      await prisma.smsMessage.updateMany({
        where: { userId, bookingId: bookingId ?? null, type },
        data: { status: res.status, providerMessageId: res.providerMessageId },
      });
    } catch (err: any) {
      if (attempt + 1 < MAX_RETRIES) {
        logger.warn('sms send retry', { attempt: attempt + 1, error: String(err?.message || err) });
        setTimeout(() => {
          attemptSend(attempt + 1).catch(() => {});
        }, RETRY_BACKOFF);
      } else {
        await prisma.smsMessage.updateMany({
          where: { userId, bookingId: bookingId ?? null, type },
          data: { status: 'FAILED', errorMessage: String(err?.message || err) },
        });
        logger.error('sms send failed', { error: String(err?.message || err) });
      }
    }
  };

  if (inRange) {
    logger.info('sms queued due to quiet hours', { to });
    setTimeout(() => {
      attemptSend(0).catch(() => {});
    }, msUntilEnd);
    return { queued: true };
  }

  attemptSend(0).catch(() => {});
  return { queued: false };
}
