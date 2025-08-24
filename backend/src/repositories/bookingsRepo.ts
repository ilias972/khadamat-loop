import { prisma } from '../lib/prisma';
import { repoOpTotal, repoOpDurationMs } from '../metrics';

export interface BookingCreateInput {
  clientId: number;
  providerId: number;
  serviceId: number;
  title: string;
  description: string;
  scheduledDay: string;
  price: number;
}

export const bookingsRepo = {
  async createBookingAtomic(
    data: BookingCreateInput,
    cb?: (tx: any, booking: any) => Promise<void>
  ) {
    const end = repoOpDurationMs?.startTimer({ repo: 'bookings', method: 'createBookingAtomic' });
    try {
      const result = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.create({ data });
        if (cb) await cb(tx, booking);
        return booking;
      });
      repoOpTotal?.inc({ repo: 'bookings', method: 'createBookingAtomic' });
      return result;
    } finally {
      end?.();
    }
  },

  async transitionBookingAtomic(
    bookingId: number,
    nextStatus: string,
    meta: Record<string, any> = {},
    cb?: (tx: any, booking: any) => Promise<void>
  ) {
    const end = repoOpDurationMs?.startTimer({ repo: 'bookings', method: 'transitionBookingAtomic' });
    try {
      const result = await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.update({
          where: { id: bookingId },
          data: { status: nextStatus, ...meta },
        });
        if (cb) await cb(tx, booking);
        return booking;
      });
      repoOpTotal?.inc({ repo: 'bookings', method: 'transitionBookingAtomic' });
      return result;
    } finally {
      end?.();
    }
  },
};
