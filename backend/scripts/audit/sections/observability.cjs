const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const findings = [];
  const serverPath = path.resolve(__dirname, '../../../src/server.ts');
  const content = fs.existsSync(serverPath) ? fs.readFileSync(serverPath, 'utf8') : '';
  if (!content.includes("app.get('/health")) {
    findings.push({
      id: 'HEALTH_ROUTE',
      level: 'P1',
      title: 'Route /health absente',
      detail: '',
      evidence: '',
      fix: 'Ajouter /health'
    });
  }
  if (!content.includes("app.get('/ready")) {
    findings.push({
      id: 'READY_ROUTE',
      level: 'P1',
      title: 'Route /ready absente',
      detail: '',
      evidence: '',
      fix: 'Ajouter /ready'
    });
  }
  if (!content.includes('setupMetrics')) {
    findings.push({
      id: 'METRICS',
      level: 'P1',
      title: 'Metrics non exposées',
      detail: '',
      evidence: '',
      fix: 'Activer /metrics'
    });
  }
  if (!process.env.SENTRY_DSN) {
    findings.push({
      id: 'SENTRY',
      level: 'P2',
      title: 'Sentry non configuré',
      detail: '',
      evidence: '',
      fix: 'Définir SENTRY_DSN'
    });
  }
  return { name: 'Observability', findings, scoreHints: { ok: findings.length === 0 } };
};
