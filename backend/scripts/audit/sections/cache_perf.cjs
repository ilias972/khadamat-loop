module.exports = async function () {
  const findings = [];
  if (!process.env.CACHE_TTL_SECONDS) {
    findings.push({
      id: 'CACHE_TTL',
      level: 'P2',
      title: 'TTL cache par défaut manquant',
      detail: '',
      evidence: '',
      fix: 'Définir CACHE_TTL_SECONDS'
    });
  }
  if (!process.env.CACHE_NAMESPACE) {
    findings.push({
      id: 'CACHE_NAMESPACE',
      level: 'P2',
      title: 'Namespace cache absent',
      detail: '',
      evidence: '',
      fix: 'Définir CACHE_NAMESPACE'
    });
  }
  return { name: 'Cache/Perf', findings, scoreHints: { ok: findings.length === 0 } };
};
