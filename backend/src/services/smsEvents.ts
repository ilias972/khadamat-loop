import { prisma } from '../lib/prisma';
import { sendSMS } from './sms';
import { template } from './smsTemplates';

function userLang(u:{preferredLang?: string | null}){ return (u.preferredLang === 'ar' ? 'ar' : 'fr') as 'fr'|'ar'; }
const e164 = (p?: string | null) => (p && p.startsWith('+')) ? p : null;

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
  if (!user || !user.smsOptIn || !user.phoneVerified) return;
  const to = e164(user.phone);
  if (!to) return;
  const lang = userLang(user);
  const body = template(type, lang, { day: booking.scheduledDay });
  await sendSMS({ userId: toUserId, to, body, type, bookingId, client: db, sendNow: !client });
}

export async function sendSubscriptionSMS(toUserId: number, type: string, client?: any) {
  const db = client ?? prisma;
  const user = await db.user.findUnique({ where: { id: toUserId } });
  if (!user || !user.smsOptIn || !user.phoneVerified) return;
  const to = e164(user.phone);
  if (!to) return;
  const lang = userLang(user);
  const body = template(type, lang, { day: '' });
  await sendSMS({ userId: toUserId, to, body, type, client: db, sendNow: !client });
}
