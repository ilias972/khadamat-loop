import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { isValidDay, isFutureOrTodayDay } from '../utils/day';
import { notifyUser } from '../utils/notify';
import { createSystemMessage } from '../utils/messages';

const prisma = new PrismaClient();

const STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  RESCHEDULE_PROPOSED: 'RESCHEDULE_PROPOSED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
} as const;

export async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    if (!userId) return next({ status: 401, message: 'Unauthorized' });

    const { serviceId, title, description, scheduledDay, price } = req.body;

    if (!isValidDay(scheduledDay) || !isFutureOrTodayDay(scheduledDay)) {
      return next({ status: 400, message: 'Invalid scheduledDay' });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { provider: true },
    });
    if (!service) return next({ status: 404, message: 'Service not found' });

    const providerId = service.provider.userId;

    const booking = await prisma.booking.create({
      data: {
        clientId: userId,
        providerId,
        serviceId,
        title,
        description,
        scheduledDay,
        price: price ?? service.basePrice,
      },
    });

    await createSystemMessage({
      bookingId: booking.id,
      senderId: userId,
      receiverId: providerId,
      content: 'Réservation créée — en attente de votre confirmation.',
    });

    await notifyUser(providerId, 'booking_created', 'Nouvelle réservation', 'Réservation créée — en attente de votre confirmation.', { bookingId: booking.id });

    res.status(201).json({ success: true, data: { booking } });
  } catch (err) {
    next(err);
  }
}

export async function confirmBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user?.id || '', 10);
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return next({ status: 404, message: 'Booking not found' });
    if (booking.providerId !== userId) return next({ status: 403, message: 'Forbidden' });
    if (booking.status !== STATUS.PENDING) return next({ status: 409, message: 'Invalid status' });

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: STATUS.CONFIRMED, proposedDay: null },
    });

    await createSystemMessage({
      bookingId: updated.id,
      senderId: userId,
      receiverId: updated.clientId,
      content: 'Réservation acceptée. Fixez l\u2019horaire dans ce chat.',
    });

    await notifyUser(updated.clientId, 'booking_confirmed', 'Réservation acceptée', 'Réservation acceptée. Fixez l\u2019horaire dans ce chat.', { bookingId: updated.id });

    res.json({ success: true, data: { booking: updated } });
  } catch (err) {
    next(err);
  }
}

export async function proposeDay(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const { proposedDay } = req.body;
    const userId = parseInt(req.user?.id || '', 10);

    if (!isValidDay(proposedDay) || !isFutureOrTodayDay(proposedDay)) {
      return next({ status: 400, message: 'Invalid proposedDay' });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return next({ status: 404, message: 'Booking not found' });
    if (booking.providerId !== userId) return next({ status: 403, message: 'Forbidden' });
    if (booking.status !== STATUS.PENDING && booking.status !== STATUS.CONFIRMED) {
      return next({ status: 409, message: 'Invalid status' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: STATUS.RESCHEDULE_PROPOSED, proposedDay },
    });

    await createSystemMessage({
      bookingId: updated.id,
      senderId: userId,
      receiverId: updated.clientId,
      content: `Nouveau jour propos\u00e9 : ${proposedDay}.`,
    });

    await notifyUser(updated.clientId, 'booking_reschedule_proposed', 'Proposition de nouveau jour', `Nouveau jour propos\u00e9 : ${proposedDay}.`, { bookingId: updated.id });

    res.json({ success: true, data: { booking: updated } });
  } catch (err) {
    next(err);
  }
}

export async function acceptReschedule(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user?.id || '', 10);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return next({ status: 404, message: 'Booking not found' });
    if (booking.clientId !== userId) return next({ status: 403, message: 'Forbidden' });
    if (booking.status !== STATUS.RESCHEDULE_PROPOSED || !booking.proposedDay) {
      return next({ status: 409, message: 'Invalid status' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        scheduledDay: booking.proposedDay,
        proposedDay: null,
        status: STATUS.CONFIRMED,
      },
    });

    await createSystemMessage({
      bookingId: updated.id,
      senderId: userId,
      receiverId: updated.providerId,
      content: `Le client a accept\u00e9 le nouveau jour : ${updated.scheduledDay}.`,
    });

    await notifyUser(updated.providerId, 'booking_reschedule_accepted', 'Nouveau jour accept\u00e9', `Le client a accept\u00e9 le nouveau jour : ${updated.scheduledDay}.`, { bookingId: updated.id });

    res.json({ success: true, data: { booking: updated } });
  } catch (err) {
    next(err);
  }
}

export async function rejectBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user?.id || '', 10);
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return next({ status: 404, message: 'Booking not found' });
    if (booking.providerId !== userId) return next({ status: 403, message: 'Forbidden' });
    if (booking.status !== STATUS.PENDING && booking.status !== STATUS.RESCHEDULE_PROPOSED) {
      return next({ status: 409, message: 'Invalid status' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: STATUS.REJECTED },
    });

    await createSystemMessage({
      bookingId: updated.id,
      senderId: userId,
      receiverId: updated.clientId,
      content: 'Le prestataire a refus\u00e9 la r\u00e9servation.',
    });

    await notifyUser(updated.clientId, 'booking_rejected', 'R\u00e9servation refus\u00e9e', 'Le prestataire a refus\u00e9 la r\u00e9servation.', { bookingId: updated.id });

    res.json({ success: true, data: { booking: updated } });
  } catch (err) {
    next(err);
  }
}

export async function cancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user?.id || '', 10);
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return next({ status: 404, message: 'Booking not found' });
    if (booking.clientId !== userId) return next({ status: 403, message: 'Forbidden' });
    if (
      booking.status !== STATUS.PENDING &&
      booking.status !== STATUS.CONFIRMED &&
      booking.status !== STATUS.RESCHEDULE_PROPOSED
    ) {
      return next({ status: 409, message: 'Invalid status' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: STATUS.CANCELLED },
    });

    await createSystemMessage({
      bookingId: updated.id,
      senderId: userId,
      receiverId: updated.providerId,
      content: 'Le client a annul\u00e9 la r\u00e9servation.',
    });

    await notifyUser(updated.providerId, 'booking_cancelled', 'R\u00e9servation annul\u00e9e', 'Le client a annul\u00e9 la r\u00e9servation.', { bookingId: updated.id });

    res.json({ success: true, data: { booking: updated } });
  } catch (err) {
    next(err);
  }
}

export async function listBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const role = req.user?.role;
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = Math.min(parseInt((req.query.size as string) || '10', 10), 50);
    const skip = (page - 1) * size;

    const where: any = {};
    if (role === 'client') where.clientId = userId;
    else if (role === 'provider') where.providerId = userId;

    if (req.query.status) where.status = req.query.status as string;
    if (req.query.day && isValidDay(req.query.day as string)) where.scheduledDay = req.query.day;

    const [items, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: size,
        orderBy: [{ scheduledDay: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({ success: true, data: { items, page, size, total } });
  } catch (err) {
    next(err);
  }
}

export async function getBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user?.id || '', 10);
    const role = req.user?.role;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return next({ status: 404, message: 'Booking not found' });

    if (role !== 'admin' && booking.clientId !== userId && booking.providerId !== userId) {
      return next({ status: 403, message: 'Forbidden' });
    }

    res.json({ success: true, data: { booking } });
  } catch (err) {
    next(err);
  }
}
