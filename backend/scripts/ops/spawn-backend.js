const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

if (process.env.START_BACKEND_FOR_TESTS !== 'true') {
  console.log('SKIPPED spawn: disabled');
  process.exit(0);
}

function findCmd() {
  const mode = process.env.START_BACKEND_CMD || 'auto';
  if (mode === 'dev') return 'npm run dev';
  if (mode === 'dist') return fs.existsSync('dist/server.js') ? 'node dist/server.js' : null;
  if (mode === 'auto') {
    if (fs.existsSync('dist/server.js')) return 'node dist/server.js';
    if (fs.existsSync('server/index.ts')) {
      return 'npx tsx server/index.ts';
    }
    return null;
  }
  return null;
}

const cmd = findCmd();
if (!cmd) {
  console.log('SKIPPED spawn: no runner');
  process.exit(0);
}

const child = spawn(cmd, { stdio: 'inherit', shell: true, detached: true });
child.unref();

const pidDir = path.resolve(__dirname, '../../.tmp');
fs.mkdirSync(pidDir, { recursive: true });
fs.writeFileSync(path.join(pidDir, 'spawn.pid'), String(child.pid));

console.log('PASS spawn-backend');
