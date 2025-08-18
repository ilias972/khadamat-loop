import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { stripe } from '../config/stripe';
import { env } from '../config/env';
import { addMonths } from '../utils/date';
import { createNotification } from '../services/notifications';
import { sendSubscriptionSMS } from '../services/smsEvents';

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

export async function handleStripeWebhook(req: Request, res: Response, _next: NextFunction) {
  const sig = req.headers['stripe-signature'];
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
    const subscriptionId = session.metadata?.subscriptionId;
    if (subscriptionId) {
      const id = parseInt(subscriptionId, 10);
      const subscription = await prisma.subscription.findUnique({ where: { id } });
      if (subscription && subscription.status !== 'ACTIVE') {
        const startDate = new Date();
        const endDate = addMonths(startDate, 12);
        await prisma.subscription.update({
          where: { id },
          data: {
            status: 'ACTIVE',
            startDate,
            endDate,
            stripeId: session.id
          }
        });
        createNotification(subscription.userId, 'SUBSCRIPTION_ACTIVATED', 'Abonnement Club Pro activé', 'Votre abonnement est maintenant actif.').catch((err) => console.error(err));
        sendSubscriptionSMS(subscription.userId, 'SUBSCRIPTION_ACTIVATED').catch((err) => console.error(err));
      }
    }
  }

  res.sendStatus(200);
}
