import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { stripe } from '../config/stripe';
import { env } from '../config/env';
import { addMonths } from '../utils/date';
import { createNotification } from '../services/notifications';
import { sendSubscriptionSMS } from '../services/smsEvents';
import { sendSubscriptionEmail } from '../services/emailEvents';
import { logger } from '../config/logger';

export async function createClubProCheckout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    if (!userId) {
      return next({ status: 401, message: 'Unauthorized' });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId, type: 'CLUB_PRO', status: 'PENDING' }
    });

    if (!subscription) {
      return next({ status: 400, message: 'Create subscription via /api/subscriptions/club-pro' });
    }

    let session: any;
    if (process.env.STRIPE_PRICE_ID) {
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
        metadata: {
          userId: String(userId),
          subscriptionId: String(subscription.id)
        },
        success_url: `${env.frontendUrl}/club-pro?status=success`,
        cancel_url: `${env.frontendUrl}/club-pro?status=cancel`
      });
    } else {
      const currency = process.env.CURRENCY ?? 'mad';
      const amount = Number(process.env.CLUB_PRO_AMOUNT ?? 5000);

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
          price_data: {
            currency,
            product_data: { name: 'Abonnement Club Pro (12 mois)' },
            unit_amount: amount
          },
          quantity: 1
        }],
        metadata: {
          userId: String(userId),
          subscriptionId: String(subscription.id)
        },
        success_url: `${env.frontendUrl}/club-pro?status=success`,
        cancel_url: `${env.frontendUrl}/club-pro?status=cancel`
      });
    }

    res.json({ success: true, data: { url: session.url } });
  } catch (err) {
    next(err);
  }
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, env.stripeWebhookSecret);
  } catch (err: any) {
    logger.error('stripe webhook signature invalid', { error: err.message });
    return res.status(400).json({
      success: false,
      error: { code: 'WEBHOOK_SIGNATURE_INVALID', message: 'Invalid signature', timestamp: new Date().toISOString() },
    });
  }

  try {
    await prisma.webhookEvent.create({
      data: { provider: 'stripe', eventId: event.id, type: event.type, status: 'processing' },
    });
  } catch {
    logger.warn('stripe webhook duplicate', { eventId: event.id });
    return res.json({ received: true });
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const subscriptionId = session.metadata?.subscriptionId;
        if (subscriptionId) {
          const id = parseInt(subscriptionId, 10);
          const subscription = await tx.subscription.findUnique({ where: { id } });
          if (subscription && subscription.status !== 'ACTIVE') {
            const startDate = new Date();
            const endDate = addMonths(startDate, 12);
            await tx.subscription.update({
              where: { id },
              data: { status: 'ACTIVE', startDate, endDate, stripeId: session.id },
            });
            await tx.subscription.updateMany({
              where: { userId: subscription.userId, status: 'PENDING', id: { not: id } },
              data: { status: 'CANCELED' },
            });
            await createNotification(
              subscription.userId,
              'SUBSCRIPTION_ACTIVATED',
              'Abonnement Club Pro activé',
              'Votre abonnement est maintenant actif.',
              undefined,
              tx
            );
            await sendSubscriptionSMS(subscription.userId, 'SUBSCRIPTION_ACTIVATED', tx);
            await sendSubscriptionEmail(subscription.userId, 'SUBSCRIPTION_ACTIVATED', tx);
          }
        }
      } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
        const sub = event.data.object as any;
        const stripeId = sub.id as string;
        const autoRenew = !sub.cancel_at_period_end;
        await tx.subscription.updateMany({ where: { stripeId }, data: { autoRenew, status: event.type === 'customer.subscription.deleted' ? 'EXPIRED' : undefined } });
      }

      await tx.webhookEvent.update({
        where: { provider_eventId: { provider: 'stripe', eventId: event.id } },
        data: { status: 'processed', processedAt: new Date() },
      });
    });
    logger.info('stripe webhook processed', { eventId: event.id });
    return res.json({ received: true });
  } catch (err: any) {
    await prisma.webhookEvent.update({
      where: { provider_eventId: { provider: 'stripe', eventId: event.id } },
      data: { status: 'failed', processedAt: new Date() },
    }).catch(() => {});
    logger.error('stripe webhook processing error', { eventId: event.id, error: err.message });
    return res.status(500).json({
      success: false,
      error: { code: 'WEBHOOK_PROCESSING_ERROR', message: 'Processing failed', timestamp: new Date().toISOString() },
    });
  }
}
