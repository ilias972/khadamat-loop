#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const allow = process.argv.includes('--allow-bootstrap');
const url = process.env.DATABASE_URL || '';

if (!url) {
  console.log('SKIPPED bootstrap (no DATABASE_URL)');
  process.exit(0);
}

if (url.startsWith('file:') || url.startsWith('sqlite:')) {
  let p = url.replace(/^file:/, '').replace(/^sqlite:/, '');
  if (!path.isAbsolute(p)) {
    const direct = path.resolve(p);
    const prismaRel = path.resolve('prisma', p);
    p = fs.existsSync(direct) ? direct : prismaRel;
  }
  if (fs.existsSync(p)) process.exit(0);
  if (!allow) {
    console.log('SKIPPED bootstrap (no --allow-bootstrap)');
    process.exit(0);
  }
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('BOOTSTRAP_OK');
  } catch (e) {
    console.log('SKIPPED bootstrap (prisma missing)');
  }
} else {
  // Postgres or others: nothing
}
