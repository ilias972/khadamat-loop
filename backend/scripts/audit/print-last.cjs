#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const dir = path.resolve(__dirname, '../../reports');
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => f.startsWith('audit-') && f.endsWith('.json')).sort()
      : [];
    if (!files.length) {
      console.log('No audit reports found');
      return;
    }
    const latest = files[files.length - 1];
    const data = JSON.parse(fs.readFileSync(path.join(dir, latest), 'utf8'));
    const p0 = data.findings?.filter((f) => f.level === 'P0').length || 0;
    const p1 = data.findings?.filter((f) => f.level === 'P1').length || 0;
    const p2 = data.findings?.filter((f) => f.level === 'P2').length || 0;
    console.log(`Score: ${data.score}`);
    console.log(`P0: ${p0} P1: ${p1} P2: ${p2}`);
    console.log(`Report: ${latest}`);
  } catch (e) {
    console.error('print-last failed', e.message);
    process.exit(1);
  }
})();
