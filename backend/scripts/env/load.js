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

let loaded = 0;
for (const f of files) {
  const abs = path.resolve(f);
  if (!fs.existsSync(abs)) {
    console.log(`FALLBACK ${f}`);
    continue;
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
  loaded++;
  console.log(`ENV LOADED FROM ${f}`);
}

if (!loaded) {
  const fallbacks = ['./.env', './.env.local', './.env.local.example'];
  for (const f of fallbacks) {
    const abs = path.resolve(f);
    if (fs.existsSync(abs)) {
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
      loaded++;
      console.log(`ENV LOADED FROM ${f}`);
      break;
    } else {
      console.log(`FALLBACK ${f}`);
    }
  }
  if (!loaded) console.log('NO ENV FILE LOADED');
}

if (cmd.length === 0) process.exit(0);
const child = spawn(cmd[0], cmd.slice(1), { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
