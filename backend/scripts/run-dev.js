#!/usr/bin/env node
const { spawn } = require('node:child_process');

process.env.NODE_ENV ||= 'development';

function has(pkg) {
  try {
    require.resolve(pkg);
    return true;
  } catch {
    return false;
  }
}

let cmd;
if (has('tsx')) {
  cmd = 'tsx watch src/server.ts';
} else if (has('ts-node')) {
  cmd = 'ts-node src/server.ts';
} else {
  console.log('No tsx or ts-node found, running compiled output. Build first with `npm run build` if needed.');
  cmd = 'node dist/server.js';
}

const child = spawn(cmd, { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 0));
