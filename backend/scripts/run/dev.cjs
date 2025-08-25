#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');

function loadEnv() {
  const candidates = ['.env', '.env.local', '.env.local.example'];
  for (const file of candidates) {
    if (file === '.env.local.example' && fs.existsSync(path.join(root, '.env.local'))) {
      console.log(`SKIPPED ${file}`);
      continue;
    }
    const abs = path.join(root, file);
    if (!fs.existsSync(abs)) {
      console.log(`FALLBACK ${file}`);
      continue;
    }
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
    console.log(`ENV LOADED FROM ${file}`);
  }
}

loadEnv();

const env = { ...process.env, NODE_ENV: 'development' };

let tsxPath;
try {
  tsxPath = require.resolve('tsx/cli');
} catch (e) {
  tsxPath = null;
}

if (tsxPath) {
  console.log('DEV RUNNER: tsx');
  const entries = [
    path.join(root, 'server', 'index.ts'),
    path.join(root, 'src', 'server/index.ts'),
    path.join(root, 'src', 'server.ts'),
  ];
  const entry = entries.find((f) => fs.existsSync(f));
  const res = spawnSync(process.execPath, [tsxPath, entry], { stdio: 'inherit', env });
  process.exit(res.status ?? 0);
} else {
  console.log('DEV RUNNER: dist');
  spawnSync('tsc', ['-p', path.join(root, 'tsconfig.json')], { stdio: 'inherit', env, shell: true });
  const distEntries = [
    path.join(root, 'dist', 'server', 'index.js'),
    path.join(root, 'dist', 'server.js'),
  ];
  const dist = distEntries.find((f) => fs.existsSync(f)) || distEntries[1];
  const res = spawnSync('node', [dist], { stdio: 'inherit', env });
  process.exit(res.status ?? 0);
}
