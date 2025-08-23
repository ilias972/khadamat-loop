import { logger } from '../config/logger';

export async function sendPush(userId: number, message: string) {
  logger.info('PUSH_DISABLED', { userId, message });
  return { skipped: true };
}
