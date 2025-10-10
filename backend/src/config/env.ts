if (
  !process.env.PRISMA_CLIENT_ENGINE_TYPE &&
  process.env.NODE_ENV !== 'production'
) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
}

const nodeEnv = process.env.NODE_ENV || 'development';

export const env = {
  nodeEnv,
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || '*',
  backendBaseUrl: process.env.BACKEND_URL || process.env.BACKEND_BASE_URL || '',
  appBaseUrl: process.env.APP_BASE_URL || '',
  databaseUrl: process.env.DATABASE_URL || '',
  shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL || '',
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
  trustProxy: Number.parseInt(process.env.TRUST_PROXY || '0', 10) || 0,
  hstsEnabled: process.env.HSTS_ENABLED === 'true',
  hstsMaxAge: Number.parseInt(process.env.HSTS_MAX_AGE || '0', 10) || 0,
  cookieSecure: nodeEnv === 'production',
  cookieSameSite: (nodeEnv === 'production' ? 'strict' : 'lax') as 'lax' | 'strict' | 'none',
  cookieDomain: process.env.COOKIE_DOMAIN || '',
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v),
  uploadAntivirus: process.env.UPLOAD_ANTIVIRUS === 'true',
  clamavHost: process.env.CLAMAV_HOST || '',
  clamavPort: Number.parseInt(process.env.CLAMAV_PORT || '0', 10) || 0,
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
  onlineStrict: process.env.ONLINE_STRICT === 'true',
  tokensFilePath: process.env.TOKENS_FILE_PATH || '',
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
  smtpPort: Number.parseInt(process.env.SMTP_PORT || '0', 10) || 0,
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpFrom: process.env.SMTP_FROM || '',
  emailEnabled: (process.env.EMAIL_ENABLED ?? 'true') === 'true',
  backupEnabled: (process.env.BACKUP_ENABLE ?? process.env.BACKUP_ENABLED ?? 'true') === 'true',
  backupDir: process.env.BACKUP_OUTPUT_DIR || process.env.BACKUP_DIR || './backups',
  backupRetentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '14', 10),
  backupDriver: process.env.BACKUP_DRIVER || 'sqlite',
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
  goLiveMaxDlqWebhooks: parseInt(process.env.GO_LIVE_MAX_DLQ_WEBHOOKS || '5', 10),
  goLiveMaxDlqSms: parseInt(process.env.GO_LIVE_MAX_DLQ_SMS || '5', 10),
  goLiveMaxHealthLatencyMs: parseInt(process.env.GO_LIVE_MAX_HEALTH_LATENCY_MS || '800', 10),
  goLiveRequireAlertsRules: (process.env.GO_LIVE_REQUIRE_ALERTS_RULES ?? 'true') === 'true',
  jobsEnable: (process.env.JOBS_ENABLE ?? 'false') === 'true',
  jobsTz: process.env.JOBS_TZ || 'UTC',
  jobsDlqIntervalMs: parseInt(process.env.JOBS_DLQ_INTERVAL_MS || process.env.DLQ_POLL_INTERVAL_MS || '60000', 10),
  jobsRetentionCron: process.env.JOBS_RETENTION_CRON || '0 3 * * *',
  jobsBackupCron: process.env.JOBS_BACKUP_CRON || '30 3 * * *',
  jobsHeartbeatCron: process.env.JOBS_HEARTBEAT_CRON || '*/5 * * * *',
};

export function validateEnv() {
  const currentEnv = env.nodeEnv;
  const isProd = currentEnv === 'production';
  const missing: string[] = [];
  const invalid: string[] = [];

  const hasValue = (value?: string | null) =>
    value !== undefined && value !== null && value.trim() !== '';

  const requireKey = (key: string, predicate?: (value: string) => boolean) => {
    const value = process.env[key];
    if (!hasValue(value)) {
      missing.push(key);
      return;
    }
    if (predicate && !predicate(value!)) {
      invalid.push(key);
    }
  };

  const requirePositiveInt = (key: string) =>
    requireKey(key, (value) => {
      const parsed = Number.parseInt(value, 10);
      return !Number.isNaN(parsed) && parsed > 0;
    });

  const requireOrigins = () => {
    const raw = process.env.CORS_ORIGINS;
    if (!hasValue(raw)) {
      missing.push('CORS_ORIGINS');
      return;
    }
    const origins = raw!
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);
    if (!origins.length) {
      invalid.push('CORS_ORIGINS');
    }
  };

  if (!isProd) {
    if (process.env.UPLOAD_ANTIVIRUS === 'true') {
      requireKey('CLAMAV_HOST');
      requirePositiveInt('CLAMAV_PORT');
    }
    return;
  }

  requireKey('DATABASE_URL');
  requireKey('SHADOW_DATABASE_URL');
  requireKey('MOCK_REDIS', (value) => value === 'false');
  if (process.env.MOCK_REDIS === 'false') {
    requireKey('REDIS_URL');
  }
  requireKey('UPLOAD_ANTIVIRUS', (value) => value === 'true');
  requireKey('CLAMAV_HOST');
  requirePositiveInt('CLAMAV_PORT');

  requireKey('SMTP_HOST');
  requirePositiveInt('SMTP_PORT');
  requireKey('SMTP_USER');
  requireKey('SMTP_PASS');
  requireKey('SMTP_FROM');

  requireKey('SMS_PROVIDER', (value) => {
    const normalized = value.toLowerCase();
    return normalized === 'twilio' || normalized === 'vonage';
  });
  const smsProvider = (process.env.SMS_PROVIDER || '').toLowerCase();
  if (smsProvider === 'twilio') {
    requireKey('TWILIO_ACCOUNT_SID');
    requireKey('TWILIO_AUTH_TOKEN');
    requireKey('TWILIO_FROM');
  } else if (smsProvider === 'vonage') {
    requireKey('VONAGE_API_KEY');
    requireKey('VONAGE_API_SECRET');
    requireKey('VONAGE_FROM');
  }

  requireKey('STRIPE_SECRET_KEY');
  requireKey('STRIPE_WEBHOOK_SECRET');
  requireKey('KYC_PROVIDER');
  requireKey('KYC_API_KEY');

  requireKey('JWT_SECRET');
  requireKey('COOKIE_SECRET');
  requirePositiveInt('TRUST_PROXY');
  requireKey('HSTS_ENABLED', (value) => value === 'true');
  requirePositiveInt('HSTS_MAX_AGE');
  requireKey('COOKIE_DOMAIN');
  requireOrigins();

  requireKey('APP_BASE_URL');
  requireKey('FRONTEND_URL');
  requireKey('BACKEND_URL');

  requireKey('SENTRY_DSN');
  requireKey('METRICS_TOKEN');
  requireKey('ADMIN_IP_ALLOWLIST');

  if (missing.length || invalid.length) {
    if (missing.length) {
      console.error('Missing env vars: ' + missing.join(', '));
    }
    if (invalid.length) {
      console.error('Invalid env vars: ' + invalid.join(', '));
    }
    process.exit(1);
  }
}

validateEnv();
