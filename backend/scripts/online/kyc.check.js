const { fetchJson, logPass, logFail, logSkip, getProviderAuth } = require('./util');

(async () => {
  const name = 'kyc.online';
  try {
    const required = ['ONLINE_TESTS_ENABLE', 'BACKEND_BASE_URL', 'STRIPE_IDENTITY_WEBHOOK_SECRET', 'PROVIDER_BEARER_TOKEN'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length || process.env.ONLINE_TESTS_ENABLE !== 'true') {
      logSkip(name, 'missing ' + missing.join(','));
      return;
    }

    const healthUrl =
      process.env.BACKEND_BASE_URL + (process.env.BACKEND_HEALTH_PATH || '/health');
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3000);
    try {
      const res = await fetch(healthUrl, { signal: controller.signal });
      clearTimeout(t);
      if (res.status !== 200) {
        logSkip(name, 'backend unreachable');
        return;
      }
    } catch {
      clearTimeout(t);
      logSkip(name, 'backend unreachable');
      return;
    }

    const auth = getProviderAuth();
    if (!auth) {
      logSkip(name, 'missing PROVIDER_BEARER_TOKEN');
      return;
    }

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
