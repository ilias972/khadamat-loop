import { prisma } from '../lib/prisma';
import { sendEmail } from './email';
import { getOrCreateNotificationPrefs } from './notificationPrefs';
import { env } from '../config/env';
import { logger } from '../config/logger';

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

const templates: Record<string, (ctx: any) => { subject: string; body: string }> = {
  BOOKING_REQUEST: (c) => ({ subject: 'Nouvelle réservation', body: `Un client a demandé une prestation le ${c.day}` }),
  BOOKING_CONFIRMED: (c) => ({ subject: 'Réservation acceptée', body: `Réservation acceptée pour le ${c.day}` }),
  BOOKING_REJECTED: () => ({ subject: 'Réservation refusée', body: 'Le prestataire a refusé la réservation.' }),
  BOOKING_RESCHEDULE_PROPOSED: (c) => ({ subject: 'Proposition de date', body: `Nouveau jour proposé: ${c.day}` }),
  BOOKING_RESCHEDULE_ACCEPTED: (c) => ({ subject: 'Nouvelle date acceptée', body: `Nouveau jour accepté: ${c.day}` }),
  BOOKING_CANCELLED: () => ({ subject: 'Réservation annulée', body: 'La réservation a été annulée.' }),
  MESSAGE_RECEIVED: () => ({ subject: 'Nouveau message', body: 'Vous avez reçu un nouveau message.' }),
  SUBSCRIPTION_ACTIVATED: () => ({ subject: 'Abonnement activé', body: 'Votre abonnement est maintenant actif.' }),
};

async function sendTemplatedEmail(userId: number, type: string, ctx: any, client: any = prisma) {
  const prefs = await getOrCreateNotificationPrefs(userId, client);
  if (!prefs.emailOn) {
    logger.info('skipped_due_to_prefs', { userId, channel: 'email' });
    return { skipped: true };
  }
  const user = await client.user.findUnique({ where: { id: userId } });
  if (!user || !user.email) return { skipped: true };
  const tmpl = templates[type];
  if (!tmpl) return { skipped: true };
  const { subject, body } = tmpl(ctx);
  const quietStart = prefs.quietStart || env.smsQuietStart;
  const quietEnd = prefs.quietEnd || env.smsQuietEnd;
  const { inRange, msUntilEnd } = inQuietHours(quietStart, quietEnd);
  if (inRange) {
    setTimeout(() => {
      sendEmail(user.email, subject, body).catch(() => {});
    }, msUntilEnd);
    return { queued: true };
  }
  await sendEmail(user.email, subject, body);
  return { queued: false };
}

export async function sendBookingEmail(toUserId: number, type: string, bookingId: number, client?: any) {
  const db = client ?? prisma;
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return;
  await sendTemplatedEmail(toUserId, type, { day: booking.scheduledDay }, db);
}

export async function sendSubscriptionEmail(toUserId: number, type: string, client?: any) {
  const db = client ?? prisma;
  await sendTemplatedEmail(toUserId, type, {}, db);
}

export async function sendMessageEmail(toUserId: number, client?: any) {
  const db = client ?? prisma;
  await sendTemplatedEmail(toUserId, 'MESSAGE_RECEIVED', {}, db);
}
