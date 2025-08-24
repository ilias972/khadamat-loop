#!/usr/bin/env node
const fs = require('fs');

const files = process.argv.slice(2);
for (const envFile of files) {
  if (!fs.existsSync(envFile)) continue;
  const content = fs.readFileSync(envFile, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (process.env[key] === undefined || process.env[key] === '') {
      process.env[key] = value;
    }
  }
}

const required = [
  'ONLINE_TESTS_ENABLE',
  'BACKEND_BASE_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_IDENTITY_WEBHOOK_SECRET',
  'TEST_PROVIDER_EMAIL',
  'TEST_PROVIDER_PASSWORD',
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.log('FAIL missing: ' + missing.join(','));
  process.exit(1);
}
console.log('PASS env:staging');
