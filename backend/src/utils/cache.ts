/**
 * Simple namespaced cache with Redis fallback to in-memory LRU.
 * Bump CACHE_NAMESPACE (e.g. khadamat:v2) on incompatible releases.
 */

import { createClient } from 'redis';
import crypto from 'crypto';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { registry } from '../metrics';

const defaultTtl = env.cacheTtlSeconds;
const maxTtl = 3600;
let cacheDisabledLogged = false;

// LRU memory store
const memory = new Map<string, { value: string; expires: number }>();
let sweepTimer: NodeJS.Timeout | null = null;

// metrics
let prom: any = null;
let cacheHitsTotal: any;
let cacheMissesTotal: any;
let cacheEvictionsTotal: any;
let cacheOpDurationMs: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  prom = require('prom-client');
} catch {
  /* prom-client optional */
}

if (prom && env.metricsEnabled) {
  cacheHitsTotal = new prom.Counter({
    name: 'cache_hits_total',
    help: 'Cache hits',
    labelNames: ['driver', 'bucket'],
    registers: [registry],
  });
  cacheMissesTotal = new prom.Counter({
    name: 'cache_misses_total',
    help: 'Cache misses',
    labelNames: ['driver', 'bucket'],
    registers: [registry],
  });
  cacheEvictionsTotal = new prom.Counter({
    name: 'cache_evictions_total',
    help: 'Cache evictions',
    labelNames: ['driver', 'bucket'],
    registers: [registry],
  });
  cacheOpDurationMs = new prom.Histogram({
    name: 'cache_op_duration_ms',
    help: 'Duration of cache operations in ms',
    labelNames: ['driver', 'bucket', 'op'],
    buckets: env.metricsBucketsMs,
    registers: [registry],
  });
}

// redis client with backoff
let client: any = null;
let useRedis = false;
let lastFailAt: string | undefined;
let lastRestoreAt: string | undefined;

function setupRedis() {
  if (!env.redisUrl || env.mockRedis || env.cacheDisable) return;

  client = createClient({
    url: env.redisUrl,
    socket: {
      reconnectStrategy: (retries) => Math.min(500 * 2 ** retries, 30000),
    },
  });

  client.on('error', (err) => {
    if (useRedis) {
      useRedis = false;
      lastFailAt = new Date().toISOString();
      logger.warn('REDIS_FALLBACK_STARTED', { error: err?.message });
    }
  });
  client.on('end', () => {
    if (useRedis) {
      useRedis = false;
      lastFailAt = new Date().toISOString();
      logger.warn('REDIS_FALLBACK_STARTED');
    }
  });
  client.on('ready', () => {
    if (!useRedis) {
      useRedis = true;
      lastRestoreAt = new Date().toISOString();
      logger.info('REDIS_RESTORED');
    }
  });

  client.connect().catch((err) => {
    lastFailAt = new Date().toISOString();
    logger.warn('REDIS_FALLBACK_STARTED', { error: err?.message });
  });
}

setupRedis();

// memory sweep job
function startSweep() {
  if (env.cacheDisable) return;
  sweepTimer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of memory.entries()) {
      if (v.expires <= now) {
        memory.delete(k);
        const bucket = getBucket(stripNs(k));
        cacheEvictionsTotal?.inc({ driver: 'memory', bucket });
      }
    }
  }, env.cacheMemSweepSec * 1000);
}
startSweep();

function getBucket(key: string) {
  return key.split(':')[0] || 'unknown';
}

function stripNs(key: string) {
  const prefix = env.cacheNamespace + ':';
  return key.startsWith(prefix) ? key.slice(prefix.length) : key;
}

export function withNs(key: string) {
  return `${env.cacheNamespace}:${key}`;
}

async function observe(op: 'get' | 'set' | 'del', bucket: string, fn: () => Promise<any>) {
  const start = prom && cacheOpDurationMs ? process.hrtime.bigint() : null;
  const driver = useRedis ? 'redis' : 'memory';
  try {
    return await fn();
  } finally {
    if (start && cacheOpDurationMs) {
      const diff = Number(process.hrtime.bigint() - start) / 1e6;
      cacheOpDurationMs.observe({ driver, bucket, op }, diff);
    }
  }
}

