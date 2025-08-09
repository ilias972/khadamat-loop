import { redis } from '../config/redis';

export async function cacheGet(key: string) {
  if (!redis) return null;
  const val = await redis.get(key);
  return val ? JSON.parse(val) : null;
}

export async function cacheSet(key: string, val: any, ttlSec = 300) {
  if (!redis) return;
  await redis.set(key, JSON.stringify(val), { EX: ttlSec });
}
