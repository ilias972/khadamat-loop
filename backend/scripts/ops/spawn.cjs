#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let envFile = null;
let waitPath = '/health';
let timeout = 30000;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--env') envFile = args[++i];
  else if (a === '--wait') waitPath = args[++i];
  else if (a === '--timeout') timeout = parseInt(args[++i], 10);
}

function loadEnv(file) {
  if (!file) return;
  try {
    const txt = fs.readFileSync(path.resolve(file), 'utf8');
    txt.split(/\r?\n/).forEach(line => {
      const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (m) process.env[m[1]] = m[2];
    });
  } catch (e) {
    console.error('ENV_LOAD_FAIL', e.message);
  }
}

loadEnv(envFile);
process.env.START_BACKEND_FOR_TESTS = 'true';

const spawnRes = spawnSync('node', [path.join(__dirname, 'spawn-backend.js')], { stdio: 'inherit', shell: process.platform === 'win32' });
if (spawnRes.status !== 0) process.exit(spawnRes.status || 1);

const base = process.env.BACKEND_BASE_URL;
if (!base) {
  console.log('WARN spawn: missing BACKEND_BASE_URL, skip wait');
  process.exit(0);
}
const url = base.replace(/\/$/, '') + waitPath;
const waitArgs = ['--url', url, '--timeout', String(timeout)];
const waitRes = spawnSync('node', [path.join(__dirname, 'wait.cjs'), ...waitArgs], { stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(waitRes.status || 0);
