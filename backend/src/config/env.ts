if (
  !process.env.PRISMA_CLIENT_ENGINE_TYPE &&
  process.env.NODE_ENV !== 'production'
) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
}

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || '*',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY_LIVE || process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret:
    process.env.STRIPE_WEBHOOK_SECRET_LIVE || process.env.STRIPE_WEBHOOK_SECRET || '',
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
  searchRadiusKm: Math.min(100, Math.max(5, parseInt(process.env.SEARCH_RADIUS_KM || '30', 10))),
  searchRanking: process.env.SEARCH_RANKING === 'text_first' ? 'text_first' : 'popularity_local',
  piiRetentionDays: parseInt(process.env.PII_RETENTION_DAYS || '365', 10),
  piiExportMaxMb: parseInt(process.env.PII_EXPORT_MAX_MB || '10', 10),
  piiExportFormat: process.env.PII_EXPORT_FORMAT || 'json',
  piiExportRatePerDay: parseInt(process.env.PII_EXPORT_RATE_PER_DAY || '3', 10),
  prismaEnginesMirror: process.env.PRISMA_ENGINES_MIRROR || 'https://binaries.prisma.sh/all',
  prismaEnginesChecksumIgnore: process.env.PRISMA_ENGINES_CHECKSUM_IGNORE === 'true',
  stripeIdentityWebhookSecret:
    process.env.STRIPE_IDENTITY_WEBHOOK_SECRET_LIVE ||
    process.env.STRIPE_IDENTITY_WEBHOOK_SECRET || '',
  adminIpAllowlist: process.env.ADMIN_IP_ALLOWLIST || '',
  trustProxy: process.env.TRUST_PROXY === 'true',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  cookieSameSite: (process.env.COOKIE_SAMESITE || 'lax') as 'lax' | 'strict' | 'none',
  cookieDomain: process.env.COOKIE_DOMAIN || '',
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v),
  smsQuietStart: process.env.SMS_QUIET_START || '21:00',
  smsQuietEnd: process.env.SMS_QUIET_END || '08:00',
  smsMaxRetries: parseInt(process.env.SMS_MAX_RETRIES || '3', 10),
  smsRetryBackoffMs: parseInt(process.env.SMS_RETRY_BACKOFF_MS || '60000', 10),
  cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '120', 10),
  cacheMemMaxKeys: parseInt(process.env.CACHE_MEM_MAX_KEYS || '5000', 10),
  cacheMemSweepSec: parseInt(process.env.CACHE_MEM_SWEEP_SEC || '60', 10),
  cacheTtlSuggest: parseInt(process.env.CACHE_TTL_SUGGEST || '60', 10),
  cacheTtlSearch: parseInt(process.env.CACHE_TTL_SEARCH || '60', 10),
  cacheDisable: process.env.CACHE_DISABLE === 'true',
  cacheNamespace: process.env.CACHE_NAMESPACE || 'khadamat:v1',
  rateGlobalWindowMin: parseInt(process.env.RATE_GLOBAL_WINDOW_MIN || '1', 10),
  rateGlobalMax: parseInt(process.env.RATE_GLOBAL_MAX || '120', 10),
  authMaxFailedLogins: parseInt(process.env.AUTH_MAX_FAILED_LOGINS || '7', 10),
  authLockoutMinutes: parseInt(process.env.AUTH_LOCKOUT_MINUTES || '30', 10),
  metricsEnabled: process.env.METRICS_ENABLED === 'true',
  metricsToken: process.env.METRICS_TOKEN || '',
  metricsBucketsMs: (process.env.METRICS_BUCKETS_MS || '25,50,100,250,500,1000,2000')
    .split(',')
    .map((v) => parseInt(v, 10))
    .filter((v) => !isNaN(v)),
  metricsBucket: process.env.METRICS_BUCKET || 'khadamat-api',
  i18nDefaultLang: process.env.I18N_DEFAULT_LANG || 'fr',
  notifDefaultEmail: (process.env.NOTIF_DEFAULT_EMAIL ?? 'true') === 'true',
  notifDefaultSms: (process.env.NOTIF_DEFAULT_SMS ?? 'true') === 'true',
  notifDefaultPush: (process.env.NOTIF_DEFAULT_PUSH ?? 'false') === 'true',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpFrom: process.env.SMTP_FROM || 'Khadamat <no-reply@khadamat.ma>',
  emailEnabled: (process.env.EMAIL_ENABLED ?? 'true') === 'true',
  backupEnabled: (process.env.BACKUP_ENABLED ?? 'true') === 'true',
  backupDir: process.env.BACKUP_DIR || './backups',
  backupRetentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '14', 10),
  mockEmail: process.env.MOCK_EMAIL === 'true',
  mockSms: process.env.MOCK_SMS === 'true',
  mockRedis: process.env.MOCK_REDIS === 'true',
  mockStripe: process.env.MOCK_STRIPE === 'true',
  dlqEnable: process.env.DLQ_ENABLE === 'true',
  dlqMaxAttempts: parseInt(process.env.DLQ_MAX_ATTEMPTS || '7', 10),
  dlqBaseDelaySeconds: parseInt(process.env.DLQ_BASE_DELAY_SECONDS || '60', 10),
  dlqBackoffMultiplier: parseInt(process.env.DLQ_BACKOFF_MULTIPLIER || '5', 10),
  dlqPollIntervalMs: parseInt(process.env.DLQ_POLL_INTERVAL_MS || '60000', 10),
  dlqBatchSize: parseInt(process.env.DLQ_BATCH_SIZE || '25', 10),
  alertsRulesPath: process.env.ALERTS_RULES_PATH || '',
  dbDialect: process.env.DB_DIALECT || 'sqlite',
  pgUrl: process.env.PG_URL || '',
};

