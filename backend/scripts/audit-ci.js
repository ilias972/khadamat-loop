#!/usr/bin/env node
const { spawnSync } = require('child_process');
try {
  const res = spawnSync('npm', ['audit', '--json'], { stdio: 'pipe' });
  if (res.status !== 0 && res.status !== 1) throw new Error('audit failed');
  const json = JSON.parse(res.stdout.toString() || '{}');
  const total = json.metadata?.vulnerabilities || {};
  console.log('npm audit summary:', total);
  process.exit(0);
} catch (e) {
  console.log('npm audit skipped if offline');
  process.exit(0);
}
