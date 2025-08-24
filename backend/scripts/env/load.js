const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const dashIndex = args.indexOf('--');
const beforeDash = dashIndex === -1 ? args : args.slice(0, dashIndex);
const cmd = dashIndex === -1 ? [] : args.slice(dashIndex + 1);

let files = [];
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

if (files.length === 0) {
  const prod = path.resolve('backend/.env.production');
  const local = path.resolve('backend/.env');
  if (fs.existsSync(prod)) files.push(prod);
  else if (fs.existsSync(local)) files.push(local);
  else console.log('SKIPPED no env');
}

const loaded = [];
for (const envFile of files) {
  if (!fs.existsSync(envFile)) {
    console.log(`SKIPPED ${envFile}`);
    continue;
  }
  const content = fs.readFileSync(envFile, 'utf8');
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
  loaded.push(envFile);
}
if (loaded.length) console.log('ENV LOADED:', loaded.join(' '));

if (cmd.length === 0) process.exit(0);
const child = spawn(cmd[0], cmd.slice(1), { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 0));
