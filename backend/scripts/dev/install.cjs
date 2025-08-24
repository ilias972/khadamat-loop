#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const required = ['@prisma/client', 'prisma', 'tsx'];
const optional = ['jest', 'supertest'];

function missing(mods) {
  const miss = [];
  for (const m of mods) {
    try {
      require.resolve(m);
    } catch (e) {
      miss.push(m);
    }
  }
  return miss;
}

const miss = missing([...required, ...optional]);
if (miss.length === 0) process.exit(0);

const cwd = path.join(__dirname, '..', '..');
let res = spawnSync('npm', ['ci'], { cwd, stdio: 'inherit', shell: true });
if (res.status !== 0) {
  res = spawnSync('npm', ['i'], { cwd, stdio: 'inherit', shell: true });
  if (res.status !== 0) {
    console.log('SKIPPED install (network)');
  }
}
process.exit(0);
