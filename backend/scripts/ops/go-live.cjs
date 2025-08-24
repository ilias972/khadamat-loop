#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const steps = [
  { cmd: 'npm run profiles:check:prod', label: 'profiles:check:prod' },
  { cmd: 'npm run ops:dns:check', label: 'ops:dns:check' },
  { cmd: 'npm run ops:tls:check', label: 'ops:tls:check' },
  { cmd: 'npm run ops:proxy:check', label: 'ops:proxy:check' },
  { cmd: 'npm run ops:jobs:check', label: 'ops:jobs:check' },
  { cmd: 'npm run ops:dlq:check', label: 'ops:dlq:check' },
  { cmd: 'npm run ops:webhooks:verify', label: 'ops:webhooks:verify' },
  { label: 'ops:backup:now', run: () => {
      const dir = process.env.BACKUP_OUTPUT_DIR || '/var/backups/khadamat';
      try {
        const files = fs.readdirSync(dir).filter(f => f.startsWith('backup'));
        const recent = files.some(f => Date.now() - fs.statSync(path.join(dir, f)).mtimeMs < 24*3600*1000);
        if (recent) {
          console.log('SKIPPED ops:backup:now recent');
          return;
        }
      } catch (e) {}
      execSync('npm run ops:backup:now', { stdio: 'inherit' });
    }
  },
  { cmd: 'npm run ops:restore:dryrun', label: 'ops:restore:dryrun' },
  { cmd: 'npm run ops:alerts:check', label: 'ops:alerts:check' },
  { cmd: 'npm run ops:av:selftest', label: 'ops:av:selftest' },
];
for (const step of steps) {
  try {
    if (step.cmd) execSync(step.cmd, { stdio: 'inherit' });
    else if (step.run) step.run();
  } catch (e) {
    console.log('NO-GO ' + (step.label || step.cmd));
    process.exit(1);
  }
}
console.log('GO');
