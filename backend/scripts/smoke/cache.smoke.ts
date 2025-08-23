const assert = require('assert');
const Module = require('module');
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'redis') {
    return {
      createClient: () => ({
        on: () => {},
        connect: async () => {},
        quit: async () => {},
      }),
    };
  }
  return originalLoad(request, parent, isMain);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runMemory() {
  process.env.MOCK_REDIS = 'true';
  const cache = require('../../src/utils/cache');
  const max = parseInt(process.env.CACHE_MEM_MAX_KEYS || '5000', 10);
  await cache.cacheSet('test:key', 'v', 1);
  const val = await cache.cacheGet('test:key');
  assert.strictEqual(val, 'v', 'get failed');
  await sleep(1100);
  const expired = await cache.cacheGet('test:key');
  assert.strictEqual(expired, null, 'ttl failed');
  for (let i = 0; i < max + 10; i++) {
    await cache.cacheSet(`lru:${i}`, String(i));
  }
  const first = await cache.cacheGet('lru:0');
  assert.strictEqual(first, null, 'lru failed');
  await cache.stopCache();
}

async function runRedis() {
  if (!process.env.REDIS_URL) return;
  delete process.env.MOCK_REDIS;
  delete require.cache[require.resolve('../../src/utils/cache')];
  const cache = require('../../src/utils/cache');
  await cache.cacheSet('test:r', '1', 1);
  const val = await cache.cacheGet('test:r');
  assert.strictEqual(val, '1');
  await cache.cacheDel('test:r');
  await cache.stopCache();
  try {
    const res = await fetch('http://localhost:3000/metrics', {
      headers: { Authorization: `Bearer ${process.env.METRICS_TOKEN || ''}` },
    });
    const txt = await res.text();
    if (!txt.includes('cache_hits_total') || !txt.includes('driver="redis"')) {
      throw new Error('metrics label missing');
    }
  } catch (e) {
    throw e;
  }
}

(async () => {
  try {
    await runMemory();
    await runRedis();
    console.log('PASS cache');
  } catch (e) {
    console.log(`FAIL cache: ${e.message}`);
    process.exit(1);
  }
})();
