import { PrismaClient } from '@prisma/client';
import './demo-guard.js';

const prisma = new PrismaClient();

async function main() {
  const demos = await prisma.user.findMany({ where: { isDemo: true }, select: { id: true } });
  if (!demos.length) {
    console.log('No demo users found.');
    return;
  }
  const ids = demos.map(d => d.id);
  const log = (label: string, count: number) => console.log(`${label}: ${count}`);

  const notif = await prisma.notification.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('notifications', notif.count);
  const fav = await prisma.favorite.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('favorites', fav.count);
  const rev = await prisma.review.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('reviews', rev.count);
  const msg = await prisma.message.deleteMany({ where: { OR: [{ senderId: { in: ids } }, { receiverId: { in: ids } }] } }).catch(()=>({count:0}));
  log('messages', msg.count);
  const book = await prisma.booking.deleteMany({ where: { OR: [{ clientId: { in: ids } }, { providerId: { in: ids } }] } }).catch(()=>({count:0}));
  log('bookings', book.count);
  const serv = await prisma.service.deleteMany({ where: { provider: { userId: { in: ids } } } }).catch(()=>({count:0}));
  log('services', serv.count);
  const prov = await prisma.provider.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('providers', prov.count);
  const subs = await prisma.subscription.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('subscriptions', subs.count);
  const mfa = await prisma.mfaSecret.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('mfaSecrets', mfa.count);
  const ver = await prisma.verification.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('verifications', ver.count);
  const pii = await prisma.userPII.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('userPII', pii.count);
  const vault = await prisma.kycVault.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('kycVault', vault.count);
  const audit = await prisma.auditLog.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('auditLogs', audit.count);
  const sms = await prisma.smsMessage.deleteMany({ where: { userId: { in: ids } } }).catch(()=>({count:0}));
  log('smsMessages', sms.count);
  const users = await prisma.user.deleteMany({ where: { id: { in: ids } } }).catch(()=>({count:0}));
  log('users', users.count);
}

main().finally(()=>prisma.$disconnect());
