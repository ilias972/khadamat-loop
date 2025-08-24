#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..', '..');
const envPath = path.join(root, '.env.online.staging');

// ensure base files and backup dir
require('../env/provision.staging.cjs');

// ensure env files are gitignored
const gitignore = path.join(root, '..', '.gitignore');
try {
  const gi = fs.readFileSync(gitignore, 'utf8');
  if (!gi.includes('backend/.env.online.staging') || !gi.includes('backend/.env.tokens.staging')) {
    console.error('FAIL staging:init - env files not gitignored');
    process.exit(1);
  }
} catch {
  console.error('FAIL staging:init - missing .gitignore');
  process.exit(1);
}

function parseEnv(file) {
  const lines = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split(/\r?\n/) : [];
  const env = {};
  for (const l of lines) {
    const m = l.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

function writeEnv(file, env) {
  const content = Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
  fs.writeFileSync(file, content);
}

const env = parseEnv(envPath);

// ensure placeholders for critical keys
if (!('BACKEND_BASE_URL' in env)) env.BACKEND_BASE_URL = '';
if (!('DATABASE_URL' in env)) env.DATABASE_URL = '';

// enforce mandatory values
env.TRUST_PROXY = 'true';
env.COOKIE_SAMESITE = 'strict';
env.COOKIE_SECURE = 'true';
env.HSTS_MAX_AGE = '31536000';
env.MFA_ENFORCE = 'admin';
env.GATE_ALLOW_SKIPS = 'false';

// database fallback
if (!env.DATABASE_URL && env.STAGING_ALLOW_SQLITE === 'true') {
  env.DATABASE_URL = 'file:./staging.sqlite';
}

writeEnv(envPath, env);

const missing = [];
if (!env.BACKEND_BASE_URL) missing.push('BACKEND_BASE_URL');
if (!env.DATABASE_URL) missing.push('DATABASE_URL');
if (missing.length) {
  console.error('FAIL staging:init - missing ' + missing.join(', '));
  process.exit(1);
}

// prisma self-heal (soft)
spawnSync('node', ['scripts/prisma/self-heal.js'], {
  cwd: root,
  stdio: 'inherit',
});

console.log('PASS staging:init');
