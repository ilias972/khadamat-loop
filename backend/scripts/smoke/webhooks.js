const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run() {
  const event = { id: 'evt_smoke', object: 'event', type: 'checkout.session.completed' };
  await fetch('http://localhost:3000/api/payments/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) });
  await fetch('http://localhost:3000/api/payments/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) });
  const count = await prisma.webhookEvent.count({ where: { provider: 'stripe', eventId: event.id } });
  console.log('webhook events count', count);
  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
