import { prisma } from '../lib/prisma';
import { sendSMS } from './sms';
import { template } from './smsTemplates';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { logger } from '../config/logger';

function userLang(u:{preferredLang?: string | null}){ return (u.preferredLang === 'ar' ? 'ar' : 'fr') as 'fr'|'ar'; }
const e164 = (p?: string | null) => (p && p.startsWith('+')) ? p : null;

function parseTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return { h, m };
}

function inQuietHours(startStr: string, endStr: string, now: Date = new Date()) {
  const { h: sh, m: sm } = parseTime(startStr);
  const { h: eh, m: em } = parseTime(endStr);
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

function writeOutbox(to: string, body: string) {
  const dir = path.join('.outbox', 'sms');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${Date.now()}-${to}.txt`);
  fs.writeFileSync(file, body);
  return file;
}

export async function sendBookingSMS(
  toUserId: number,
  type: string,
  bookingId: number,
  client?: any
) {
  const db = client ?? prisma;
  const booking = await db.booking.findUnique({ where: { id: bookingId }, include: { client: true, provider: true } });
  if (!booking) return;
  const user = await db.user.findUnique({ where: { id: toUserId } });
  if (!user) return;
  if (!user.smsOptIn) {
    logger.info('skipped_due_to_prefs', { userId: toUserId, channel: 'sms' });
    return;
  }
  if (!user.phoneVerified) return;
  const to = e164(user.phone);
  if (!to) return;
  const lang = userLang(user);
  const body = template(type, lang, { day: booking.scheduledDay });
  if (env.mockSms) {
    const { inRange, msUntilEnd } = inQuietHours(env.smsQuietStart, env.smsQuietEnd);
    const write = () => {
      const file = writeOutbox(to, body);
      logger.info('SMS_MOCKED', { to, type, file });
    };
    if (inRange) setTimeout(write, msUntilEnd);
    else write();
    return;
  }
  await sendSMS({ userId: toUserId, to, body, type, bookingId, client: db, sendNow: !client });
}

export async function sendSubscriptionSMS(toUserId: number, type: string, client?: any) {
  const db = client ?? prisma;
  const user = await db.user.findUnique({ where: { id: toUserId } });
  if (!user) return;
  if (!user.smsOptIn) {
    logger.info('skipped_due_to_prefs', { userId: toUserId, channel: 'sms' });
    return;
  }
  if (!user.phoneVerified) return;
  const to = e164(user.phone);
  if (!to) return;
  const lang = userLang(user);
  const body = template(type, lang, { day: '' });
  if (env.mockSms) {
    const { inRange, msUntilEnd } = inQuietHours(env.smsQuietStart, env.smsQuietEnd);
    const write = () => {
      const file = writeOutbox(to, body);
      logger.info('SMS_MOCKED', { to, type, file });
    };
    if (inRange) setTimeout(write, msUntilEnd);
    else write();
    return;
  }
  await sendSMS({ userId: toUserId, to, body, type, client: db, sendNow: !client });
}
