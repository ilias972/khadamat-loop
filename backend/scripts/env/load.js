const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const dashIndex = args.indexOf('--');
const beforeDash = dashIndex === -1 ? args : args.slice(0, dashIndex);
const cmd = dashIndex === -1 ? [] : args.slice(dashIndex + 1);

const files = [];
for (let i = 0; i < beforeDash.length; i++) {
  const a = beforeDash[i];
  if (a === '--env-file') {
    i++;
    while (i < beforeDash.length && !beforeDash[i].startsWith('--')) {
      files.push(beforeDash[i]);
      i++;
    }
    i--;
  } else if (!a.startsWith('--')) {
    files.push(a);
  }
}

function loadFile(fp) {
  const abs = path.resolve(fp);
  if (!fs.existsSync(abs)) {
    console.log(`FALLBACK ${fp}`);
    return false;
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
  console.log(`ENV LOADED FROM ${fp}`);
  return true;
}

let loaded = 0;
for (const f of files) {
  if (loadFile(f)) loaded++;
}

if (!loaded) {
  const fallbacks = ['./.env', './.env.local', './.env.sample.local', './.env.local.example'];
  for (const f of fallbacks) {
    if (f === './.env.local.example' && fs.existsSync(path.resolve('./.env.local'))) {
      console.log(`SKIPPED ${f}`);
      continue;
    }
    if (loadFile(f)) loaded++;
  }
  if (!loaded) console.log('NO ENV FILE LOADED');
}

if (process.env.ONLINE_STRICT === undefined) {
  process.env.ONLINE_STRICT = 'true';
}
if (!process.env.TOKENS_ENV_FILE) {
  process.env.TOKENS_ENV_FILE = './backend/.env.tokens.staging';
}

if (cmd.length === 0) process.exit(0);
const child = spawn(cmd[0], cmd.slice(1), { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
