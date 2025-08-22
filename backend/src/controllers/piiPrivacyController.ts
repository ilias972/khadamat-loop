import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { logAction } from '../middlewares/audit';

export const exportPII = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.user!.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    const userPII = await prisma.userPII.findUnique({ where: { userId } });
    const verification = await prisma.verification.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, provider: true, status: true, createdAt: true, updatedAt: true }
    });
    const bookings = await prisma.booking.findMany({
      where: { clientId: userId },
      select: { id: true, providerId: true, serviceId: true, status: true, createdAt: true, updatedAt: true }
    });
    const reviews = await prisma.review.findMany({
      where: { userId },
      select: { id: true, providerId: true, rating: true, createdAt: true }
    });
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { id: true, providerId: true, createdAt: true }
    });
    const data = { user, userPII, verification, bookings, reviews, favorites };
    res.setHeader('Content-Disposition', `attachment; filename="khadamat-pii-${userId}.json"`);
    await logAction({ userId, action: 'PII_EXPORT', resource: 'user', resourceId: userId, ip: req.ip, ua: req.headers['user-agent'] });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const deletePII = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.user!.id);
    const hold = await prisma.legalHold.findUnique({ where: { userId } });
    await prisma.$transaction(async (tx) => {
      await tx.userPII.deleteMany({ where: { userId } });
      await tx.verification.updateMany({
        where: { userId },
        data: { data: null, docNumberHash: null, docNumberLast4: null, documentType: null }
      });
      if (!hold) {
        await tx.kycVault.deleteMany({ where: { userId } });
      }
      await tx.user.update({
        where: { id: userId },
        data: { email: `deleted-${userId}@example.com`, phone: null, isDisabled: true }
      });
    });
    await logAction({ userId, action: 'PII_DELETE', resource: 'user', resourceId: userId, ip: req.ip, ua: req.headers['user-agent'] });
    return res.json({ success: true });
  } catch (e) {
    next(e);
  }
};
