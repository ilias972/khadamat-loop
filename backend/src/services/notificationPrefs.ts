import { prisma } from '../lib/prisma';
import { env } from '../config/env';

export async function getOrCreateNotificationPrefs(userId: number, tx: any = prisma) {
  let prefs = await tx.notificationPreference.findUnique({ where: { userId } });
  if (!prefs) {
    prefs = await tx.notificationPreference.create({
      data: {
        userId,
        emailOn: env.notifDefaultEmail,
        smsOn: env.notifDefaultSms,
        pushOn: env.notifDefaultPush,
      },
    });
  }
  return prefs;
}

export async function updateNotificationPrefs(
  userId: number,
  data: Partial<{ emailOn: boolean; smsOn: boolean; pushOn: boolean; quietStart: string | null; quietEnd: string | null }>,
  tx: any = prisma
) {
  return tx.notificationPreference.update({ where: { userId }, data });
}
