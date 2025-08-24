#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const envPath = path.join(root, '.env.online.staging');
const tokensPath = path.join(root, '.env.tokens.staging');
const gitignore = path.join(root, '..', '.gitignore');

const STAGING_ENV = `# === STAGING PROFILE (auto-provisioned) ===
NODE_ENV=production
FRONTEND_URL=
BACKEND_BASE_URL=
TRUST_PROXY=true

REFRESH_TOKEN_COOKIE_DOMAIN=
COOKIE_SAMESITE=strict
COOKIE_SECURE=true
HSTS_MAX_AGE=31536000

ADMIN_IP_ALLOWLIST=
MFA_ENFORCE=admin

DATABASE_URL=
REDIS_URL=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_IDENTITY_WEBHOOK_SECRET=

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMS_PROVIDER=
SMS_API_KEY=

UPLOAD_ANTIVIRUS=true
CLAMAV_HOST=clamav
CLAMAV_PORT=3310
AV_QUARANTINE_DIR=.quarantine

BACKUP_ENABLE=true
BACKUP_DRIVER=pg
BACKUP_OUTPUT_DIR=/var/backups/khadamat
BACKUP_RETENTION_DAYS=14

GO_LIVE_MAX_DLQ_WEBHOOKS=5
GO_LIVE_MAX_DLQ_SMS=5
GO_LIVE_MAX_HEALTH_LATENCY_MS=800
GO_LIVE_REQUIRE_ALERTS_RULES=true
GATE_ALLOW_SKIPS=false

OFFLINE_MODE=false
FORCE_ONLINE=true
PRODUCTION_OFFLINE_ALLOWED=false
# === END ===
`;

function ensureFile(file, contentIfMissing) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, contentIfMissing, { encoding: 'utf8' });
    return 'created';
  }
  return 'exists';
}

function ensureGitignoreLine(file, line) {
  try {
    const cur = fs.readFileSync(file, 'utf8');
    if (!cur.split('\n').some(l => l.trim() === line.trim())) {
      fs.appendFileSync(file, `\n${line}\n`);
      return 'appended';
    }
    return 'present';
  } catch {
    // if .gitignore missing, create minimal
    fs.writeFileSync(file, `${line}\n`, { encoding: 'utf8' });
    return 'created';
  }
}

function ensureDirFromEnv(envFile, key) {
  try {
    const txt = fs.readFileSync(envFile, 'utf8');
    const m = txt.match(new RegExp(`^${key}=(.*)$`, 'm'));
    if (!m) return 'missing-key';
    const dir = m[1].trim();
    if (!dir) return 'empty';
    const p = path.isAbsolute(dir) ? dir : path.join(root, dir);
    fs.mkdirSync(p, { recursive: true });
    return `ok:${p}`;
  } catch {
    return 'skip';
  }
}

const r1 = ensureFile(envPath, STAGING_ENV);
const r2 = ensureFile(tokensPath, '');
const g1 = ensureGitignoreLine(gitignore, 'backend/.env.online.staging');
const g2 = ensureGitignoreLine(gitignore, 'backend/.env.tokens.staging');
const b1 = ensureDirFromEnv(envPath, 'BACKUP_OUTPUT_DIR');

console.log(
  JSON.stringify({
    ok: true,
    env_online_staging: r1,
    env_tokens_staging: r2,
    gitignore_env: g1,
    gitignore_tokens: g2,
    backup_dir: b1
  }, null, 2)
);
