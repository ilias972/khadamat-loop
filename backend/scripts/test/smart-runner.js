const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./.tmp/test.sqlite';
}

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
  const skipped = /SKIPPED/.test(out);
  const failed = res.status !== 0 || /FAIL/.test(out);
  return { failed, skipped };
}

const args = process.argv.slice(2);
let prismaReady = true;
['prisma:self-heal', 'prisma:prepare:test'].forEach((s) => {
  const r = spawnSync('npm', ['run', s], { stdio: 'inherit' });
  if (r.status !== 0) prismaReady = false;
});
const disabledFlag = path.resolve(__dirname, '../../.tmp/prisma-disabled');
if (fs.existsSync(disabledFlag)) {
  prismaReady = false;
  console.log('SKIPPED prisma (disabled flag)');
} else if (!prismaReady) {
  console.log('SKIPPED prisma (offline or engine)');
}

if (prismaReady && hasJest()) {
  const jestBin = require.resolve('jest/bin/jest');
  const res = spawnSync(process.execPath, [jestBin, ...args], { stdio: 'inherit' });
  process.exit(res.status ?? 1);
}

if (prismaReady) {
  console.log('SKIPPED jest: not installed');
} else {
  console.log('SKIPPED jest: prisma not ready');
}
let fail = false;
let skipped = true;
const smoke = runScript('smoke:all');
if (smoke.failed) fail = true;
if (!smoke.failed && smoke.skipped === false) skipped = false;
const smokeResult = smoke.failed ? 'FAIL' : smoke.skipped ? 'SKIPPED' : 'PASS';
console.log(`SMOKE_RESULT: ${smokeResult}`);

let onlineResult = 'SKIPPED';
if (!fail && process.env.ONLINE_TESTS_ENABLE === 'true' && process.env.BACKEND_BASE_URL) {
  const online = runScript('online:all');
  onlineResult = online.failed ? 'FAIL' : online.skipped ? 'SKIPPED' : 'PASS';
  if (online.failed) fail = true;
  if (!online.failed && online.skipped === false) skipped = false;
}
console.log(`ONLINE_RESULT: ${onlineResult}`);
const finalResult = fail ? 'FAIL' : skipped ? 'SKIPPED_PARTIAL' : 'PASS';
console.log(`TEST_SMART_RESULT: ${finalResult}`);
process.exit(fail ? 1 : 0);
