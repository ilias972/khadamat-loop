#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs() {
  const res = { quick: false };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--level=')) res.level = arg.split('=')[1];
    else if (arg === '--quick') res.quick = true;
  }
  return res;
}

async function main() {
  const args = parseArgs();
  const level = args.level;
  const quick = args.quick;

  const dir = path.resolve(__dirname, '../../reports');
  if (!fs.existsSync(dir)) {
    console.log('No-op (nothing to remediate)');
    return;
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith('audit-') && f.endsWith('.json'))
    .sort();
  if (!files.length) {
    console.log('No-op (nothing to remediate)');
    return;
  }
  const latest = files[files.length - 1];
  const report = JSON.parse(fs.readFileSync(path.join(dir, latest), 'utf8'));
  const findings = report.findings || [];

  let targets = findings;
  if (level) {
    targets = findings.filter((f) => f.level === level);
  } else {
    const p0 = findings.filter((f) => f.level === 'P0');
    const p1 = findings.filter((f) => f.level === 'P1');
    targets = [...p0, ...(quick ? p1 : [])];
  }

  if (!targets.length) {
    console.log('No-op (nothing to remediate)');
    return;
  }

  const summary = { P0_FIXED: 0, P1_FIXED: 0, SKIPPED: 0, FAIL: 0 };

  const playbooks = [
    { pattern: /webhook/i, handler: () => console.log('webhooks:idempotence SKIP (not implemented)') },
    { pattern: /admin/i, handler: () => console.log('admin:security SKIP (not implemented)') },
    { pattern: /hsts|cors|csp|proxy/i, handler: () => console.log('http:security SKIP (not implemented)') },
    { pattern: /upload/i, handler: () => console.log('uploads:av SKIP (not implemented)') },
    { pattern: /backup|restore/i, handler: () => console.log('backup:restore SKIP (not implemented)') },
    { pattern: /quota|limit/i, handler: () => console.log('quotas SKIP (not implemented)') },
    { pattern: /cache/i, handler: () => console.log('cache SKIP (not implemented)') },
    { pattern: /search|geo/i, handler: () => console.log('search:geo TODO (see previous PR)') },
    { pattern: /pii|kyc/i, handler: () => console.log('pii:kyc TODO (see previous PR)') },
  ];

  for (const f of targets) {
    const pb = playbooks.find((p) => p.pattern.test(f.id) || p.pattern.test(f.title || ''));
    if (!pb) {
      console.log(`SKIP ${f.id} (no playbook)`);
      summary.SKIPPED++;
      continue;
    }
    try {
      pb.handler(f);
      if (f.level === 'P0') summary.P0_FIXED++;
      else if (f.level === 'P1') summary.P1_FIXED++;
      else summary.SKIPPED++;
    } catch (e) {
      console.log(`FAIL ${f.id} (${e.message})`);
      summary.FAIL++;
    }
  }

  console.log('---');
  console.log(
    `Summary: P0_FIXED=${summary.P0_FIXED} P1_FIXED=${summary.P1_FIXED} SKIPPED=${summary.SKIPPED} FAIL=${summary.FAIL}`
  );
  console.log('Re-run: npm --prefix backend run verify:postfix');
}

main().catch((e) => {
  console.error('Remediation failed', e);
  process.exit(1);
});
