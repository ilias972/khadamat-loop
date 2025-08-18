#!/usr/bin/env node
const { spawn } = require('node:child_process');

process.env.NODE_ENV ||= 'production';

const child = spawn('node dist/server.js', { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 0));
