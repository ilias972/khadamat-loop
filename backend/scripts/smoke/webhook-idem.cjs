#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test(provider) {
  const eventId = `evt_smoke_${provider}`;
  await prisma.webhookEvent.deleteMany({ where: { provider, eventId } }).catch(() => {});
  await prisma.webhookEvent.create({ data: { provider, eventId, status: 'RECEIVED' } });
  try {
    await prisma.webhookEvent.create({ data: { provider, eventId, status: 'RECEIVED' } });
  } catch (e) {}
  const count = await prisma.webhookEvent.count({ where: { provider, eventId } });
  if (count === 1) {
    console.log(`PASS webhook-idem ${provider}`);
  } else {
    console.log(`FAIL webhook-idem ${provider}`);
    process.exit(1);
  }
}

(async () => {
  try {
    await test('stripe');
    await test('stripe_identity');
    console.log('PASS webhook-idem');
  } catch (e) {
    console.log(`FAIL webhook-idem: ${e.message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
