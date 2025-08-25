#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const files = ['.env', '.env.production', '.env.online.staging', '.env.local'];
  for (const file of files) {
    const p = path.join(process.cwd(), file);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      if (!line || line.trim().startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', shell: true });
}

loadEnv();

const url = process.env.DATABASE_URL;
if (!url || url.startsWith('file:')) {
  console.log('DB INIT: SKIPPED (no DATABASE_URL)');
  process.exit(0);
}

try {
  run('prisma migrate deploy');
  run('prisma generate');
  console.log('DB INIT: PASS');
} catch (e) {
  console.log('DB INIT: FAIL', e.message);
  process.exit(1);
}
