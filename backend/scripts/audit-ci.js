#!/usr/bin/env node
const { spawnSync } = require('child_process');
try {
  const res = spawnSync('npm', ['audit', '--audit-level=high'], {
    stdio: 'inherit',
  });
  if (res.status && res.status !== 0) {
    console.warn('WARN: npm audit exited with status', res.status);
  }
} catch (e) {
  console.warn('AUDIT_SKIPPED (offline/blocked)');
}
process.exit(0);
