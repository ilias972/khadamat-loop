const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const findings = [];
  if (!process.env.STRIPE_IDENTITY_WEBHOOK_SECRET) {
    findings.push({
      id: 'KYC_SIGN',
      level: 'P0',
      title: 'Signature webhook KYC manquante',
      detail: '',
      evidence: '',
      fix: 'Définir STRIPE_IDENTITY_WEBHOOK_SECRET'
    });
  }
  const keyringPath = path.resolve(__dirname, '../../../src/config/keyring.ts');
  const keyring = fs.existsSync(keyringPath) ? fs.readFileSync(keyringPath, 'utf8') : '';
  if (!/keyId/.test(keyring)) {
    findings.push({
      id: 'KEYRING',
      level: 'P1',
      title: 'Keyring sans keyId',
      detail: '',
      evidence: '',
      fix: 'Utiliser AES-GCM avec keyId'
    });
  }
  return { name: 'KYC/PII', findings, scoreHints: { ok: findings.length === 0 } };
};
