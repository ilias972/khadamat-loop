import { redis } from '../config/redis';
import { logger } from '../config/logger';

async function delPattern(pattern: string) {
  if (redis) {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(keys);
  } else {
    logger.info('CACHE_INVALIDATION_FALLBACK', { pattern });
  }
}

export async function invalidateServiceCatalog() {
  await delPattern('services:catalog:*');
}

export async function invalidateSuggest() {
  await delPattern('suggest:services:*');
  await delPattern('suggest:cities:*');
}

export async function invalidateSearchNear() {
  await delPattern('search:services:*');
}
