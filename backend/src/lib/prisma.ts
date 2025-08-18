import { logger } from '../config/logger';
import { env } from '../config/env';

let prisma: any = null;
let dbAvailable = false;
let Prisma: any = { PrismaClientKnownRequestError: class extends Error { code = ''; } };

if (process.env.NODE_ENV === 'production' && env.offlineMode && !env.productionOfflineAllowed) {
  logger.error('Offline mode is not allowed in production');
  process.exit(1);
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient, Prisma: PrismaNS } = require('@prisma/client');
  prisma = new PrismaClient();
  Prisma = PrismaNS;
  dbAvailable = true;
} catch (e) {
  const msg = 'Prisma indisponible: ' + (e as Error).message;
  if (env.forceOnline) {
    logger?.error?.(msg);
    process.exit(1);
  } else {
    logger?.warn?.(msg);
  }
}

export { prisma, Prisma, dbAvailable };
