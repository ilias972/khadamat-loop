import { prisma } from '../lib/prisma';

const ENABLED = (process.env.SMS_ENABLED ?? 'false').toLowerCase() === 'true';
const PROVIDER = (process.env.SMS_PROVIDER ?? 'twilio').toLowerCase();
const QUIET_START = Number(process.env.QUIET_HOURS_START ?? 21);
const QUIET_END   = Number(process.env.QUIET_HOURS_END ?? 8);

function truncate(body: string, max=480) { return body.length > max ? body.slice(0, max-1) + '…' : body; }

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
  userId, to, body, type, bookingId
}: { userId: number; to: string; body: string; type: string; bookingId?: number }) {
  // déduplication par évènement
  try {
    await prisma.smsMessage.create({ data: { userId, to, body: truncate(body), type, bookingId: bookingId ?? null, status: 'QUEUED', provider: PROVIDER } });
  } catch { return { skipped: true }; }

  if (!ENABLED) {
    await prisma.smsMessage.updateMany({ where:{ userId, bookingId: bookingId ?? null, type }, data:{ status:'SENT', provider:'disabled' }});
    return { disabled: true };
  }
  try {
    const res = PROVIDER === 'vonage' ? await sendViaVonage(to, body) : await sendViaTwilio(to, body);
    await prisma.smsMessage.updateMany({ where:{ userId, bookingId: bookingId ?? null, type }, data:{ status: res.status, providerMessageId: res.providerMessageId } });
    return { ok: true };
  } catch (err:any) {
    await prisma.smsMessage.updateMany({ where:{ userId, bookingId: bookingId ?? null, type }, data:{ status:'FAILED', errorMessage: String(err?.message || err) } });
    return { ok: false };
  }
}
