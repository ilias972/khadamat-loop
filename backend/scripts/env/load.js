const fs = require('fs');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const dashIndex = args.indexOf('--');
const files = dashIndex === -1 ? args : args.slice(0, dashIndex);
const cmd = dashIndex === -1 ? [] : args.slice(dashIndex + 1);

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
}

if (cmd.length === 0) process.exit(0);

const child = spawn(cmd[0], cmd.slice(1), { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 0));
