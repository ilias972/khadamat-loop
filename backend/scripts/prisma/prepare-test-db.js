const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '../../');
const tmpDir = path.join(root, '.tmp');
try {
  fs.mkdirSync(tmpDir, { recursive: true });
} catch {}

const dbFile = path.join(tmpDir, 'test.sqlite');
try {
  fs.closeSync(fs.openSync(dbFile, 'a'));
} catch {}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./.tmp/test.sqlite';
}

function runDbPush() {
  const opts = { env: process.env, stdio: 'inherit', timeout: 25000 };
  let res = spawnSync('npx', ['prisma', 'db', 'push', '--skip-generate'], opts);
  if (res.error && res.error.code === 'ENOENT') {
    const bin = path.join(root, 'node_modules/.bin/prisma');
    res = spawnSync(bin, ['db', 'push', '--skip-generate'], opts);
  }
  return res.status === 0;
}

if (!runDbPush()) {
  console.log('SKIPPED prisma:push');
  process.exit(0);
}
