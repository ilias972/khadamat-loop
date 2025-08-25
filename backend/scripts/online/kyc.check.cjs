const { fetchJson, logPass, logFail, logSkip, getProviderAuth } = require('./util');

(async () => {
  const name = 'kyc.online';
  try {
    const strict = process.env.ONLINE_STRICT !== 'false';
    const required = ['STRIPE_IDENTITY_WEBHOOK_SECRET', 'PROVIDER_BEARER_TOKEN'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
      const msg = 'missing: ' + missing.join(', ');
      if (strict) {
        logFail(name, msg);
        process.exitCode = 1;
      } else {
        logSkip(name, msg);
      }
      return;
    }
    if (process.env.ONLINE_TESTS_ENABLE !== 'true') {
      logSkip(name, 'missing ONLINE_TESTS_ENABLE');
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
      logFail(name, 'invalid PROVIDER_BEARER_TOKEN');
      process.exitCode = 1;
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

    const url = process.env.BACKEND_BASE_URL + '/api/kyc/webhook';
    await fetch(url, {
      method: 'POST',
      headers: { 'Stripe-Signature': header, 'Content-Type': 'application/json' },
      body: payload,
    });

    // reinject same event to verify idempotence
    await fetch(url, {
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
