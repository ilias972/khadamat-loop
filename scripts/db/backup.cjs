const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

const enabled = process.env.BACKUP_ENABLED !== 'false';
if (!enabled) {
  console.log('BACKUP_SKIPPED (disabled)');
  process.exit(0);
}

const dir = process.env.BACKUP_DIR || './backups';
fs.mkdirSync(dir, { recursive: true });
const ts = new Date().toISOString().replace(/[:.]/g, '-');
const dialect = process.env.DB_DIALECT || 'sqlite';

function log(file) {
  const size = fs.statSync(file).size;
  console.log('BACKUP_CREATED', { file, bytes: size, ts: new Date().toISOString() });
}

if (dialect === 'sqlite') {
  const url = process.env.DATABASE_URL || '';
  const match = url.match(/^file:(.+)$/);
  if (!match) {
    console.log('BACKUP_SKIPPED (no sqlite file)');
    process.exit(0);
  }
  const dbPath = match[1];
  const dest = path.join(dir, `sqlite-${ts}.db`);
  fs.copyFileSync(dbPath, dest);
  const checksum = crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex');
  fs.writeFileSync(dest + '.sha256', checksum);
  log(dest);
} else if (dialect === 'postgres') {
  const url = process.env.PG_URL || process.env.DATABASE_URL;
  if (!url) {
    console.log('BACKUP_SKIPPED (PG_URL missing)');
    process.exit(0);
  }
  const dump = spawnSync('pg_dump', [url], { encoding: 'utf-8' });
  if (dump.error) {
    console.log('SKIPPED (pg_dump missing)');
    process.exit(0);
  }
  if (dump.status !== 0) {
    console.error('pg_dump error', dump.stderr);
    process.exit(1);
  }
  const dest = path.join(dir, `pg-${ts}.sql`);
  fs.writeFileSync(dest, dump.stdout);
  log(dest);
} else {
  console.log('BACKUP_SKIPPED (unknown dialect)');
}
