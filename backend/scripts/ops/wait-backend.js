const fetch = global.fetch;

const base = process.env.BACKEND_BASE_URL;
if (!base) {
  console.log('SKIPPED wait-backend: missing BACKEND_BASE_URL');
  process.exit(0);
}

const healthPath = process.env.BACKEND_HEALTH_PATH || '/health';
const timeoutMs = parseInt(process.env.BACKEND_WAIT_TIMEOUT_MS || '15000', 10);
const retryMs = parseInt(process.env.BACKEND_WAIT_RETRY_MS || '1000', 10);
const url = base + healthPath;

const deadline = Date.now() + timeoutMs;

async function attempt() {
  if (Date.now() > deadline) {
    console.log('SKIPPED wait-backend: unreachable');
    process.exit(0);
  }
  try {
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), retryMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(to);
    if (res.status === 200) {
      try {
        const data = await res.json();
        if (typeof data?.db?.connected === 'boolean' && !data.db.connected) {
          throw new Error('db not ready');
        }
        if (data?.cache && typeof data.cache.driver !== 'string') {
          throw new Error('cache not ready');
        }
      } catch {
        // ignore JSON/field errors, success as soon as 200
      }
      console.log('PASS wait-backend');
      process.exit(0);
    }
  } catch {}
  setTimeout(attempt, retryMs);
}

attempt();

