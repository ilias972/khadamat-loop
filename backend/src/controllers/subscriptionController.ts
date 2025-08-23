import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { stripe } from '../config/stripe';
import { logger } from '../config/logger';

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

export async function getMySubscriptionStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    if (!userId) return next({ status: 401, message: 'Unauthorized' });
    const sub = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (!sub) {
      return res.json({ success: true, data: { status: 'EXPIRED', currentPeriodStart: null, currentPeriodEnd: null, autoRenew: false, source: 'local' } });
    }
    res.json({
      success: true,
      data: {
        status: sub.status as any,
        currentPeriodStart: sub.startDate,
        currentPeriodEnd: sub.endDate,
        autoRenew: sub.autoRenew,
        source: sub.stripeId ? 'stripe' : 'local',
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAutoRenew(req: Request, res: Response, next: NextFunction) {
  const userId = parseInt(req.user?.id || '', 10);
  if (!userId) return next({ status: 401, message: 'Unauthorized' });
  const { autoRenew } = req.body as { autoRenew: boolean };
  try {
    await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.findFirst({ where: { userId, status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } });
      if (!sub) throw { status: 404, code: 'NOT_FOUND', message: 'Subscription not found' };
      await tx.subscription.update({ where: { id: sub.id }, data: { autoRenew } });
      if (sub.stripeId && stripe) {
        try {
          await stripe.subscriptions.update(sub.stripeId, { cancel_at_period_end: !autoRenew });
        } catch (e: any) {
          throw { status: 502, code: 'STRIPE_API_ERROR', message: e.message };
        }
      }
    });
    logger.info('SUBSCRIPTION_AUTORENEW_UPDATED', { userId, autoRenew });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

