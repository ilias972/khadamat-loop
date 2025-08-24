#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', shell: true });
}

try {
  run('prisma doctor');
} catch (e) {
  console.error('prisma doctor failed:', e.message);
}

try {
  run('prisma migrate dev --name baseline');
  console.log('BASELINE: SKIPPED');
  process.exit(0);
} catch (e) {
  // need baseline
}

const migDir = path.resolve(__dirname, '../../prisma/migrations/0000_baseline');
try {
  fs.mkdirSync(migDir, { recursive: true });
  run('prisma migrate diff --from-empty --to-schema-datamodel --script > prisma/migrations/0000_baseline/migration.sql');
  console.log('BASELINE: CREATED');
} catch (e) {
  console.error('baseline diff failed:', e.message);
}

try {
  run('prisma migrate dev --name baseline');
  console.log('BASELINE: APPLIED');
} catch (e) {
  try {
    run('prisma db push');
    console.log('BASELINE: APPLIED');
  } catch (e2) {
    console.error('baseline apply failed:', e2.message);
    process.exit(1);
  }
}
