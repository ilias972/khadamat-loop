import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { paymentsRepo } from '../repositories/paymentsRepo';
import { stripe } from '../config/stripe';
import { env } from '../config/env';
import { addMonths } from '../utils/date';
import { createNotification } from '../services/notifications';
import { sendSubscriptionSMS } from '../services/smsEvents';
import { sendSubscriptionEmail } from '../services/emailEvents';
import { logger } from '../config/logger';
import { webhooksProcessedTotal } from '../metrics';
import { enqueueWebhookDLQ } from '../services/dlq';

export async function createClubProCheckout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.user?.id || '', 10);
    if (!userId) {
      return next({ status: 401, code: 'UNAUTH' });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId, type: 'CLUB_PRO', status: 'PENDING' }
    });

    if (!subscription) {
      return next({ status: 400, code: 'VALIDATION_ERROR' });
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
  let rawPayload: any;
  try {
    rawPayload = JSON.parse(req.body.toString('utf8'));
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
    webhooksProcessedTotal?.inc({ provider: 'stripe', outcome: 'replayed' });
    return res.json({ received: true });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const subscriptionId = session.metadata?.subscriptionId;
      if (subscriptionId) {
        const id = parseInt(subscriptionId, 10);
        const subscription = await prisma.subscription.findUnique({ where: { id } });
        if (subscription && subscription.status !== 'ACTIVE') {
          const startDate = new Date();
          const endDate = addMonths(startDate, 12);
          await paymentsRepo.markSubscriptionActiveAtomic(
            subscription.userId,
            session.id,
            { subscriptionId: id, startDate, endDate },
            async (tx) => {
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
          );
        }
      }
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as any;
      const stripeId = sub.id as string;
      const autoRenew = !sub.cancel_at_period_end;
      await prisma.subscription.updateMany({ where: { stripeId }, data: { autoRenew, status: event.type === 'customer.subscription.deleted' ? 'EXPIRED' : undefined } });
    }

    await prisma.webhookEvent.update({
      where: { provider_eventId: { provider: 'stripe', eventId: event.id } },
      data: { status: 'processed', processedAt: new Date() },
    });
    logger.info('stripe webhook processed', { eventId: event.id });
    webhooksProcessedTotal?.inc({ provider: 'stripe', outcome: 'ok' });
    return res.json({ received: true });
  } catch (err: any) {
    await prisma.webhookEvent.update({
      where: { provider_eventId: { provider: 'stripe', eventId: event.id } },
      data: { status: 'failed', processedAt: new Date() },
    }).catch(() => {});
    logger.error('stripe webhook processing error', { eventId: event.id, error: err.message });
    webhooksProcessedTotal?.inc({ provider: 'stripe', outcome: 'fail' });
    await enqueueWebhookDLQ('stripe', rawPayload || event, String(err.message)).catch(() => {});
    return res.json({ received: true });
  }
}
