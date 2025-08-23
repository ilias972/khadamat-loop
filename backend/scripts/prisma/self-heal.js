const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

let lastErr;
function tryRequire() {
  try {
    const { PrismaClient } = require('@prisma/client');
    new PrismaClient();
    return true;
  } catch (e) {
    lastErr = e;
    return false;
  }
}

if (tryRequire()) {
  process.exit(0);
}

const root = path.resolve(__dirname, '../../');
const tmpDir = path.join(root, '.tmp');
try {
  fs.mkdirSync(tmpDir, { recursive: true });
} catch {}

if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./.tmp/test.sqlite';
}

function runGenerate() {
  const opts = { env: process.env, stdio: 'inherit', timeout: 25000 };
  let res = spawnSync('npx', ['prisma', 'generate'], opts);
  if (res.error && res.error.code === 'ENOENT') {
    const bin = path.join(root, 'node_modules/.bin/prisma');
    res = spawnSync(bin, ['generate'], opts);
  }
  return res.status === 0;
}

let ok = runGenerate();
if (!ok) ok = runGenerate();

if (ok && tryRequire()) {
  process.exit(0);
}

const msg = (lastErr && lastErr.message) || 'unknown';
console.error('prisma self-heal failed:', msg);
if (process.env.OFFLINE_SKIP_TESTS === 'true') {
  process.exit(0);
}
process.exit(1);
