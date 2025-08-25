#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
let PrismaClient;
try {
  ({ PrismaClient } = require('@prisma/client'));
} catch (e) {
  console.log('SKIPPED seed:prod prisma missing');
  process.exit(0);
}
const prisma = new PrismaClient();

const sqlPath = path.join(__dirname, '..', '..', 'sql', '0002_seed_cities_services.sql');
if (!fs.existsSync(sqlPath)) {
  console.log('SKIPPED seed:prod missing sql file');
  process.exit(0);
}

(async () => {
  const raw = fs.readFileSync(sqlPath, 'utf8');
  const db = process.env.DATABASE_URL || '';
  let sql;
  if (db.startsWith('postgres')) {
    sql = raw.replace(/;\s*$/gm, ' ON CONFLICT DO NOTHING;');
  } else {
    sql = raw.replace(/INSERT INTO/gi, 'INSERT OR IGNORE INTO');
  }
  try {
    await prisma.$executeRawUnsafe(sql);
    console.log('PASS seed:prod');
  } catch (e) {
    console.log('FAIL seed:prod', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
