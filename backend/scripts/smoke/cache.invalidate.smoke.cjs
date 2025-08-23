#!/usr/bin/env node
const path = require('path');
const { randomUUID } = require('crypto');

(async () => {
  // Strategy A: local module
  try {
    const cache = require(path.resolve(__dirname, '../../dist/utils/cache.js'));
    if (cache && cache.cacheSet && cache.cacheDel && cache.cacheGet) {
      const key = `smoke:cache:${randomUUID()}`;
      await cache.cacheSet(key, '1', 60);
      await cache.cacheDel(key);
      const val = await cache.cacheGet(key);
      if (val === null) {
        console.log('PASS cache.invalidate');
        process.exit(0);
      } else {
        console.log('FAIL cache.invalidate: key still present');
        process.exit(1);
      }
    }
  } catch (e) {
    // ignore and try HTTP
  }

  const base = process.env.BACKEND_BASE_URL;
  const token = process.env.SMOKE_ADMIN_BEARER;
  if (base && token) {
    try {
      const url = base.replace(/\/$/, '') + '/api/admin/cache/smoke';
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 200 && body && body.data && body.data.invalidated) {
        console.log('PASS cache.invalidate');
        process.exit(0);
      }
      console.log(`FAIL cache.invalidate: HTTP ${res.status}`);
      process.exit(1);
    } catch (e) {
      console.log(`FAIL cache.invalidate: ${e.message}`);
      process.exit(1);
    }
  } else {
    console.log('SKIPPED cache.invalidate: missing dist or BACKEND_BASE_URL/SMOKE_ADMIN_BEARER');
  }
})();
