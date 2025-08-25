#!/usr/bin/env node
const { spawn, spawnSync } = require('child_process');
const path = require('path');

if (!process.env.__HEALTH_LOCAL) {
  const loader = path.resolve(__dirname, '../env/load.js');
  const args = [loader, '.env', '.env.local', '--', process.execPath, __filename];
  const child = spawn(process.execPath, args, {
    stdio: 'inherit',
    env: { ...process.env, __HEALTH_LOCAL: '1' },
  });
  child.on('exit', (code) => process.exit(code ?? 0));
  return;
}

const port = process.env.PORT || 5000;
const dev = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve(__dirname, '..', '..'),
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function waitHealth() {
  const url = `http://localhost:${port}/health`;
  const end = Date.now() + 30000;
  while (Date.now() < end) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return res.json();
      }
    } catch (e) {}
    await delay(1000);
  }
  throw new Error('timeout');
}

(async () => {
  let data;
  try {
    const json = await waitHealth();
    data = json.data || json;
    if (data.webhookIdempotenceOk !== true) {
      throw new Error('webhookIdempotenceOk false');
    }
    if (data.cookies && Object.prototype.hasOwnProperty.call(data.cookies, 'secure')) {
      console.log('cookies.secure:', data.cookies.secure);
    } else {
      console.log('cookies.secure not exposed');
    }
    console.log('HEALTH: PASS');
  } catch (e) {
    console.log('HEALTH: FAIL', e.message);
  } finally {
    dev.kill('SIGTERM');
  }
})();
