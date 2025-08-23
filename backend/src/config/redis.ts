import { createClient } from 'redis';
import { logger } from './logger';
import { env } from './env';

let client: any = null;
if (!env.mockRedis && process.env.REDIS_URL) {
  client = createClient({ url: process.env.REDIS_URL });
  client.on('error', (e) => logger.error('redis_error', { error: e }));
  client
    .connect()
    .catch((e) => {
      logger.warn('REDIS_MOCKED', { error: e.message });
      client = null;
    });
} else {
  logger.info('REDIS_MOCKED');
}

export const redis = client;
