import { env } from './env';
import { logger } from './logger';

let Sentry: any = null;
if (env.sentryDsn) {
  import('@sentry/node')
    .then((m) => {
      Sentry = (m as any).default || m;
      Sentry.init({ dsn: env.sentryDsn, tracesSampleRate: 0.1 });
    })
    .catch(() => {
      logger.warn('SENTRY_DISABLED');
      Sentry = null;
    });
}

export { Sentry };
