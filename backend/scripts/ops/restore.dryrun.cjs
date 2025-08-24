#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const allowSkips = process.env.GATE_ALLOW_SKIPS === 'true';
const dir = process.env.BACKUP_OUTPUT_DIR || '/var/backups/khadamat';
if (process.env.BACKUP_ENABLE !== 'true') {
  console.log('SKIPPED restore:disable');
  process.exit(0);
}
try {
  const files = fs.readdirSync(dir).filter((f) => f.startsWith('backup'));
  if (!files.length) {
    if (allowSkips) {
      console.log('SKIPPED restore:dryrun no-backup');
      process.exit(0);
    }
    console.log('FAIL restore:dryrun no-backup');
    process.exit(1);
  }
  files.sort((a, b) => fs.statSync(path.join(dir, b)).mtimeMs - fs.statSync(path.join(dir, a)).mtimeMs);
  const file = path.join(dir, files[0]);
  const stat = fs.statSync(file);
  if (!stat.size) {
    console.log('FAIL restore:dryrun empty');
    process.exit(1);
  }
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  console.log(`PASS restore:dryrun ${file} ${hash}`);
} catch (e) {
  if (allowSkips) {
    console.log('SKIPPED restore:dryrun ' + e.message);
  } else {
    console.log('FAIL restore:dryrun ' + e.message);
    process.exit(1);
  }
}
