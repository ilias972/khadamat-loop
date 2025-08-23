const base = process.env.BACKEND_BASE_URL || 'http://localhost:3000';
const secret = process.env.STRIPE_WEBHOOK_SECRET;
const mock = process.env.MOCK_STRIPE === 'true';

(async () => {
  if (!secret) {
    console.log(`SMOKE:webhooks SKIPPED (${mock ? 'mock' : 'no secret'})`);
    return;
  }
  let Stripe;
  try {
    ({ default: Stripe } = await import('stripe'));
  } catch {
    console.log('SMOKE:webhooks SKIPPED (stripe package missing)');
    return;
  }
  const stripe = new Stripe('sk_test', { apiVersion: '2022-11-15' });
  const payload = JSON.stringify({ type: 'checkout.session.completed', id: 'evt_test' });
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
  try {
    const res = await fetch(base + '/api/payments/webhook', {
      method: 'POST',
      body: payload,
      headers: { 'stripe-signature': header, 'Content-Type': 'application/json' },
    });
    if (res.ok) console.log('SMOKE:webhooks PASS');
    else console.log('SMOKE:webhooks FAIL ' + res.status);
  } catch (err) {
    console.log('SMOKE:webhooks FAIL ' + err.message);
    process.exit(1);
  }
})();
