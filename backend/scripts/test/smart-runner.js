const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function hasJest() {
  try {
    require.resolve('jest');
    return true;
  } catch (e) {
    const bin = path.join(__dirname, '../../node_modules/.bin/jest');
    return fs.existsSync(bin);
  }
}

function runScript(name) {
  const res = spawnSync('npm', ['run', name], { encoding: 'utf-8' });
  const out = (res.stdout || '') + (res.stderr || '');
  process.stdout.write(out);
  if (/SKIPPED/.test(out)) skipped = true;
  if (res.status !== 0 || /FAIL/.test(out)) fail = true;
  return res.status;
}

const args = process.argv.slice(2);
if (hasJest()) {
  const jestBin = require.resolve('jest/bin/jest');
  const res = spawnSync(process.execPath, [jestBin, ...args], { stdio: 'inherit' });
  process.exit(res.status ?? 1);
}

console.log('SKIPPED jest: not installed');
let fail = false;
let skipped = true;
runScript('smoke:all');
if (!fail && process.env.ONLINE_TESTS_ENABLE === 'true' && process.env.BACKEND_BASE_URL) {
  runScript('online:all');
}
const finalResult = fail ? 'FAIL' : skipped ? 'SKIPPED_PARTIAL' : 'PASS';
console.log(`TEST_SMART_RESULT: ${finalResult}`);
process.exit(fail ? 1 : 0);