export async function cacheGet(key: string): Promise<string | null> {
  if (env.cacheDisable) {
    if (!cacheDisabledLogged) {
      logger.warn('CACHE_DISABLED');
      cacheDisabledLogged = true;
    }
    return null;
  }
  const bucket = getBucket(key);
  const nsKey = withNs(key);
  return observe('get', bucket, async () => {
    if (useRedis && client) {
      const val = await client.get(nsKey);
      if (val !== null) cacheHitsTotal?.inc({ driver: 'redis', bucket });
      else cacheMissesTotal?.inc({ driver: 'redis', bucket });
      return val;
    }
    const entry = memory.get(nsKey);
    if (!entry || entry.expires <= Date.now()) {
      if (entry && entry.expires <= Date.now()) memory.delete(nsKey);
      cacheMissesTotal?.inc({ driver: 'memory', bucket });
      return null;
    }
    memory.delete(nsKey);
    memory.set(nsKey, entry); // refresh order
    cacheHitsTotal?.inc({ driver: 'memory', bucket });
    return entry.value;
  });
}

export async function cacheSet(key: string, value: string, ttl = defaultTtl): Promise<void> {
  if (env.cacheDisable) {
    if (!cacheDisabledLogged) {
      logger.warn('CACHE_DISABLED');
      cacheDisabledLogged = true;
    }
    return;
  }
  const bucket = getBucket(key);
  const nsKey = withNs(key);
  const finalTtl = Math.min(ttl || defaultTtl, maxTtl);
  return observe('set', bucket, async () => {
    if (useRedis && client) {
      await client.set(nsKey, value, { EX: finalTtl });
      return;
    }
    if (memory.size >= env.cacheMemMaxKeys) {
      const oldest = memory.keys().next().value as string | undefined;
      if (oldest) {
        memory.delete(oldest);
        cacheEvictionsTotal?.inc({ driver: 'memory', bucket: getBucket(stripNs(oldest)) });
      }
    }
    memory.set(nsKey, { value, expires: Date.now() + finalTtl * 1000 });
  });
}

export async function cacheDel(key: string): Promise<void> {
  if (env.cacheDisable) {
    if (!cacheDisabledLogged) {
      logger.warn('CACHE_DISABLED');
      cacheDisabledLogged = true;
    }
    return;
  }
  const bucket = getBucket(key);
  const nsKey = withNs(key);
  return observe('del', bucket, async () => {
    if (useRedis && client) {
      await client.del(nsKey);
      return;
    }
    memory.delete(nsKey);
  });
}

export async function cacheDelPattern(pattern: string): Promise<number> {
  if (env.cacheDisable) {
    if (!cacheDisabledLogged) {
      logger.warn('CACHE_DISABLED');
      cacheDisabledLogged = true;
    }
    return 0;
  }
  const nsPattern = withNs(pattern);
  let count = 0;
  if (useRedis && client) {
    const keys = await client.keys(nsPattern);
    if (keys.length) {
      await client.del(keys);
      count = keys.length;
    }
  } else {
    const regex = new RegExp(
      '^' +
        nsPattern
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\\\*/g, '.*') +
        '$'
    );
    for (const key of Array.from(memory.keys())) {
      if (regex.test(key)) {
        memory.delete(key);
        count++;
      }
    }
  }
  if (count) {
    logger.info('CACHE_INVALIDATED', {
      ns: env.cacheNamespace,
      pattern: crypto.createHash('sha1').update(pattern.slice(0, 120)).digest('hex'),
      count,
    });
  }
  return count;
}

export function getCacheStatus() {
  return { driver: useRedis ? 'redis' : 'memory', lastFailAt, lastRestoreAt };
}

export async function stopCache() {
  if (sweepTimer) clearInterval(sweepTimer);
  if (useRedis && client) {
    const quit = client.quit();
    await Promise.race([quit, new Promise((r) => setTimeout(r, 1000))]).catch(() => client?.disconnect());
  }
}

export const __testing = { memory };

