#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('path');

const backendDir = path.resolve(__dirname, '..', '..');
const steps = [
  'ops:dns:check',
  'ops:tls:check',
  'ops:proxy:check',
  'ops:jobs:check',
  'ops:dlq:check',
  'ops:webhooks:verify',
  'ops:backup:now',
  'ops:restore:dryrun',
  'ops:alerts:check',
  'ops:av:selftest'
];

for (const step of steps) {
  const r = spawnSync('npm', ['run', '--prefix', backendDir, step], {
    encoding: 'utf8',
    shell: process.platform === 'win32'
  });
  const out = (r.stdout || '') + (r.stderr || '');
  process.stdout.write(r.stdout || '');
  process.stderr.write(r.stderr || '');
  if (r.status !== 0 || /SKIPPED/.test(out)) {
    console.error(`FAIL ${step}`);
    process.exit(r.status || 1);
  }
}

console.log('PASS ops:all:staging');
