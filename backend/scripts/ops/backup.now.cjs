#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const dir = process.env.BACKUP_OUTPUT_DIR || process.env.BACKUP_DIR || '/var/backups/khadamat';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function checksum(file) {
  const buf = fs.readFileSync(file);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function latestBackup() {
  const files = fs.readdirSync(dir).filter(f => f.startsWith('backup'));
  if (!files.length) return null;
  return files.map(f => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a,b)=>b.t-a.t)[0].f;
}

(async () => {
  const latest = latestBackup();
  if (latest) {
    const age = Date.now() - fs.statSync(path.join(dir, latest)).mtimeMs;
    if (age < 24*3600*1000) {
      console.log(`SKIP recent backup ${latest} checksum=${checksum(path.join(dir, latest))}`);
      return;
    }
  }
  try {
    execSync('node scripts/db/backup.js', { stdio: 'inherit' });
    const newest = latestBackup();
    if (newest) {
      console.log(`BACKUP_OK ${newest} checksum=${checksum(path.join(dir, newest))}`);
    } else {
      console.log('BACKUP_UNKNOWN');
    }
  } catch (e) {
    console.log('BACKUP_FAIL', e.message);
    process.exit(1);
  }
})();
