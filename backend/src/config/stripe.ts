import { logger } from './logger';
import { env } from './env';

let stripe: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Stripe = require('stripe');
  if (env.mockStripe) {
    stripe = new Stripe(env.stripeSecretKey || 'sk_test', { apiVersion: '2024-06-20' });
    stripe.checkout.sessions.create = async () => ({ id: 'sess_mock', url: 'https://stripe.mock/session' });
    stripe.subscriptions.update = async (id: string) => ({ id, status: 'updated' });
    logger.info('STRIPE_MOCKED');
  } else if (env.stripeSecretKey) {
    stripe = new Stripe(env.stripeSecretKey, { apiVersion: '2024-06-20' });
  }
} catch (e) {
  logger?.warn?.('Stripe indisponible: ' + (e as Error).message);
  if (env.mockStripe) {
    stripe = {
      checkout: { sessions: { create: async () => ({ id: 'sess_mock', url: 'https://stripe.mock/session' }) } },
      subscriptions: { update: async (id: string) => ({ id, status: 'updated' }) },
      webhooks: {
        constructEvent: (body: any) => (typeof body === 'string' ? JSON.parse(body) : JSON.parse(body.toString())),
      },
    };
  }
}

export { stripe };
