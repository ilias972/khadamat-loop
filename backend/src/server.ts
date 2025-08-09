import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth';
import subscriptionRoutes from './routes/subscriptions';
import paymentRoutes from './routes/payments';
import { handleStripeWebhook } from './controllers/paymentController';
import providersRouter from './routes/providers';
import servicesRouter from './routes/services';
import bookingsRouter from './routes/bookings';
import messagesRouter from './routes/messages';
import reviewsRouter from './routes/reviews';
import favoritesRouter from './routes/favorites';
import notificationsRouter from './routes/notifications';
import smsRouter from './routes/sms';
import adminRouter from './routes/admin';
import statsRouter from './routes/stats';
import kycRoutes from './routes/kyc';
import piiRoutes from './routes/pii';
import { kycWebhook } from './controllers/kycWebhookController';
import { authenticate, requireRole } from './middlewares/auth';
import { logger } from './config/logger';
import { maintenanceGuard } from './middlewares/maintenance';
import { startSchedulers } from './jobs/scheduler';

if (process.env.SENTRY_DSN) {
  (async () => {
    const Sentry = await import('@sentry/node');
    Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
  })();
}

const app = express();

if (process.env.NODE_ENV !== 'test') {
  startSchedulers();
}

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
app.post('/api/kyc/webhook', express.raw({ type: '*/*' }), kycWebhook);

app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", 'data:', 'https:'],
        "script-src": ["'self'", "'unsafe-inline'"],
        "connect-src": ["'self'", env.frontendUrl],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: env.frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: false,
  })
);

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();
    res.redirect('https://' + req.headers.host + req.url);
  });
}

let isReady = false;
setTimeout(() => {
  isReady = true;
}, env.healthReadyDelayMs);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), version: env.appVersion });
});

app.get('/ready', (_req, res) => {
  if (!isReady) {
    return res.status(503).json({ status: 'starting' });
  }
  res.json({ status: 'ok' });
});

app.use(maintenanceGuard);

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/providers', providersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/kyc', kycRoutes);
app.use('/api/pii', piiRoutes);
app.use('/api/sms', smsRouter);
app.use('/api/admin', authenticate, requireRole('admin'), adminRouter);
app.use('/api/stats', statsRouter);

app.use(errorHandler);

export { app };

if (require.main === module) {
  app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
}

process.on('unhandledRejection', (r: any) =>
  logger.error('unhandledRejection', { reason: String(r) })
);
process.on('uncaughtException', (e: any) => {
  logger.error('uncaughtException', { error: String(e?.stack || e) });
  process.exit(1);
});
