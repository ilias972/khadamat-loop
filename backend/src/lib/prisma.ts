import { logger } from '../config/logger';

let prisma: any = null;
let dbAvailable = false;
let Prisma: any = { PrismaClientKnownRequestError: class extends Error { code = ''; } };
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient, Prisma: PrismaNS } = require('@prisma/client');
  prisma = new PrismaClient();
  Prisma = PrismaNS;
  dbAvailable = true;
} catch (e) {
  logger?.warn?.('Prisma indisponible (offline mode activé): ' + (e as Error).message);
}

export { prisma, Prisma, dbAvailable };
