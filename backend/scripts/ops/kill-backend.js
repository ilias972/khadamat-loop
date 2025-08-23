const fs = require('fs');
const path = require('path');

const pidFile = path.resolve(__dirname, '../../.tmp/spawn.pid');
if (!fs.existsSync(pidFile)) {
  console.log('SKIPPED kill-backend: no pid');
  process.exit(0);
}

const pid = parseInt(fs.readFileSync(pidFile, 'utf8'), 10);
try {
  process.kill(pid);
} catch {
  // ignore
}
try {
  fs.unlinkSync(pidFile);
} catch {}
console.log('PASS kill-backend');
