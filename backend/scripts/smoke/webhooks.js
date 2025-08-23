const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run() {
  try {
    const event = { id: 'evt_smoke', object: 'event', type: 'checkout.session.completed' };
    await fetch('http://localhost:3000/api/payments/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    await fetch('http://localhost:3000/api/payments/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    const count = await prisma.webhookEvent.count({ where: { provider: 'stripe', eventId: event.id } });
    if (count >= 2) {
      console.log('PASS webhooks');
    } else {
      console.log('FAIL webhooks: missing events');
      process.exit(1);
    }
  } catch (e) {
    console.log(`FAIL webhooks: ${e.message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
run();
