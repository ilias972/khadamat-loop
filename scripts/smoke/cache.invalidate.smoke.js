try {
  require('ts-node/register');
} catch {
  require('../backend/node_modules/ts-node/register');
}
const { cacheSet, cacheGet, stopCache } = require('../../backend/src/utils/cache');
const { invalidateSearchNear } = require('../../backend/src/cache/invalidate');

(async () => {
  try {
    await cacheSet('search:services:smoke', 'v', 60);
    const before = await cacheGet('search:services:smoke');
    if (before === null) {
      console.log('SMOKE:cache.invalidate SKIPPED (no driver)');
      await stopCache();
      return;
    }
    await invalidateSearchNear();
    const after = await cacheGet('search:services:smoke');
    if (after === null) {
      console.log('SMOKE:cache.invalidate PASS');
    } else {
      console.log('SMOKE:cache.invalidate FAIL');
      process.exit(1);
    }
    await stopCache();
  } catch (err) {
    console.log('SMOKE:cache.invalidate FAIL ' + err.message);
    process.exit(1);
  }
})();
