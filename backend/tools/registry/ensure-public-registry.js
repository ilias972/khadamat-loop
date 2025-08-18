#!/usr/bin/env node
const { execSync } = require('child_process');

function tryRun(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    // ignore errors to continue execution
  }
}

tryRun('npm config delete proxy');
tryRun('npm config delete https-proxy');
tryRun('npm config set registry https://registry.npmjs.org/');
tryRun('npm config set @prisma:registry https://registry.npmjs.org/');
tryRun('npm config set strict-ssl true');

try {
  execSync('npm ping', { stdio: 'inherit' });
  console.log('[OK] npm ping succeeded');
} catch (err) {
  console.error('[KO] npm ping failed. Possible cause: DNS/SSL/proxy d'entreprise');
  console.error(err.message);
  process.exit(1);
}
