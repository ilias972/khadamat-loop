import { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { notifyUser } from '../utils/notify';

const prisma = new PrismaClient();

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    const { bookingId, rating, comment } = req.body as { bookingId: number; rating: number; comment?: string };

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, clientId: true, providerId: true, status: true },
    });
    if (!booking) return next({ status: 404, message: 'Booking not found' });
    if (booking.clientId !== userId) return next({ status: 403, message: 'Forbidden' });
    if (booking.status !== 'COMPLETED') return next({ status: 409, message: 'Booking not completed' });

    try {
      const review = await prisma.$transaction(async (tx) => {
        const created = await tx.review.create({
          data: { bookingId, userId, rating, comment },
        });

        const agg = await tx.review.aggregate({
          where: { booking: { providerId: booking.providerId } },
          _avg: { rating: true },
          _count: { rating: true },
        });

        await tx.provider.update({
          where: { userId: booking.providerId },
          data: {
            rating: Number((agg._avg.rating || 0).toFixed(1)),
            reviewCount: agg._count.rating,
          },
        });

        return created;
      });

      await notifyUser(
        booking.providerId,
        'review_created',
        'Nouvel avis',
        'Vous avez reçu un nouvel avis',
        { reviewId: review.id }
      );

      res.status(201).json({ success: true, data: { review } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return next({ status: 409, message: 'Review already exists' });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

export async function listProviderReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const providerId = parseInt(req.params.providerId, 10);
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = Math.min(parseInt((req.query.size as string) || '10', 10), 50);
    const skip = (page - 1) * size;

    const where = { booking: { providerId } };

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: { user: true, booking: true },
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where }),
    ]);

    res.json({ success: true, data: { items, page, size, total } });
  } catch (err) {
    next(err);
  }
}

export async function updateReview(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const { rating, comment } = req.body as { rating?: number; comment?: string };
    const userId = parseInt(req.user?.id || '', 10);
    const role = req.user?.role;

    const existing = await prisma.review.findUnique({
      where: { id },
      include: { booking: true },
    });
    if (!existing) return next({ status: 404, message: 'Review not found' });
    if (existing.userId !== userId && role !== 'admin') return next({ status: 403, message: 'Forbidden' });

    const providerId = existing.booking.providerId;

    const review = await prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id },
        data: { rating, comment },
      });

      const agg = await tx.review.aggregate({
        where: { booking: { providerId } },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.provider.update({
        where: { userId: providerId },
        data: {
          rating: Number((agg._avg.rating || 0).toFixed(1)),
          reviewCount: agg._count.rating,
        },
      });

      return updated;
    });

    res.json({ success: true, data: { review } });
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user?.id || '', 10);
    const role = req.user?.role;

    const existing = await prisma.review.findUnique({
      where: { id },
      include: { booking: true },
    });
    if (!existing) return next({ status: 404, message: 'Review not found' });
    if (existing.userId !== userId && role !== 'admin') return next({ status: 403, message: 'Forbidden' });

    const providerId = existing.booking.providerId;

    await prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id } });

      const agg = await tx.review.aggregate({
        where: { booking: { providerId } },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.provider.update({
        where: { userId: providerId },
        data: {
          rating: Number((agg._avg.rating || 0).toFixed(1)),
          reviewCount: agg._count.rating,
        },
      });
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

