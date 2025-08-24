#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync, execSync } = require('child_process');

spawnSync('node', [path.join(__dirname, '../db/bootstrap.cjs')], { stdio: 'inherit' });

const allowSkips = process.env.GATE_ALLOW_SKIPS === 'true';
if (process.env.BACKUP_ENABLE !== 'true') {
  console.log('SKIPPED backup:disable');
  process.exit(0);
}
const url = process.env.DATABASE_URL;
if (!url) {
  if (allowSkips) {
    console.log('SKIPPED no DATABASE_URL');
    process.exit(0);
  }
  console.log('FAIL backup.no-database-url');
  process.exit(1);
}

const dir = process.env.BACKUP_OUTPUT_DIR || process.env.BACKUP_DIR || '/var/backups/khadamat';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function checksum(f) {
  return crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
}

if (url.startsWith('file:') || url.startsWith('sqlite:')) {
  let db = url.replace(/^file:/, '').replace(/^sqlite:/, '');
  if (!path.isAbsolute(db)) {
    const direct = path.resolve(db);
    const prismaRel = path.resolve('prisma', db);
    db = fs.existsSync(direct) ? direct : prismaRel;
  }
  if (!fs.existsSync(db)) {
    if (allowSkips) {
      console.log('SKIPPED sqlite missing');
      process.exit(0);
    }
    console.log('FAIL backup.sqlite missing');
    process.exit(1);
  }
  const dest = path.join(dir, `backup.sqlite.${Date.now()}.db`);
  fs.copyFileSync(db, dest);
  console.log(`PASS backup.sqlite ${dest} ${checksum(dest)}`);
  process.exit(0);
}

const check = spawnSync('pg_dump', ['--version'], { stdio: 'ignore' });
if (check.status !== 0) {
  if (allowSkips) {
    console.log('SKIPPED pg_dump missing - see docs/backup.md');
    process.exit(0);
  }
  console.log('FAIL backup.pg pg_dump missing - install pg_dump or set BACKUP_DRIVER=sqlite');
  process.exit(1);
}
const dest = path.join(dir, `backup.pg.${Date.now()}.sql`);
try {
  execSync(`pg_dump "${url}" > "${dest}"`, { stdio: 'inherit', shell: true });
  console.log(`PASS backup.pg ${dest} ${checksum(dest)}`);
} catch (e) {
  console.log('FAIL backup.pg', e.message);
  process.exit(1);
}
