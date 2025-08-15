#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.test');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  env.split('\n').forEach(line => {
    const m = line.match(/^([^#=]+)=\"?(.*)\"?$/);
    if (m) {
      const key = m[1].trim();
      const val = m[2].trim();
      if (key && !process.env[key]) process.env[key] = val;
    }
  });
}

function run(cmd, args) {
  return spawnSync(cmd, args, { stdio: 'inherit', env: process.env });
}

let r = run('npx', ['prisma', 'migrate', 'reset', '--force', '--skip-generate', '--skip-seed']);
if (r.status === 0) {
  console.log('Using prisma migrate reset');
  process.exit(0);
}

console.warn('migrate reset failed, falling back to prisma db push');
let r2 = run('npx', ['prisma', 'db', 'push']);
if (r2.status === 0) {
  console.log('Fallback to prisma db push');
} else {
  console.warn('prisma db push failed');
}
process.exit(0);
