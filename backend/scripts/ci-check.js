#!/usr/bin/env node
const { spawnSync } = require('child_process');

const required = [
  'DATABASE_URL',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_IDENTITY_WEBHOOK_SECRET',
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.log('CI_GATE_RESULT: SKIPPED_PARTIAL missing ' + missing.join(','));
  process.exit(0);
}

const res = spawnSync('npm', ['run', 'smoke:all'], {
  encoding: 'utf-8',
  shell: true,
});
const out = res.stdout || '';
process.stdout.write(out);
const err = res.stderr || '';
process.stderr.write(err);
const output = out + err;
const fail = res.status !== 0 || /FAIL/.test(output);
const skipped = /SKIPPED/.test(output);
const result = fail ? 'FAIL' : skipped ? 'SKIPPED_PARTIAL' : 'PASS';
console.log('CI_GATE_RESULT: ' + result);
if (fail) process.exit(1);
