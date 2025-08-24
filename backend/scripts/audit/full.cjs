#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const ci = args.includes('--ci');
const online = args.includes('--online');

const sections = [
  'architecture',
  'config',
  'db',
  'security',
  'payments',
  'kyc_pii',
  'cache_perf',
  'observability',
  'search_geo',
  'admin_moderation',
  'tests_ci',
  'backups_av'
];

async function runSection(name) {
  try {
    const mod = require(path.join(__dirname, 'sections', name + '.cjs'));
    return await mod({ online });
  } catch (e) {
    return {
      name,
      findings: [
        {
          id: 'ERROR',
          level: 'P0',
          title: 'Section failed',
          detail: e.message,
          evidence: '',
          fix: ''
        }
      ],
      scoreHints: { ok: false }
    };
  }
}

(async () => {
  const results = await Promise.all(sections.map(runSection));
  const findings = [];
  for (const r of results) {
    for (const f of r.findings) findings.push({ section: r.name, ...f });
  }
  const scoreWeights = { P0: 15, P1: 5, P2: 2 };
  let score = 100;
  for (const f of findings) {
    score -= scoreWeights[f.level] || 0;
  }
  if (score < 0) score = 0;
  const p0 = findings.filter((f) => f.level === 'P0');
  const p1 = findings.filter((f) => f.level === 'P1');
  const p2 = findings.filter((f) => f.level === 'P2');

  const timestamp = new Date();
  const { writeReports } = require('./report.cjs');
  const { jsonPath, mdPath } = await writeReports({
    findings,
    score,
    generatedAt: timestamp.toISOString()
  });

  console.log(`[AUDIT] Score: ${score}/100`);
  console.log(`[AUDIT] P0: ${p0.length} | P1: ${p1.length} | P2: ${p2.length}`);
  if (!ci && p0.length) {
    console.log('[AUDIT] Top P0:');
    p0.slice(0, 5).forEach((f) => {
      console.log(` - ${f.title} (fix: ${f.fix})`);
    });
  }
  if (!ci) {
    console.log('[AUDIT] Rapports:');
    console.log(` - ${path.relative(process.cwd(), mdPath)}`);
    console.log(` - ${path.relative(process.cwd(), jsonPath)}`);
  }
})();
