#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
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
