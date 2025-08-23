import { prisma } from '../lib/prisma';
import { getOrCreateNotificationPrefs } from './notificationPrefs';
import { getNotificationTemplate, NotificationEvent } from '../i18n/notifications';
import { sendEmail } from './email';
import { sendSMS } from './sms';
import { sendPush } from './push';
import { env } from '../config/env';
import { logger } from '../config/logger';

function resolveLang(header: string | undefined, pref?: string | null): 'fr' | 'ar' {
  if (header && header.toLowerCase().startsWith('ar')) return 'ar';
  if (pref === 'ar') return 'ar';
  return 'fr';
}

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

type DispatchOpts = {
  event: NotificationEvent;
  userId: number;
  ctx?: Record<string, any>;
  acceptLanguage?: string;
};

export async function dispatchNotification({ event, userId, ctx = {}, acceptLanguage }: DispatchOpts) {
  const prefs = await getOrCreateNotificationPrefs(userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const lang = resolveLang(acceptLanguage, user.preferredLang);
  const tpl = getNotificationTemplate(event, lang, ctx);
  const channelsUsed: string[] = [];
  let deferred = false;
  const quietStart = prefs.quietStart || env.smsQuietStart;
  const quietEnd = prefs.quietEnd || env.smsQuietEnd;
  const { inRange, msUntilEnd } = inQuietHours(quietStart, quietEnd);
  const delay = (fn: () => void) => setTimeout(fn, msUntilEnd);

  if (prefs.emailOn && user.email && tpl.subject && tpl.text) {
    channelsUsed.push('email');
    const send = () => sendEmail(user.email!, tpl.subject, tpl.text).catch(() => {});
    if (inRange) {
      deferred = true;
      delay(send);
    } else {
      await sendEmail(user.email, tpl.subject, tpl.text);
    }
  }

  if (prefs.smsOn && user.phone && user.phoneVerified && tpl.sms) {
    const to = user.phone.startsWith('+') ? user.phone : null;
    if (to) {
      channelsUsed.push('sms');
      const send = () =>
        sendSMS({
          userId,
          to,
          body: tpl.sms!,
          type: event.replace(/\./g, '_').toUpperCase(),
          bookingId: ctx.bookingId,
        }).catch(() => {});
      if (inRange) {
        deferred = true;
        delay(send);
      } else {
        await sendSMS({ userId, to, body: tpl.sms, type: event.replace(/\./g, '_').toUpperCase(), bookingId: ctx.bookingId });
      }
    }
  }

  if (prefs.pushOn && tpl.text) {
    channelsUsed.push('push');
    const send = () => sendPush(userId, tpl.text!).catch(() => {});
    if (inRange) {
      deferred = true;
      delay(send);
    } else {
      await sendPush(userId, tpl.text!);
    }
  }

  logger.info('notification_dispatch', { event, userId, channelsUsed, deferred });
}
