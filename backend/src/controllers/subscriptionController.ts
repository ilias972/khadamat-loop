import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createClubProSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    if (!userId) {
      return next({ status: 401, message: 'Unauthorized' });
    }

    const active = await prisma.subscription.findFirst({
      where: { userId, type: 'CLUB_PRO', status: 'ACTIVE' },
    });

    if (active) {
      return next({ status: 409, message: 'Active subscription already exists' });
    }

    let subscription = await prisma.subscription.findFirst({
      where: { userId, type: 'CLUB_PRO', status: 'PENDING' },
    });

    let status = 200;
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId,
          type: 'CLUB_PRO',
          status: 'PENDING',
          price: 50,
          autoRenew: true,
        },
      });
      status = 201;
    }

    res.status(status).json({ success: true, data: { subscription } });
  } catch (err) {
    next(err);
  }
}

export async function listMySubscriptions(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    if (!userId) {
      return next({ status: 401, message: 'Unauthorized' });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: { subscriptions } });
  } catch (err) {
    next(err);
  }
}

