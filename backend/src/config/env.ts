export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || '*',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  stripePriceId: process.env.STRIPE_PRICE_ID,
  currency: process.env.CURRENCY || 'mad',
  logLevel: process.env.LOG_LEVEL || 'info',
  sentryDsn: process.env.SENTRY_DSN || '',
  redisUrl: process.env.REDIS_URL,
  healthReadyDelayMs: parseInt(process.env.HEALTH_READY_DELAY_MS || '0', 10),
  appVersion: process.env.APP_VERSION || '0.0.0',
  forceOnline: process.env.FORCE_ONLINE === 'true',
  offlineMode: process.env.OFFLINE_MODE === 'true',
  offlineSkipTests: process.env.OFFLINE_SKIP_TESTS === 'true',
  productionOfflineAllowed: process.env.PRODUCTION_OFFLINE_ALLOWED === 'true',
  searchRadiusKm: parseInt(process.env.SEARCH_RADIUS_KM || '30', 10),
  searchRanking: process.env.SEARCH_RANKING || 'popularity',
  piiRetentionDays: parseInt(process.env.PII_RETENTION_DAYS || '365', 10),
  piiExportMaxMb: parseInt(process.env.PII_EXPORT_MAX_MB || '10', 10),
  piiExportFormat: process.env.PII_EXPORT_FORMAT || 'json',
  piiExportRatePerDay: parseInt(process.env.PII_EXPORT_RATE_PER_DAY || '3', 10)
  ,prismaEnginesMirror: process.env.PRISMA_ENGINES_MIRROR || 'https://binaries.prisma.sh/all'
  ,prismaEnginesChecksumIgnore: process.env.PRISMA_ENGINES_CHECKSUM_IGNORE === 'true'
};
