#!/usr/bin/env node
const { spawnSync } = require('child_process');
if (process.env.UPLOAD_ANTIVIRUS !== 'true') {
  console.log('SKIPPED av:selftest');
  process.exit(0);
}
try {
  const res = spawnSync('npm', ['run', 'ops:av-selftest'], { encoding: 'utf8' });
  const output = (res.stdout || '') + (res.stderr || '');
  if (output.includes('SKIPPED')) {
    console.log('SKIPPED av:selftest');
  } else if (res.status === 0 && output.includes('PASS')) {
    console.log('PASS av:selftest');
  } else {
    console.log('FAIL av:selftest');
    process.exit(1);
  }
} catch (e) {
  console.log('FAIL av:selftest ' + e.message);
  process.exit(1);
}
