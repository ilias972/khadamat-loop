#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', shell: true });
}

try {
  run('prisma migrate dev --name add_webhookevent_idempotence');
} catch (e) {
  try {
    fs.mkdirSync('prisma/migrations/0001_webhookevent', { recursive: true });
    run('prisma migrate diff --from-schema-datamodel --to-schema-datamodel --script > prisma/migrations/0001_webhookevent/migration.sql');
  } catch (e2) {
    console.error('webhookevent diff failed:', e2.message);
  }
  try {
    run('prisma migrate dev --name webhookevent');
  } catch (e3) {
    run('prisma db push');
  }
}

try {
  run('prisma generate');
} catch (e) {
  console.error('prisma generate failed:', e.message);
}
