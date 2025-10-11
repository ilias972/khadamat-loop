#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', shell: true });
}

const root = path.resolve(__dirname, '..');

function loadEnv() {
  const candidates = ['.env', '.env.local', '.env.sample.local', '.env.local.example'];
  for (const file of candidates) {
    if (file === '.env.local.example' && fs.existsSync(path.join(root, '.env.local'))) {
      console.log(`SKIPPED ${file}`);
      continue;
    }
    const abs = path.join(root, file);
    if (!fs.existsSync(abs)) {
      console.log(`FALLBACK ${file}`);
      continue;
    }
    const content = fs.readFileSync(abs, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      if (!line || line.trim().startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (process.env[key] === undefined || process.env[key] === '') {
        process.env[key] = value;
      }
    }
    console.log(`ENV LOADED FROM ${file}`);
  }
}

function init() {
  loadEnv();
  const url = process.env.DATABASE_URL || '';
  if (!url.startsWith('file:')) {
    console.log('DB INIT: SKIPPED (DATABASE_URL not sqlite)');
    return;
  }
  const dbPath = path.resolve(root, url.replace('file:', ''));
  if (fs.existsSync(dbPath)) {
    console.log('DB INIT: SKIPPED (exists)');
    return;
  }
  try {
    try {
      run('prisma migrate deploy');
    } catch (e) {
      console.log('prisma migrate failed, attempting db push');
      run('prisma db push');
    }
    run('prisma generate');
    try {
      run('npm run prisma:webhookevent');
    } catch (_) {}
    console.log('DB INIT: PASS');
  } catch (e) {
    console.log('DB INIT: FAIL', e.message);
    process.exit(1);
  }
}

init();
