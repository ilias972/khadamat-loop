#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = path.resolve(__dirname, '../.tmp');
fs.mkdirSync(tmpDir, { recursive: true });

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./.tmp/test.sqlite';
}

const envPath = path.resolve(__dirname, '../.env.test');
if (fs.existsSync(envPath)) {
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (key && !process.env[key]) process.env[key] = val;
      }
    });
  } catch (err) {
    console.warn('Could not load .env.test:', err.message);
  }
}

function handleFailure() {
  if (process.env.OFFLINE_SKIP_TESTS === 'true') {
    console.log('offline → skip prepare');
    process.exit(0);
  }
  process.exit(1);
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', env: process.env, shell: process.platform === 'win32' });
  if (r.error || r.status !== 0) return false;
  return true;
}

console.log('Running prisma generate...');
if (!run('npx', ['prisma', 'generate'])) {
  console.warn('prisma generate failed');
  handleFailure();
}

console.log('Running prisma migrate reset...');
if (!run('npx', ['prisma', 'migrate', 'reset', '--force', '--skip-seed'])) {
  console.warn('migrate reset failed, falling back to prisma db push');
  if (!run('npx', ['prisma', 'db', 'push'])) {
    console.warn('prisma db push failed');
    handleFailure();
  }
}

process.exit(0);
