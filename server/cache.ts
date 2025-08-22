import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;
const defaultTtl = parseInt(process.env.CACHE_TTL_SECONDS || '600', 10);
let client: any;
const memory = new Map<string, { value: string; expires: number }>();

if (redisUrl) {
  client = createClient({ url: redisUrl });
  client.on('error', () => {});
  client.connect().catch(() => {});
}

export async function cacheGet(key: string): Promise<string | null> {
  if (client) {
    return client.get(key);
  }
  const item = memory.get(key);
  if (!item) return null;
  if (item.expires < Date.now()) {
    memory.delete(key);
    return null;
  }
  return item.value;
}

export async function cacheSet(key: string, value: string, ttl = defaultTtl): Promise<void> {
  if (client) {
    await client.set(key, value, { EX: ttl });
    return;
  }
  memory.set(key, { value, expires: Date.now() + ttl * 1000 });
}

export async function cacheDel(key: string): Promise<void> {
  if (client) {
    await client.del(key);
    return;
  }
  memory.delete(key);
}
