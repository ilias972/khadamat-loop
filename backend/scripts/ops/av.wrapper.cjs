#!/usr/bin/env node
const { spawnSync } = require('child_process');
const allowSkips = process.env.GATE_ALLOW_SKIPS === 'true';
if (process.env.UPLOAD_ANTIVIRUS !== 'true') {
  if (allowSkips) {
    console.log('SKIPPED av:selftest');
    process.exit(0);
  }
  console.log('FAIL av:selftest disabled');
  process.exit(1);
}
try {
  const res = spawnSync('npm', ['run', 'ops:av-selftest'], { encoding: 'utf8' });
  const output = (res.stdout || '') + (res.stderr || '');
  if (output.includes('SKIPPED')) {
    if (allowSkips) {
      console.log('SKIPPED av:selftest');
    } else {
      console.log('FAIL av:selftest ' + output.trim());
      process.exit(1);
    }
  } else if (res.status === 0 && output.includes('PASS')) {
    console.log('PASS av:selftest');
  } else {
    console.log('FAIL av:selftest ' + output.trim());
    process.exit(1);
  }
} catch (e) {
  console.log('FAIL av:selftest ' + e.message);
  process.exit(1);
}
