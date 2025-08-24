#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('path');

const backendDir = path.resolve(__dirname, '..', '..');
const cmds = [
  ['npm', ['run', '--prefix', backendDir, 'ops:dns:check']],
  ['npm', ['run', '--prefix', backendDir, 'ops:tls:check']],
  ['npm', ['run', '--prefix', backendDir, 'ops:proxy:check']],
  ['npm', ['run', '--prefix', backendDir, 'ops:jobs:check']],
  ['npm', ['run', '--prefix', backendDir, 'ops:dlq:check']],
  ['npm', ['run', '--prefix', backendDir, 'ops:webhooks:verify']],
  ['npm', ['run', '--prefix', backendDir, 'ops:backup:now']],
  ['npm', ['run', '--prefix', backendDir, 'ops:restore:dryrun']],
  ['npm', ['run', '--prefix', backendDir, 'ops:alerts:check']],
  ['npm', ['run', '--prefix', backendDir, 'ops:av:selftest']]
];

for (const [cmd, args] of cmds) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) {
    console.error(`NO-GO at: ${args.join(' ')}`);
    process.exit(r.status || 1);
  }
}

console.log('OPS_ALL_STAGING: PASS');
