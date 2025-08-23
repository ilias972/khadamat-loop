import crypto from 'crypto';

export interface Cache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  ttl?(key: string): Promise<number>;
  incr?(key: string): Promise<number>;
}

const defaultTtl = parseInt(process.env.CACHE_TTL_SECONDS || '600', 10);

function hashKey(key: string): string {
  return crypto.createHash('sha1').update(key).digest('hex').slice(0, 8);
}

class MemoryCache implements Cache {
  private store = new Map<string, { value: string; expires: number }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expires <= Date.now()) {
      this.store.delete(key);
      console.log('CACHE_EXPIRE', { key: hashKey(key) });
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttl: number = defaultTtl): Promise<void> {
    this.store.set(key, { value, expires: Date.now() + ttl * 1000 });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
    console.log('CACHE_DEL', { key: hashKey(key) });
  }

  async ttl(key: string): Promise<number> {
    const entry = this.store.get(key);
    if (!entry) return -2;
    const ms = entry.expires - Date.now();
    if (ms <= 0) {
      this.store.delete(key);
      console.log('CACHE_EXPIRE', { key: hashKey(key) });
      return -2;
    }
    return Math.ceil(ms / 1000);
  }

  async incr(key: string): Promise<number> {
    const current = parseInt((await this.get(key)) || '0', 10);
    const next = current + 1;
    await this.set(key, String(next));
    return next;
  }
}

let cache: Cache = new MemoryCache();
let cacheKind: 'memory' | 'redis' = 'memory';

export async function bootstrapCache(): Promise<{ kind: 'memory' | 'redis'; reason?: string }> {
  const url = process.env.REDIS_URL;
  if (process.env.MOCK_REDIS === 'true' || !url) {
    console.warn('REDIS_MOCKED_OR_URL_MISSING');
    cache = new MemoryCache();
    cacheKind = 'memory';
    return { kind: 'memory', reason: 'mocked-or-url-missing' };
  }
  try {
    const mod = await import('redis');
    const client = mod.createClient({
      url,
      socket: { tls: process.env.REDIS_TLS === 'true' },
    });
    client.on('error', (err: unknown) => console.error('REDIS_CLIENT_ERROR', err));
    await client.connect();
    cache = new RedisCache(client);
    cacheKind = 'redis';
    return { kind: 'redis' };
  } catch (err) {
    console.error('REDIS_MISSING_OR_CONNECT_ERROR', err);
    cache = new MemoryCache();
    cacheKind = 'memory';
    return { kind: 'memory', reason: 'missing-or-connect-error' };
  }
}

class RedisCache implements Cache {
  constructor(private client: any) {}

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl: number = defaultTtl): Promise<void> {
    await this.client.set(key, value, { EX: ttl });
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  incr(key: string): Promise<number> {
    return this.client.incr(key);
  }
}

export function getCacheStatus(): 'memory' | 'redis' {
  return cacheKind;
}

export const cacheGet = (key: string) => cache.get(key);
export const cacheSet = (key: string, value: string, ttl?: number) => cache.set(key, value, ttl);
export const cacheDel = (key: string) => cache.del(key);

export { cache };
