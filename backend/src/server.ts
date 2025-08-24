import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { localizeError } from './middlewares/localizeError';
import { Sentry } from './config/sentry';
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
import adminDisclosure from './routes/adminDisclosure';
import cacheSmokeRouter from './routes/admin/cacheSmoke';
import adminDlqRouter from './routes/admin/dlq';
import adminAuditRouter from './routes/adminAudit';
import statsRouter from './routes/stats';
import searchRoutes from './routes/search';
import mfaRouter from './routes/mfa';
import kycRoutes from './routes/kyc';
import piiRoutes from './routes/pii';
import piiPrivacyRoutes from './routes/piiPrivacy';
import { kycWebhook } from './controllers/kycWebhookController';
import { authenticate, requireRole } from './middlewares/auth';
import { requireMfa } from './middlewares/requireMfa';
import { logger } from './config/logger';
import { maintenanceGuard } from './middlewares/maintenance';
import { prisma, dbAvailable } from './lib/prisma';
import { dbGuard } from './middlewares/dbGuard';
import { ipAllowList } from './middlewares/ipAllowList';
import { rateGlobal } from './middlewares/rateGlobal';
import { requestId } from './middlewares/requestId';
import { requestLogger } from './middlewares/requestLogger';
import { cacheControl } from './middlewares/cacheControl';
import { setupMetrics, metricsRequestTimer } from './metrics';
import { getCacheStatus, stopCache } from './utils/cache';
import { pingClamAV } from './services/antivirus';
import { startDlqRunner } from './jobs/dlqRunner';

let dbConnected = false;

if (dbAvailable) {
  prisma
    .$connect()
    .then(() => {
      dbConnected = true;
      logger.info('DB connected');
    })
    .catch((err: any) => {
      const msg = `DB connection failed: ${err.message}`;
      if (env.forceOnline) {
        logger.error(msg);
        process.exit(1);
      } else {
        logger.warn(msg);
      }
    });
} else {
  const msg = 'Prisma indisponible (offline)';
  if (env.forceOnline) {
    logger.error(msg);
    process.exit(1);
  } else {
    logger.warn(msg);
  }
}

async function hardenForTests() {
  const isTest = (process.env.STAGE ?? process.env.NODE_ENV) === 'test';
  if (!isTest || !dbAvailable) return;

  await prisma.user
    .updateMany({
      where: { isDemo: true, isDisabled: false },
      data: { isDisabled: true }
    })
    .catch(() => {});

  process.env.SMS_DISABLED_FOR_DEMO = 'true';
  process.env.EMAIL_DISABLED_FOR_DEMO = 'true';
}

hardenForTests()
  .catch(() => {})
  .finally(() => {
    if (dbAvailable) prisma.$disconnect();
  });

const app = express();
const adminIpAllowList = ipAllowList();
if (Sentry) {
  app.use(Sentry.Handlers.requestHandler());
}
app.set('etag', 'strong');
try {
  const compression = require('compression');
  app.use(compression());
} catch (e) {
  logger.warn('compression module not available');
}
if (env.trustProxy) {
  app.set('trust proxy', 1);
}

let getJobsStatus = () => ({ enabled: env.jobsEnable, lastRun: { retention: null, backup: null, heartbeat: null } });
if (process.env.NODE_ENV !== 'test' && dbAvailable) {
  if (env.jobsEnable) {
    import('./jobs/scheduler').then((m) => {
      getJobsStatus = m.getJobsStatus;
      if (!process.env.WORKER_ROLE || process.env.WORKER_ROLE === 'jobs') {
        m.startSchedulers();
        startDlqRunner();
      }
    });
  }
}
app.post('/api/payments/webhook', express.raw({ type: '*/*' }), handleStripeWebhook);
app.post('/api/kyc/webhook', express.raw({ type: '*/*' }), kycWebhook);

logger.info('WEBHOOKS_READY', {
  stripeCheckout: !!env.stripeWebhookSecret,
  stripeIdentity: !!env.stripeIdentityWebhookSecret,
});

setupMetrics(app);

