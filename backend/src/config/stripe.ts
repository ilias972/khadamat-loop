import { logger } from './logger';

let stripe: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Stripe = require('stripe');
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20'
  });
} catch (e) {
  logger?.warn?.('Stripe indisponible: ' + (e as Error).message);
}

export { stripe };
