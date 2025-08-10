import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1) Récupère tous les IDs des comptes vitrines (si présents par accident)
  const demos = await prisma.user.findMany({
    where: { isDemo: true },
    select: { id: true }
  });
  if (!demos.length) {
    console.log('No demo users found in test DB.');
    return;
  }
  const ids = demos.map(d => d.id);

  // 2) Supprimer toutes les données liées (ordre safe FK)
  await prisma.notification.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
  await prisma.favorite.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
  await prisma.review.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});

  // Messages : sender OU receiver
  await prisma.message.deleteMany({ where: { senderId: { in: ids } } }).catch(() => {});
  await prisma.message.deleteMany({ where: { receiverId: { in: ids } } }).catch(() => {});

  // Bookings : client OU provider
  await prisma.booking.deleteMany({ where: { clientId: { in: ids } } }).catch(() => {});
  await prisma.booking.deleteMany({ where: { providerId: { in: ids } } }).catch(() => {});

  // Providers/Services
  await prisma.service.deleteMany({ where: { provider: { userId: { in: ids } } } }).catch(() => {});
  await prisma.provider.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});

  // Abonnements
  await prisma.subscription.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});

  // KYC/PII
  await prisma.kycVault.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
  await prisma.verification.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
  await prisma.userPII.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
  await prisma.legalHold.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});

  // Audit/SMS logs
  await prisma.auditLog.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});
  await prisma.smsMessage.deleteMany({ where: { userId: { in: ids } } }).catch(() => {});

  // 3) Enfin : Users
  await prisma.user.deleteMany({ where: { id: { in: ids } } }).catch(() => {});

  console.log(`Purged ${ids.length} demo users + related data from test DB.`);
}

main().finally(() => prisma.$disconnect());
