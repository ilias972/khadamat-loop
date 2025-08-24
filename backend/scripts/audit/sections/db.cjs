const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const findings = [];
  const schemaPath = path.resolve(__dirname, '../../../prisma/schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    return { name: 'DB', findings: [{ id: 'SCHEMA_MISSING', level: 'P0', title: 'schema.prisma absent', detail: '', evidence: '', fix: '' }], scoreHints: { ok: false } };
  }
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const models = ['RefreshToken', 'Notification', 'Message', 'Booking'];
  models.forEach((m) => {
    const regex = new RegExp(`model\\s+${m}[\\s\\S]*?onDelete: \\s*Cascade`, 'm');
    if (!regex.test(schema)) {
      findings.push({
        id: `FK_${m.toUpperCase()}`,
        level: 'P1',
        title: `onDelete Cascade manquant pour ${m}`,
        detail: '',
        evidence: '',
        fix: `Ajouter onDelete: Cascade dans le modèle ${m}`
      });
    }
  });
  if (!schema.includes('@@index([city, service])')) {
    findings.push({
      id: 'IDX_PROVIDER_SEARCH',
      level: 'P1',
      title: 'Index recherche provider manquant',
      detail: '',
      evidence: '',
      fix: 'Ajouter @@index([city, service])'
    });
  }
  return { name: 'DB', findings, scoreHints: { ok: findings.length === 0 } };
};
