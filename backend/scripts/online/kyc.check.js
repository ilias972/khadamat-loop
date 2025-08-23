const { fetchJson, logPass, logFail, logSkip, getAuthToken } = require('./util');

(async () => {
  const name = 'kyc.online';
  try {
    const required = ['ONLINE_TESTS_ENABLE', 'BACKEND_BASE_URL', 'STRIPE_IDENTITY_WEBHOOK_SECRET', 'TEST_PROVIDER_EMAIL', 'TEST_PROVIDER_PASSWORD'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length || process.env.ONLINE_TESTS_ENABLE !== 'true') {
      logSkip(name, 'missing ' + missing.join(','));
      return;
    }

    const auth = await getAuthToken(process.env.TEST_PROVIDER_EMAIL, process.env.TEST_PROVIDER_PASSWORD);
    if (!auth) throw new Error('auth failed');

    let Stripe;
    try {
      Stripe = (await import('stripe')).default;
    } catch (e) {
      logSkip(name, 'stripe sdk missing');
      return;
    }

    const event = {
      id: 'evt_' + Date.now(),
      object: 'event',
      type: 'identity.verification_session.verified',
      data: {
        object: {
          id: 'vs_' + Date.now(),
          object: 'identity.verification_session',
          metadata: { userId: String(auth.user.id) },
          last_verification_report: { id: 'vr_' + Date.now() },
          type: 'document',
        },
      },
    };
    const payload = JSON.stringify(event);
    const header = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret: process.env.STRIPE_IDENTITY_WEBHOOK_SECRET,
      timestamp: Math.floor(Date.now() / 1000),
    });

    await fetch(process.env.BACKEND_BASE_URL + '/api/kyc/webhook', {
      method: 'POST',
      headers: { 'Stripe-Signature': header, 'Content-Type': 'application/json' },
      body: payload,
    });

    await new Promise((r) => setTimeout(r, 500));
    const status = await fetchJson('GET', '/api/kyc/status', null, auth.token);
    if (status?.data?.status !== 'VERIFIED') throw new Error('status not VERIFIED');

    logPass(name);
  } catch (err) {
    logFail(name, err.message);
    process.exitCode = 1;
  }
})();
