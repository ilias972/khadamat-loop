#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

let PrismaClient;
try {
  ({ PrismaClient } = require('@prisma/client'));
} catch (e) {
  console.log('SKIPPED seed:min prisma missing');
  process.exit(0);
}
const prisma = new PrismaClient();

(async () => {
  const sqlPath = path.join(__dirname, '..', 'sql', '0002_seed_cities_services.sql');
  if (!fs.existsSync(sqlPath)) {
    console.log('SKIPPED seed:min missing sql file');
    return;
  }
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
    const version = require('crypto').createHash('md5').update(raw).digest('hex');
    console.log('seed.catalog.version', version);
    console.log('PASS seed:min');
  } catch (e) {
    console.log('FAIL seed:min', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
