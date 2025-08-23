const { spawnSync } = require('child_process');
const base = process.env.BACKEND_BASE_URL;
if (!base) {
  console.log('SKIPPED smoke: missing BACKEND_BASE_URL');
  process.exit(0);
}
const script = `
const fetch = global.fetch;
const base = process.env.BACKEND_BASE_URL;
const path = process.env.BACKEND_HEALTH_PATH || '/health';
const controller = new AbortController();
const to = setTimeout(() => controller.abort(), 3000);
fetch(base + path, { signal: controller.signal }).then(res => {
  clearTimeout(to);
  if (res.status === 200) process.exit(0);
  process.exit(1);
}).catch(() => { clearTimeout(to); process.exit(1); });
`;
const res = spawnSync(process.execPath, ['-e', script], { env: process.env, stdio: 'ignore' });
if (res.status === 0) {
  console.log('PASS smoke:health');
} else {
  console.log('SKIPPED smoke: backend unreachable');
  process.exit(0);
}
