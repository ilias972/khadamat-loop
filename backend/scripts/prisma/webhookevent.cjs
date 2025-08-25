#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', shell: true });
}

const root = path.resolve(__dirname, '..', '..');

function loadEnv() {
  const candidates = ['.env', '.env.local', '.env.local.example'];
  let loaded = false;
  for (const file of candidates) {
    if (file === '.env.local.example' && fs.existsSync(path.join(root, '.env.local'))) {
      console.log(`SKIPPED ${file}`);
      continue;
    }
    const abs = path.join(root, file);
    if (fs.existsSync(abs)) {
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
      loaded = true;
    } else {
      console.log(`FALLBACK ${file}`);
    }
  }
  if (!loaded) console.log('ENV FALLBACK');
}

loadEnv();

try {
  run('prisma migrate status || prisma validate');
} catch (e) {
  console.error('prisma status failed:', e.message);
}

const migrationsDir = path.join(root, 'prisma', 'migrations');
let hasMigration = false;
if (fs.existsSync(migrationsDir)) {
  hasMigration = fs.readdirSync(migrationsDir).some((f) => f.includes('webhookevent'));
}

if (hasMigration) {
  console.log('WEBHOOKEVENT: SKIPPED');
} else {
  try {
    run('prisma migrate dev --name add_webhookevent_idempotence');
    console.log('WEBHOOKEVENT: APPLIED');
  } catch (e) {
    try {
      run('prisma db push');
      console.log('WEBHOOKEVENT: APPLIED');
    } catch (e2) {
      console.error('webhookevent apply failed:', e2.message);
      process.exit(1);
    }
  }
}

try {
  run('prisma generate');
} catch (e) {
  console.error('prisma generate failed:', e.message);
}
