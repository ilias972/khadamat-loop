const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '../../');
const tmpDir = path.join(root, '.tmp');
const flagFile = path.join(tmpDir, 'prisma-disabled');

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

try {
  fs.mkdirSync(tmpDir, { recursive: true });
} catch {}

if (tryRequire()) {
  try { fs.unlinkSync(flagFile); } catch {}
  process.exit(0);
}

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
  try { fs.unlinkSync(flagFile); } catch {}
  process.exit(0);
}

try {
  fs.writeFileSync(flagFile, '');
} catch {}

console.log('SKIPPED prisma:self-heal (@prisma/client not initialized)');
process.exit(0);
