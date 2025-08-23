#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

if ((process.env.BACKUP_ENABLED ?? 'true') !== 'true') {
  console.log('Backups disabled');
  process.exit(0);
}

const dir = process.env.BACKUP_DIR || './backups';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const ts = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
const dbUrl = process.env.DATABASE_URL || '';
let file;
try {
  if (dbUrl.startsWith('file:')) {
    const src = dbUrl.replace('file:', '');
    file = path.join(dir, `backup-${ts}.db`);
    fs.copyFileSync(src, file);
  } else {
    file = path.join(dir, `backup-${ts}.sql`);
    execSync(`pg_dump ${dbUrl} > ${file}`);
  }
  const size = fs.statSync(file).size;
  console.log(`Backup saved to ${file} (${size} bytes)`);
} catch (e) {
  console.error('backup_failed', e.message);
  process.exit(1);
}