app.use(express.json());
app.use(requestId);
app.use((req, res, next) => {
  const orig = res.json.bind(res);
  res.json = (body: any) => {
    if (body && body.success === false && body.error && !body.error.requestId) {
      body.error.requestId = req.id;
    }
    return orig(body);
  };
  next();
});
app.use(requestLogger);
app.use(cacheControl);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com'],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", ...env.corsOrigins, 'https://api.stripe.com'],
      frameSrc: ["'self'", 'https://js.stripe.com'],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.xContentTypeOptions());
if (process.env.NODE_ENV === 'production') {
  app.use(helmet.hsts());
}
app.use(
  cors({
    origin: env.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: false,
  })
);

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();
    res.redirect('https://' + req.headers.host + req.url);
  });
}

let isReady = false;
setTimeout(() => {
  isReady = true;
}, env.healthReadyDelayMs);

app.get('/health', async (_req, res) => {
  const cacheInfo = getCacheStatus();
  const avEnabled = process.env.UPLOAD_ANTIVIRUS === 'true';
  const avReachable = avEnabled ? await pingClamAV() : false;
  const dlqInfo = { enabled: env.dlqEnable, webhooksBacklog: 0, smsBacklog: 0 } as any;
  if (env.dlqEnable && dbAvailable) {
    dlqInfo.webhooksBacklog = await prisma.webhookDLQ.count().catch(() => 0);
    dlqInfo.smsBacklog = await prisma.smsDLQ.count().catch(() => 0);
  }
  const jobs = getJobsStatus();
  res.json({
    success: true,
    data: {
      cache: cacheInfo,
      db: { connected: dbConnected },
      redis: { connected: cacheInfo.driver === 'redis' },
      av: { enabled: avEnabled, reachable: avReachable },
      dlq: dlqInfo,
      jobs,
    },
  });
});

app.get('/ready', (_req, res) => {
  if (!dbAvailable) {
    return res.status(503).json({ ready: false, db: false });
  }
  if (!isReady) {
    return res.status(503).json({ ready: false });
  }
  res.json({ ready: true });
});

app.use(maintenanceGuard);

app.use('/api', rateGlobal);
app.use('/api', metricsRequestTimer);
app.use('/api', dbGuard);
app.use('/api/mfa', mfaRouter);
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
app.use('/api/pii', piiPrivacyRoutes);
app.use('/api/sms', smsRouter);
app.use('/api/admin', adminDisclosure);
if (process.env.SMOKE_ROUTES_ENABLE === 'true') {
  app.use('/api/admin', adminIpAllowList, requireMfa, cacheSmokeRouter);
}
app.use('/api/admin/dlq', adminIpAllowList, authenticate, requireRole('admin'), requireMfa, adminDlqRouter);
app.use('/api/admin/audit', adminIpAllowList, authenticate, requireRole('admin'), requireMfa, adminAuditRouter);
app.use('/api/admin', adminIpAllowList, authenticate, requireRole('admin'), requireMfa, adminRouter);
app.use('/api/stats', statsRouter);
app.use('/api', searchRoutes);

if (Sentry) {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(localizeError);
app.use(errorHandler);

export { app };

if (require.main === module) {
  const cacheInfo = getCacheStatus();
  logger.info('GO_LIVE_CHECKLIST', {
    'env.forceOnline': env.forceOnline,
    mocks: env.mockEmail || env.mockSms || env.mockRedis || env.mockStripe,
    demo: process.env.DEMO_ENABLE === 'true',
    'jwt.secret.set': !!env.jwtSecret,
    'cors.restricted': env.corsOrigins.length > 0 && !env.corsOrigins.includes('*'),
    'cookies.secure': env.cookieSecure && ['lax', 'strict'].includes(env.cookieSameSite),
    'db.migrated': process.env.DB_MIGRATED === 'true',
    'redis.driver': cacheInfo.driver,
    'webhooks.checkout.signed': !!env.stripeWebhookSecret,
    'webhooks.kyc.signed': !!env.stripeIdentityWebhookSecret,
    'metrics.enabled': env.metricsEnabled,
    'backups.enabled': env.backupEnabled,
  });
  const srv = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
  const shutdown = () => {
    stopCache().finally(() => srv.close(() => process.exit(0)));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

process.on('unhandledRejection', (r: any) =>
  logger.error('unhandledRejection', { reason: String(r) })
);
process.on('uncaughtException', (e: any) => {
  logger.error('uncaughtException', { error: String(e?.stack || e) });
  process.exit(1);
});
