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
try {
  if (fs.existsSync(envPath)) {
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
  }
} catch (err) {
  console.warn('Could not load .env.test:', err.message);
}

const PRISMA_TIMEOUT = parseInt(process.env.TEST_PRISMA_TIMEOUT_MS || '180000', 10);

function run(args) {
  const r = spawnSync('npx', args, {
    env: process.env,
    encoding: 'utf-8',
    shell: true,
    timeout: PRISMA_TIMEOUT
  });
  const output = (r.stdout || '') + (r.stderr || '');
  if (output) process.stdout.write(output);
  return { ok: !r.error && r.status === 0, output };
}

function handleFailure(step, output) {
  if (
    process.env.OFFLINE_SKIP_TESTS === 'true' ||
    /403|ENOTFOUND|ECONNRESET|EAI_AGAIN/i.test(output)
  ) {
    console.log('[tests] prisma indisponible (403/réseau) → prepare skipped (offline)');
    process.exit(0);
  }
  console.error(`[tests] ${step} failed`);
  process.exit(1);
}

let r = run(['prisma', 'generate']);
if (!r.ok) handleFailure('prisma generate', r.output);

r = run(['prisma', 'migrate', 'reset', '--force', '--skip-seed']);
if (!r.ok) {
  console.warn('migrate reset failed, falling back to prisma db push');
  r = run(['prisma', 'db', 'push']);
  if (!r.ok) handleFailure('prisma db push', r.output);
}

process.exit(0);
