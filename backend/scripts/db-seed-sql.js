const { spawnSync, execSync } = require('child_process');
const path = require('path');

try {
  execSync('docker -v', { stdio: 'inherit' });
} catch (e) {
  console.error('docker is required');
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL || '';
const sqlFile = path.resolve(__dirname, '..', 'sql', '0002_seed_cities_services.sql');

if (dbUrl.startsWith('postgres')) {
  if (process.platform === 'win32') {
    const url = new URL(dbUrl);
    const env = { ...process.env, PGPASSWORD: url.password };
    const sqlDir = path.dirname(sqlFile).replace(/\\/g, '/');
    const args = [
      'run', '--rm',
      '-v', `${sqlDir}:/sql`,
      'postgres:15',
      'psql',
      '-h', url.hostname,
      '-p', url.port || '5432',
      '-U', url.username,
      '-d', url.pathname.slice(1),
      '-v', 'ON_ERROR_STOP=1',
      '-f', '/sql/0002_seed_cities_services.sql'
    ];
    const r = spawnSync('docker', args, { stdio: 'inherit', env });
    process.exit(r.status ?? 0);
  } else {
    const cmd = `docker run --rm -i --network host postgres:15 psql "${dbUrl}" -v ON_ERROR_STOP=1 -f - < "${sqlFile}"`;
    spawnSync(cmd, { stdio: 'inherit', shell: true });
  }
} else if (dbUrl.startsWith('file:')) {
  const dbPath = dbUrl.replace('file:', '');
  const sqlDir = path.resolve(__dirname, '..', 'sql').replace(/\\/g, '/');
  const dataDir = path.resolve(path.dirname(dbPath)).replace(/\\/g, '/');
  const dbFile = path.basename(dbPath);
  const args = [
    'run', '--rm',
    '-v', `${sqlDir}:/sql`,
    '-v', `${dataDir}:/data`,
    'nouchka/sqlite3',
    '/bin/sh',
    '-lc',
    `sqlite3 /data/${dbFile} < /sql/0002_seed_cities_services.sql`
  ];
  const r = spawnSync('docker', args, { stdio: 'inherit' });
  process.exit(r.status ?? 0);
} else {
  console.error('Unsupported DATABASE_URL');
  process.exit(1);
}
