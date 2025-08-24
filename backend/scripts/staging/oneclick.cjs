#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('path');

const backendDir = path.resolve(__dirname, '..', '..');

function runStep(name, envs, cmd) {
  const args = ['scripts/env/load.js', ...envs, '--', ...cmd];
  const r = spawnSync('node', args, { cwd: backendDir, stdio: 'inherit' });
  return r.status === 0;
}

const summary = [];

if (!runStep('staging:init', ['.env.online.staging'], ['node', 'scripts/staging/provision.cjs'])) {
  summary.push('FAIL staging:init');
  console.log(summary.join(' -> '));
  process.exit(1);
}
summary.push('PASS staging:init');

if (!runStep('tokens:get:staging', ['.env.online.staging'], ['node', 'scripts/tokens/get.cjs', '--out', '.env.tokens.staging'])) {
  summary.push('FAIL tokens:get:staging');
  console.log(summary.join(' -> '));
  process.exit(1);
}
summary.push('PASS tokens:get:staging');

if (!runStep('ops:all:staging', ['.env.online.staging', '.env.tokens.staging'], ['node', 'scripts/ops/run-all.cjs'])) {
  summary.push('FAIL ops:all:staging');
  console.log(summary.join(' -> '));
  process.exit(1);
}
summary.push('PASS ops:all:staging');

if (!runStep('postdeploy:prod', ['.env.online.staging', '.env.tokens.staging'], ['node', 'scripts/ops/go-live.cjs'])) {
  summary.push('NO-GO postdeploy:prod');
  console.log(summary.join(' -> '));
  process.exit(1);
}
summary.push('GO postdeploy:prod');

console.log(summary.join(' -> '));
