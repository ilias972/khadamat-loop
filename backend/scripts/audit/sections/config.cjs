const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const findings = [];
  const envPath = path.resolve(process.cwd(), '.env.example');
  const envExample = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const inExample = (key) => envExample.includes(key);
  const stage = process.env.NODE_ENV || 'development';
  const isProdLike = ['production', 'staging'].includes(stage);

  const hsts = parseInt(process.env.HSTS_MAX_AGE || '0', 10);
  if (isProdLike) {
    if (!Number.isInteger(hsts) || hsts < 31536000) {
      findings.push({
        id: 'HSTS_MAX_AGE',
        level: 'P0',
        title: 'HSTS max-age incorrect',
        detail: `HSTS_MAX_AGE=${process.env.HSTS_MAX_AGE}`,
        evidence: '',
        fix: 'Définir HSTS_MAX_AGE=31536000 dans .env.production'
      });
    }
    if (process.env.TRUST_PROXY !== 'true') {
      findings.push({
        id: 'TRUST_PROXY',
        level: 'P0',
        title: 'TRUST_PROXY doit être true derrière un proxy',
        detail: `TRUST_PROXY=${process.env.TRUST_PROXY}`,
        evidence: '',
        fix: 'Définir TRUST_PROXY=true dans .env.production'
      });
    }
    if (!process.env.JWT_SECRET) {
      findings.push({
        id: 'JWT_SECRET',
        level: 'P0',
        title: 'JWT_SECRET manquant',
        detail: '',
        evidence: '',
        fix: 'Définir JWT_SECRET (voir .env.example)'
      });
    }
    if (process.env.FRONTEND_URL === '*' || !process.env.FRONTEND_URL) {
      findings.push({
        id: 'FRONTEND_URL',
        level: 'P1',
        title: 'FRONTEND_URL invalide',
        detail: `FRONTEND_URL=${process.env.FRONTEND_URL}`,
        evidence: '',
        fix: 'Définir FRONTEND_URL sans *'
      });
    }
    if ((process.env.CORS_ORIGINS || '').split(',').some((o) => o.trim() === '*')) {
      findings.push({
        id: 'CORS_ORIGINS',
        level: 'P1',
        title: 'CORS trop permissif',
        detail: `CORS_ORIGINS=${process.env.CORS_ORIGINS}`,
        evidence: '',
        fix: 'Restreindre CORS_ORIGINS (voir .env.example)'
      });
    }
  }

  return { name: 'Config', findings, scoreHints: { ok: findings.length === 0 } };
};
