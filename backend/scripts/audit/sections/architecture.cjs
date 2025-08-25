const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const findings = [];
  const serverPath = path.resolve(__dirname, '../../../src/app.ts');
  const content = fs.existsSync(serverPath) ? fs.readFileSync(serverPath, 'utf8') : '';
  if (!content.includes("app.use('/api")) {
    findings.push({
      id: 'API_MOUNT',
      level: 'P1',
      title: '/api non monté',
      detail: '',
      evidence: '',
      fix: "Assurer app.use('/api', ...)"
    });
  }
  if (!(content.includes('adminIpAllowList') && content.includes('requireMfa'))) {
    findings.push({
      id: 'ADMIN_GUARD',
      level: 'P0',
      title: 'Protection admin manquante',
      detail: '',
      evidence: '',
      fix: 'Ajouter IP allow-list + MFA'
    });
  }
  const repoDir = path.resolve(__dirname, '../../../src/repositories');
  if (!fs.existsSync(repoDir)) {
    findings.push({
      id: 'REPOSITORY_LAYER',
      level: 'P2',
      title: 'Repository layer manquante',
      detail: '',
      evidence: '',
      fix: 'Introduire un dossier repositories/'
    });
  }
  return { name: 'Architecture', findings, scoreHints: { ok: findings.length === 0 } };
};
