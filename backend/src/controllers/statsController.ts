import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export async function adminStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const [users, providers, activeSubscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.provider.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    ]);

    const bookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const topCategories = await prisma.service.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
      take: 5,
    });

    res.json({
      success: true,
      data: { users, providers, bookingsByStatus, topCategories, activeSubscriptions },
    });
  } catch (err) {
    next(err);
  }
}

export async function providerStats(req: Request, res: Response, next: NextFunction) {
  try {
    const providerUserId = parseInt(req.params.providerUserId, 10);
    const now = new Date();
    const since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalBookings, last30Days, acceptedBookings, times, provider] = await Promise.all([
      prisma.booking.count({ where: { providerId: providerUserId } }),
      prisma.booking.count({ where: { providerId: providerUserId, createdAt: { gte: since } } }),
      prisma.booking.count({ where: { providerId: providerUserId, status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
      prisma.booking.findMany({
        where: { providerId: providerUserId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
        select: { createdAt: true, updatedAt: true },
      }),
      prisma.provider.findUnique({ where: { userId: providerUserId }, select: { rating: true, reviewCount: true } }),
    ]);

    const acceptanceRate = totalBookings === 0 ? 0 : Math.round((acceptedBookings / totalBookings) * 100);
    const avgResponseTime =
      times.length === 0
        ? 0
        : times.reduce((sum, t) => sum + (t.updatedAt.getTime() - t.createdAt.getTime()), 0) /
          times.length /
          1000 /
          60;

    res.json({
      success: true,
      data: {
        totalBookings,
        last30Days,
        acceptanceRate,
        avgResponseTime,
        rating: provider?.rating ?? 0,
        reviewCount: provider?.reviewCount ?? 0,
      },
    });
  } catch (err) {
    next(err);
  }
}
