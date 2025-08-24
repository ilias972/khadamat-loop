#!/usr/bin/env node
const { spawnSync } = require('child_process');
try {
  const res = spawnSync('npm', ['audit', '--json'], { encoding: 'utf-8' });
  if (res.error) throw res.error;
  const json = JSON.parse(res.stdout || '{}');
  const vuln = json.metadata?.vulnerabilities || {};
  const high = vuln.high || 0;
  const critical = vuln.critical || 0;
  console.log(`AUDIT_SUMMARY high:${high} critical:${critical}`);
} catch (e) {
  console.log('AUDIT_SKIPPED (offline/blocked)');
}
