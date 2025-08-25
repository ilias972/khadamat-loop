#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('path');

const backendDir = path.resolve(__dirname, '..', '..');
const steps = ['online:payments', 'online:kyc'];

for (const step of steps) {
  const r = spawnSync('npm', ['run', '--silent', step], {
    cwd: backendDir,
    encoding: 'utf8',
    shell: process.platform === 'win32'
  });
  process.stdout.write(r.stdout || '');
  process.stderr.write(r.stderr || '');
  const out = (r.stdout || '') + (r.stderr || '');
  if (r.status !== 0 || /SKIPPED/.test(out)) {
    console.error(`FAIL ${step}`);
    process.exit(1);
  }
}

console.log('PASS online:all');
