const { execSync, spawnSync } = require('child_process');
const path = require('path');

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

try {
  execSync('docker -v', { stdio: 'inherit' });
} catch (e) {
  console.error('docker is required');
  process.exit(1);
}

const sqlFile = path.resolve(__dirname, '..', 'sql', '0001_init_postgres.sql');

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
    '-f', '/sql/0001_init_postgres.sql'
  ];
  const r = spawnSync('docker', args, { stdio: 'inherit', env });
  process.exit(r.status ?? 0);
} else {
  const cmd = `docker run --rm -i --network host postgres:15 psql "${dbUrl}" -v ON_ERROR_STOP=1 -f - < "${sqlFile}"`;
  spawnSync(cmd, { stdio: 'inherit', shell: true });
}
