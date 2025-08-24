#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);
if (!files.length) {
  const def = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(def)) files.push(def);
}
for (const envFile of files) {
  if (!fs.existsSync(envFile)) continue;
  const content = fs.readFileSync(envFile, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const required = [
  'JWT_SECRET',
  'FRONTEND_URL',
  'BACKEND_BASE_URL',
  'ADMIN_IP_ALLOWLIST',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_IDENTITY_WEBHOOK_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMS_PROVIDER',
  'SMS_API_KEY',
  'DATABASE_URL'
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.log('FAIL missing: ' + missing.join(','));
  process.exit(1);
}
console.log('PASS env:prod');
