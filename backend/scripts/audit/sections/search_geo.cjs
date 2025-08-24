const fs = require('fs');
const path = require('path');

module.exports = async function () {
  const findings = [];
  const routesPath = path.resolve(__dirname, '../../../src/routes/search.ts');
  const content = fs.existsSync(routesPath) ? fs.readFileSync(routesPath, 'utf8') : '';
  if (!content.includes("/api/services/search")) {
    findings.push({
      id: 'SEARCH_ENDPOINT',
      level: 'P1',
      title: 'Endpoint /api/services/search manquant',
      detail: '',
      evidence: '',
      fix: 'Ajouter route de recherche'
    });
  }
  if (!content.includes('/api/suggest/services')) {
    findings.push({
      id: 'SUGGEST_SERVICES',
      level: 'P1',
      title: 'Endpoint suggestion services manquant',
      detail: '',
      evidence: '',
      fix: 'Ajouter route /api/suggest/services'
    });
  }
  if (!content.includes('/api/suggest/cities')) {
    findings.push({
      id: 'SUGGEST_CITIES',
      level: 'P1',
      title: 'Endpoint suggestion villes manquant',
      detail: '',
      evidence: '',
      fix: 'Ajouter route /api/suggest/cities'
    });
  }
  const radius = parseInt(process.env.SEARCH_RADIUS_KM || '0', 10);
  if (radius < 5 || radius > 100) {
    findings.push({
      id: 'SEARCH_RADIUS',
      level: 'P1',
      title: 'Radius recherche hors bornes',
      detail: `SEARCH_RADIUS_KM=${process.env.SEARCH_RADIUS_KM}`,
      evidence: '',
      fix: 'Limiter entre 5 et 100'
    });
  }
  return { name: 'Search/Geo', findings, scoreHints: { ok: findings.length === 0 } };
};
