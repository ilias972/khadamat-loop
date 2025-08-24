const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const findings = [];
  const schemaPath = path.resolve(__dirname, '../../../prisma/schema.prisma');
  const schema = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf8') : '';
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    findings.push({
      id: 'STRIPE_SIGN',
      level: 'P0',
      title: 'Signature webhook Stripe manquante',
      detail: '',
      evidence: '',
      fix: 'Définir STRIPE_WEBHOOK_SECRET'
    });
  }
  const hasModel = /model\s+WebhookEvent[\s\S]*@@unique\(\[provider,\s*eventId\]\)/m.test(schema);
  const runtimeOk = process.env.WEBHOOK_IDEMPOTENCE_OK === 'true';
  if (!hasModel && !runtimeOk) {
    findings.push({
      id: 'IDEMPOTENCE',
      level: 'P0',
      title: 'Table d\'idempotence webhook absente',
      detail: '',
      evidence: '',
      fix: 'Ajouter modèle WebhookEvent avec @@unique([provider,eventId])'
    });
  }
  if (!schema.includes('webhookDLQ')) {
    findings.push({
      id: 'DLQ',
      level: 'P1',
      title: 'DLQ webhook inactif',
      detail: '',
      evidence: '',
      fix: 'Ajouter table webhookDLQ et runner'
    });
  }
  return { name: 'Payments', findings, scoreHints: { ok: findings.length === 0 } };
};
