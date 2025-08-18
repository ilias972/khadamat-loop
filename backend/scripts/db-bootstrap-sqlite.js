const { spawnSync, execSync } = require('child_process');
const path = require('path');

try {
  execSync('docker -v', { stdio: 'inherit' });
} catch (e) {
  console.error('docker is required');
  process.exit(1);
}

let dbUrl = process.env.DATABASE_URL || 'file:./dev.sqlite';
if (!dbUrl.startsWith('file:')) {
  console.error('DATABASE_URL must be file: for sqlite');
  process.exit(1);
}
const dbPath = dbUrl.replace('file:', '');
const sqlDir = path.resolve(__dirname, '..', 'sql');
const dataDir = path.resolve(path.dirname(dbPath));
const sqlDirPosix = sqlDir.replace(/\\/g, '/');
const dataDirPosix = dataDir.replace(/\\/g, '/');
const dbFile = path.basename(dbPath);

const args = [
  'run', '--rm',
  '-v', `${sqlDirPosix}:/sql`,
  '-v', `${dataDirPosix}:/data`,
  'nouchka/sqlite3',
  '/bin/sh',
  '-lc',
  `sqlite3 /data/${dbFile} < /sql/0001_init_sqlite.sql`
];
const r = spawnSync('docker', args, { stdio: 'inherit' });
process.exit(r.status ?? 0);
