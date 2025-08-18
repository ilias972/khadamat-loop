#!/usr/bin/env node
const { spawn } = require('node:child_process');

const args = process.argv.slice(2);
const env = args.shift();
if (!env || args.length === 0) {
  console.error('Usage: node scripts/run-with-env.js <env> <command...>');
  process.exit(1);
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = env;
}

const cmd = args.map((a) => JSON.stringify(a)).join(' ');
const child = spawn(cmd, { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 0));
