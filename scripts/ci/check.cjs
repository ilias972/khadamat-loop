const { spawnSync } = require('child_process');

const required = ['BACKEND_BASE_URL'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.log('CI_CHECK SKIPPED missing ' + missing.join(','));
  process.exit(0);
}

const tests = ['smoke:webhooks', 'smoke:search', 'smoke:pii'];
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
if (fail) process.exit(1);
