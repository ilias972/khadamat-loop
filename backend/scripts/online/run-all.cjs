#!/usr/bin/env node
const { spawnSync, spawn } = require('node:child_process');
const fs = require('fs');
const path = require('path');

function loadEnv(fp) {
  try {
    const abs = path.resolve(fp);
    if (!fs.existsSync(abs)) return false;
    const content = fs.readFileSync(abs, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      if (!line || line.trim().startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (process.env[key] === undefined || process.env[key] === '') {
        process.env[key] = value;
      }
    }
    console.log(`ENV LOADED FROM ${fp}`);
    return true;
  } catch {
    return false;
  }
}

async function waitHealth(base) {
  const url = base + (process.env.BACKEND_HEALTH_PATH || '/health');
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(t);
    return res.status === 200;
  } catch {
    clearTimeout(t);
    return false;
  }
}

(async () => {
  const backendDir = path.resolve(__dirname, '..', '..');
  process.env.TOKENS_ENV_FILE =
    process.env.TOKENS_ENV_FILE || path.join(backendDir, '.env.tokens.staging');
  loadEnv(path.join(backendDir, '.env.online.staging'));
  loadEnv(process.env.TOKENS_ENV_FILE);

  const base = process.env.BACKEND_BASE_URL;
  let spawned = false;
  if (!base || !(await waitHealth(base))) {
    const child = spawn('npm', ['run', 'ops:spawn'], {
      cwd: backendDir,
      stdio: 'inherit',
    });
    spawned = true;
    const start = Date.now();
    while (Date.now() - start < 30000) {
      await new Promise((r) => setTimeout(r, 1000));
      if (await waitHealth(process.env.BACKEND_BASE_URL)) break;
    }
  }

  if (!process.env.PROVIDER_BEARER_TOKEN) {
    spawnSync('node', ['scripts/tokens/get.cjs', '.env.online.staging'], {
      cwd: backendDir,
      stdio: 'inherit',
    });
    loadEnv(process.env.TOKENS_ENV_FILE);
  }

  const strict = process.env.ONLINE_STRICT !== 'false';
  let skipped = false;
  let failed = false;

  const steps = [
    {
      name: 'online:payments',
      cmd: ['npm', 'run', '--silent', 'online:payments'],
      required: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'PROVIDER_BEARER_TOKEN'],
    },
    {
      name: 'online:kyc',
      cmd: ['npm', 'run', '--silent', 'online:kyc'],
      required: ['STRIPE_IDENTITY_WEBHOOK_SECRET', 'PROVIDER_BEARER_TOKEN'],
    },
  ];

  for (const step of steps) {
    const missing = step.required.filter((k) => !process.env[k]);
    if (missing.length) {
      const msg = 'missing: ' + missing.join(', ');
      if (strict) {
        console.log(`FAIL ${step.name}: ${msg}`);
        failed = true;
      } else {
        console.log(`SKIPPED ${step.name}: ${msg}`);
        skipped = true;
      }
      continue;
    }
    const r = spawnSync(step.cmd[0], step.cmd.slice(1), {
      cwd: backendDir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    if (r.status !== 0) failed = true;
  }

  if (spawned) {
    spawnSync('npm', ['run', 'ops:kill'], { cwd: backendDir, stdio: 'inherit' });
  }

  if (failed) {
    console.log('ONLINE_SUMMARY: FAIL');
    process.exit(1);
  } else if (skipped) {
    console.log('ONLINE_SUMMARY: PASS_WITH_SKIPS');
  } else {
    console.log('ONLINE_SUMMARY: PASS');
  }
})();

