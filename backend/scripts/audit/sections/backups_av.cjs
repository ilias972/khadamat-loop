module.exports = async function () {
  const findings = [];
  if (process.env.BACKUP_ENABLE === 'true' && !process.env.BACKUP_DIR) {
    findings.push({
      id: 'BACKUP_DIR',
      level: 'P1',
      title: 'Répertoire de backup non défini',
      detail: '',
      evidence: '',
      fix: 'Définir BACKUP_DIR'
    });
  }
  if (process.env.UPLOAD_ANTIVIRUS === 'true' && !process.env.CLAMAV_HOST) {
    findings.push({
      id: 'AV_REACH',
      level: 'P1',
      title: 'Antivirus activé mais unreachable',
      detail: '',
      evidence: '',
      fix: 'Configurer CLAMAV_HOST'
    });
  }
  return { name: 'Backups/AV', findings, scoreHints: { ok: findings.length === 0 } };
};
