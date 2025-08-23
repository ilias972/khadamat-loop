import { env } from './env';
import { logger } from './logger';

let Sentry: any = null;
if (env.sentryDsn) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Sentry = require('@sentry/node');
    Sentry.init({ dsn: env.sentryDsn, tracesSampleRate: 0.1 });
  } catch (e) {
    logger.warn('SENTRY_DISABLED');
    Sentry = null;
  }
}

export { Sentry };
