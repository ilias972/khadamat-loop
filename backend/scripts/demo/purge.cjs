#!/usr/bin/env node
const path = require('path');
const { spawnSync } = require('child_process');

spawnSync('node', [path.join(__dirname, '../db/bootstrap.cjs')], { stdio: 'inherit' });

if (!process.env.DATABASE_URL) {
  console.log('SKIPPED no DATABASE_URL');
  process.exit(0);
}
if (process.env.NODE_ENV === 'production' && process.env.DEMO_ENABLE === 'true') {
  console.log('SKIPPED DEMO_ENABLE=true');
  process.exit(0);
}
let PrismaClient;
try {
  ({ PrismaClient } = require('@prisma/client'));
} catch (e) {
  console.log('SKIPPED @prisma/client missing');
  process.exit(0);
}
const prisma = new PrismaClient();
(async () => {
  try {
    const demos = await prisma.user.findMany({ where: { isDemo: true }, select: { id: true } });
    const ids = demos.map((d) => d.id);
    if (ids.length) {
      await prisma.notification.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.favorite.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.review.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.message.deleteMany({ where: { senderId: { in: ids } } }).catch(() => {});
      await prisma.message.deleteMany({ where: { receiverId: { in: ids } } }).catch(() => {});
      await prisma.booking.deleteMany({ where: { clientId: { in: ids } } }).catch(() => {});
      await prisma.booking.deleteMany({ where: { providerId: { in: ids } } }).catch(() => {});
      await prisma.service.deleteMany({ where: { provider: { userId: { in: ids } } } }).catch(() => {});
      await prisma.provider.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.subscription.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.kycVault.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.verification.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.userPII.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.legalHold.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.auditLog.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.smsMessage.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
      await prisma.user.deleteMany({ where: { id: { in: ids } } }).catch(() => {});
    }
    console.log(`PASS purge: ${ids.length} users`);
  } catch (e) {
    console.error('purge_failed', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
