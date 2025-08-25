const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const fetch = global.fetch;

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

async function main() {
  const base = process.env.BACKEND_BASE_URL;
  if (base) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 1000);
      const res = await fetch(base + (process.env.BACKEND_HEALTH_PATH || '/health'), { signal: controller.signal });
      clearTimeout(t);
      if (res.ok) {
        console.log('SKIPPED spawn-backend: remote running');
        return;
      }
    } catch {}
  }

  const cmd = findCmd();
  if (!cmd) {
    console.log('SKIPPED spawn-backend: no runner');
    return;
  }

  const child = spawn(cmd, { stdio: 'inherit', shell: true, detached: true });
  child.unref();

  const pidDir = path.resolve(__dirname, '../../.tmp');
  fs.mkdirSync(pidDir, { recursive: true });
  fs.writeFileSync(path.join(pidDir, 'spawn.pid'), String(child.pid));

  console.log('PASS spawn-backend');
}

main();
