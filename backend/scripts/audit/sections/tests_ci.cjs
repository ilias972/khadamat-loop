const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const findings = [];
  const pkgPath = path.resolve(__dirname, '../../../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (!pkg.scripts || !pkg.scripts['test:ci']) {
    findings.push({
      id: 'TEST_CI',
      level: 'P1',
      title: 'Script test:ci absent',
      detail: '',
      evidence: '',
      fix: 'Ajouter script test:ci'
    });
  }
  const smokeDir = path.resolve(__dirname, '../../../scripts/smoke');
  if (!fs.existsSync(smokeDir)) {
    findings.push({
      id: 'SMOKE_TESTS',
      level: 'P2',
      title: 'Smoke tests absents',
      detail: '',
      evidence: '',
      fix: 'Ajouter scripts de smoke tests'
    });
  }
  return { name: 'Tests/CI', findings, scoreHints: { ok: findings.length === 0 } };
};
