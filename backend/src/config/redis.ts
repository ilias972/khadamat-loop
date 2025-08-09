import { createClient } from 'redis';
import { logger } from './logger';

export const redis = process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : null;

if (redis) {
  redis.on('error', (e) => logger.error('redis_error', { error: e }));
  redis.connect().catch((e) => logger.error('redis_connect_error', { error: e }));
}
