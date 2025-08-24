const fs = require('fs');
const path = require('path');

function pad(n) {
  return n.toString().padStart(2, '0');
}

async function writeReports({ findings, score, generatedAt }) {
  const dir = path.resolve(__dirname, '../../reports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const d = new Date(generatedAt);
  const base = `audit-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
  const jsonPath = path.join(dir, `${base}.json`);
  const mdPath = path.join(dir, `${base}.md`);

  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
  const json = {
    score,
    generatedAt,
    findings,
    versions: { node: process.version, app: { name: pkg.name, version: pkg.version } }
  };
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));

  const p0 = findings.filter((f) => f.level === 'P0');
  const p1 = findings.filter((f) => f.level === 'P1');
  const p2 = findings.filter((f) => f.level === 'P2');

  const lines = [];
  lines.push(`# Audit Report`);
  lines.push(`Date: ${generatedAt}`);
  lines.push(`Score: ${score}/100`);
  lines.push('');
  lines.push('|Level|ID|Title|');
  lines.push('|---|---|---|');
  findings.forEach((f) => lines.push(`|${f.level}|${f.id}|${f.title}|`));
  lines.push('');
  lines.push('## Actions immédiates');
  p0.slice(0, 5).forEach((f) => lines.push(`- ${f.title} (fix: ${f.fix})`));
  fs.writeFileSync(mdPath, lines.join('\n'));

  return { jsonPath, mdPath };
}

module.exports = { writeReports };
