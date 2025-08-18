#!/usr/bin/env node
const { execSync } = require('child_process');

function tryRun(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (err) {
    return false;
  }
}

// clean session proxies without persisting in repo
tryRun('npm config delete proxy');
tryRun('npm config delete https-proxy');

const candidates = [
  'https://registry.npmjs.org/',
  'https://registry.npmmirror.com/',
];
if (process.env.VERDACCIO_URL) {
  candidates.push(process.env.VERDACCIO_URL);
}

let selected = null;
for (const url of candidates) {
  tryRun(`npm config set registry ${url}`);
  tryRun(`npm config set @prisma:registry ${url}`);
  tryRun('npm config set strict-ssl true');

  const pingOk = tryRun('npm ping');
  const viewOk = pingOk && tryRun('npm view prisma version');

  if (pingOk && viewOk) {
    console.log(`[OK] ${url}`);
    selected = url;
    break;
  } else {
    console.log(`[KO] ${url}`);
  }
}

if (!selected) {
  console.error('[KO] Aucun registre disponible. Probable cause: proxy d\'entreprise/DNS/SSL');
  process.exit(1);
}
