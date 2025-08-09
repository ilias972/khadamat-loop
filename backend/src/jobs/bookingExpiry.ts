import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';
const prisma = new PrismaClient();

function dayToDate(day: string){ return new Date(day + 'T00:00:00Z'); }

export async function runBookingExpiryJob() {
  const windowH = Number(process.env.BOOKING_ACCEPT_WINDOW_HOURS ?? 24);
  const now = new Date();
  const cutoff = new Date(now.getTime() - windowH * 3600 * 1000);

  // PENDING trop vieux → REJECTED
  const old = await prisma.booking.updateMany({
    where: { status: 'PENDING', createdAt: { lt: cutoff } },
    data: { status: 'REJECTED' }
  });

  // scheduledDay dépassé → REJECTED (toujours PENDING)
  const dayPassed = await prisma.booking.findMany({
    where: { status: 'PENDING' }
  });
  let dayRejected = 0;
  for (const b of dayPassed) {
    if (b.scheduledDay && dayToDate(b.scheduledDay) < dayToDate(new Date().toISOString().slice(0,10))) {
      await prisma.booking.update({ where: { id: b.id }, data: { status: 'REJECTED' } });
      dayRejected++;
    }
  }

  if (old.count || dayRejected) {
    logger.info('booking_expiry', { expiredOld: old.count, expiredDay: dayRejected });
  }
}
