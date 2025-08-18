import { Request, Response, NextFunction } from 'express';
import { Prisma, prisma } from '../lib/prisma';
import { logAction } from '../middlewares/audit';

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.review.findUnique({
      where: { id },
      include: { booking: true },
    });
    if (!existing) return next({ status: 404, message: 'Review not found' });

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

    await logAction({
      userId: parseInt(req.user?.id || '0', 10),
      action: 'DELETE_REVIEW',
      resource: 'review',
      resourceId: id,
      oldValues: { rating: existing.rating, comment: existing.comment },
      ip: req.ip,
      ua: req.headers['user-agent'],
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function disableUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return next({ status: 404, message: 'User not found' });

    await prisma.user.update({ where: { id }, data: { isDisabled: true } });

    await logAction({
      userId: parseInt(req.user?.id || '0', 10),
      action: 'DISABLE_USER',
      resource: 'user',
      resourceId: id,
      oldValues: { isDisabled: existing.isDisabled },
      newValues: { isDisabled: true },
      ip: req.ip,
      ua: req.headers['user-agent'],
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function listAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const size = Math.min(parseInt((req.query.size as string) || '10', 10), 100);
    const skip = (page - 1) * size;

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({ skip, take: size, orderBy: { createdAt: 'desc' } }),
      prisma.auditLog.count(),
    ]);

    res.json({ success: true, data: { items, page, size, total } });
  } catch (err) {
    next(err);
  }
}
