#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const demos = await prisma.user.findMany({ where: { isDemo: true }, select: { id: true } });
    if (!demos.length) {
      console.log('SKIP no demo users');
      return;
    }
    const ids = demos.map((d) => d.id);
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
    console.log(`PURGED ${ids.length} demo users`);
  } catch (e) {
    console.error('purge_failed', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
