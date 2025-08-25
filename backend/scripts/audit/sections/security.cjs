const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const findings = [];
  const serverPath = path.resolve(__dirname, '../../../src/server.ts');
  const content = fs.existsSync(serverPath) ? fs.readFileSync(serverPath, 'utf8') : '';
  if (content.includes("'unsafe-inline")) {
    findings.push({
      id: 'CSP_UNSAFE',
      level: 'P1',
      title: "CSP contient 'unsafe-inline'",
      detail: '',
      evidence: '',
      fix: 'Retirer unsafe-inline de CSP'
    });
  }
  if ((process.env.CORS_ORIGINS || '').split(',').some((o) => o.trim() === '*')) {
    findings.push({
      id: 'CORS_PERMISSIVE',
      level: 'P1',
      title: 'CORS non restreint',
      detail: `CORS_ORIGINS=${process.env.CORS_ORIGINS}`,
      evidence: '',
      fix: 'Restreindre CORS_ORIGINS'
    });
  }
  const cookieOk =
    process.env.COOKIE_SECURE === 'true' && ['lax', 'strict'].includes(process.env.COOKIE_SAMESITE || '');
  if (!cookieOk) {
    const prodLike = ['production', 'staging'].includes(process.env.NODE_ENV || '');
    const requireSecure = prodLike && process.env.TRUST_PROXY === 'true';
    findings.push({
      id: 'COOKIE_FLAGS',
      level: requireSecure ? 'P0' : 'P1',
      title: 'Cookies non sécurisés',
      detail: '',
      evidence: '',
      fix: 'Configurer COOKIE_SECURE=true et COOKIE_SAMESITE=strict'
    });
  }
  if (process.env.UPLOAD_ANTIVIRUS === 'true' && !process.env.CLAMAV_HOST) {
    findings.push({
      id: 'AV_CONFIG',
      level: 'P0',
      title: 'Antivirus activé mais non configuré',
      detail: '',
      evidence: '',
      fix: 'Définir CLAMAV_HOST'
    });
  }
  return { name: 'Security', findings, scoreHints: { ok: findings.length === 0 } };
};
