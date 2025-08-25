const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const findings = [];
  const serverPath = path.resolve(__dirname, '../../../src/app.ts');
  const content = fs.existsSync(serverPath) ? fs.readFileSync(serverPath, 'utf8') : '';
  if (!(content.includes('adminIpAllowList') && content.includes('requireMfa'))) {
    findings.push({
      id: 'ADMIN_PROTECTION',
      level: 'P0',
      title: 'Routes admin sans MFA/IP allow-list',
      detail: '',
      evidence: '',
      fix: 'Appliquer authenticate + requireRole + requireMfa + ipAllowList'
    });
  }
  const auditMiddleware = path.resolve(__dirname, '../../../src/middlewares/audit.ts');
  if (!fs.existsSync(auditMiddleware)) {
    findings.push({
      id: 'AUDIT_LOG',
      level: 'P1',
      title: 'Audit log d\'actions manquant',
      detail: '',
      evidence: '',
      fix: 'Implémenter middleware audit'
    });
  }
  return { name: 'Admin/Moderation', findings, scoreHints: { ok: findings.length === 0 } };
};