export function validateEnv() {
  if (process.env.NODE_ENV !== 'production') return;
  const missing: string[] = [];

  if (process.env.FORCE_ONLINE !== 'true') missing.push('FORCE_ONLINE');
  if (process.env.OFFLINE_MODE !== 'false') missing.push('OFFLINE_MODE');
  if (process.env.PRODUCTION_OFFLINE_ALLOWED !== 'false')
    missing.push('PRODUCTION_OFFLINE_ALLOWED');

  const check = (key: string, valid = true) => {
    if (!process.env[key] || !valid) missing.push(key);
  };

  check('JWT_SECRET');
  check('FRONTEND_URL', process.env.FRONTEND_URL !== '*');
  const origins = env.corsOrigins;
  if (!origins.length || origins.some((o) => o === '*' || o === ''))
    missing.push('CORS_ORIGINS');
  check('COOKIE_DOMAIN');

  check('STRIPE_SECRET_KEY_LIVE', !!env.stripeSecretKey);
  check('STRIPE_WEBHOOK_SECRET_LIVE', !!env.stripeWebhookSecret);
  check('STRIPE_IDENTITY_WEBHOOK_SECRET_LIVE', !!env.stripeIdentityWebhookSecret);
  check('METRICS_TOKEN');

  if (env.emailEnabled) {
    ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'].forEach((k) =>
      check(k)
    );
  }
  if (env.dbDialect === 'postgres') {
    check('DATABASE_URL');
  }
  if (!env.mockRedis) {
    check('REDIS_URL');
  }
  if (env.mockEmail) missing.push('MOCK_EMAIL');
  if (env.mockSms) missing.push('MOCK_SMS');
  if (env.mockRedis) missing.push('MOCK_REDIS');
  if (env.mockStripe) missing.push('MOCK_STRIPE');
  if (process.env.DEMO_ENABLE === 'true') missing.push('DEMO_ENABLE');
  if (!env.cookieSecure || !['lax', 'strict'].includes(env.cookieSameSite)) {
    missing.push('COOKIE_SECURE/SAMESITE');
  }

  if (missing.length) {
    console.error('Missing env vars: ' + missing.join(', '));
    process.exit(1);
  }
}

if (process.env.NODE_ENV === 'production') {
  validateEnv();
}
