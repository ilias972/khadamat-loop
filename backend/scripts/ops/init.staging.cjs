#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('path');

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  return r.status === 0;
}

const backendDir = path.resolve(__dirname, '..', '..');
const steps = [];
steps.push(['npm', ['run', '--prefix', backendDir, 'staging:provision']]);

['prisma:self-heal', 'prisma:migrate', 'prisma:seed:min'].forEach(s => {
  steps.push(['npm', ['run', '--prefix', backendDir, s]]);
});

let allOk = true;
for (const [cmd, args] of steps) {
  const ok = run(cmd, args);
  if (!ok) {
    // soft-fail: continue but note
    allOk = false;
  }
}
console.log(JSON.stringify({ ok: allOk }, null, 2));
process.exit(0);
