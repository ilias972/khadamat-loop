const { spawnSync } = require('child_process');

const required = ['BACKEND_BASE_URL'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.log('CI_CHECK SKIPPED missing ' + missing.join(','));
  console.log('CI_GATE_RESULT: SKIPPED_PARTIAL');
  process.exit(0);
}

const tests = ['smoke:webhooks', 'smoke:search', 'smoke:pii'];
if (process.env.ONLINE_TESTS_ENABLE === 'true') {
  tests.push('online:all');
}
let pass = 0, fail = 0, skipped = 0;
for (const t of tests) {
  const res = spawnSync('npm', ['run', t], { encoding: 'utf-8' });
  const out = (res.stdout || '') + (res.stderr || '');
  process.stdout.write(out);
  if (/SKIPPED/.test(out)) skipped++;
  else if (res.status !== 0 || /FAIL/.test(out)) fail++;
  else pass++;
}
console.log(`CI_CHECK SUMMARY PASS:${pass} SKIPPED:${skipped} FAIL:${fail}`);
const gate = fail > 0 ? 'FAIL' : skipped > 0 ? 'SKIPPED_PARTIAL' : 'PASS';
console.log(`CI_GATE_RESULT: ${gate}`);
if (fail) process.exit(1);
