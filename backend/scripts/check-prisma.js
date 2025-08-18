#!/usr/bin/env node
const { spawn } = require('child_process');

async function main() {
  try {
    require('@prisma/client');
    console.log('[OK] Prisma client present');
    return;
  } catch (err) {
    console.log('[KO] Prisma client missing, running `npx prisma generate`...');
  }

  try {
    await new Promise((resolve, reject) => {
      const child = spawn('npx prisma generate', { stdio: 'inherit', shell: true });
      child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(String(code)))));
      child.on('error', reject);
    });
    require('@prisma/client');
    console.log('[OK] Prisma client present');
  } catch (err) {
    console.error("[KO] Prisma client generation failed. Possible cause: 403 d'install, binaire manquant");
    if (err && err.message) console.error(err.message);
    process.exit(1);
  }
}

main();
