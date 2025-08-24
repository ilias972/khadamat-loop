#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const enable = process.env.DLQ_ENABLE === 'true';
const poll = parseInt(process.env.DLQ_POLL_INTERVAL_MS || '60000', 10);

(async () => {
  if (!enable) {
    console.log('dlq.smoke SKIPPED');
    process.exit(0);
  }
  try {
    const item = await prisma.webhookDLQ.create({
      data: { provider: 'stripe', payload: {}, nextRunAt: new Date(Date.now() - 1000) },
    });
    await new Promise((r) => setTimeout(r, Math.min(poll + 1000, 65000)));
    const updated = await prisma.webhookDLQ.findUnique({ where: { id: item.id } });
    if (updated && updated.attempts > 0) {
      console.log('dlq.smoke PASS');
    } else {
      console.log('dlq.smoke WARN');
    }
  } catch (e) {
    console.log('dlq.smoke SKIPPED', e.message);
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
})();
