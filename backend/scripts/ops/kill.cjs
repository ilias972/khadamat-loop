#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('path');

const r = spawnSync('node', [path.join(__dirname, 'kill-backend.js')], { stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(r.status || 0);
