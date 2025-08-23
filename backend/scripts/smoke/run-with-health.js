#!/usr/bin/env node
require('./_health-gate');
const { spawnSync } = require('child_process');
const path = require('path');
const args = process.argv.slice(2);
const runner = path.join(__dirname, 'run.js');
const res = spawnSync(process.execPath, [runner, ...args], { stdio: 'inherit' });
process.exit(res.status ?? 0);
