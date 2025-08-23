#!/usr/bin/env node
const { spawnSync } = require('child_process');
const required = ['DATABASE_URL', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_IDENTITY_WEBHOOK_SECRET'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing env vars:', missing.join(', '));
  process.exit(1);
}
const res = spawnSync('npm', ['run', 'smoke:all'], { stdio: 'inherit', shell: true });
process.exit(res.status || 0);
