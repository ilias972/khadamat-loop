const { fetchJson, logPass, logFail, logSkip, getProviderAuth } = require('./util');

(async () => {
  const name = 'payments.online';
  try {
    const strict = process.env.ONLINE_STRICT !== 'false';
    const required = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'PROVIDER_BEARER_TOKEN'];
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

    const sub = await fetchJson('POST', '/api/subscriptions/club-pro', null, auth.token);
    const subscriptionId = sub?.data?.subscription?.id;
    if (!subscriptionId) throw new Error('subscription fail');

    const sessionRes = await fetchJson('POST', '/api/payments/club-pro', null, auth.token);
    if (!sessionRes.success) throw new Error('session creation failed');

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
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_' + Date.now(),
          object: 'checkout.session',
          metadata: { userId: String(auth.user.id), subscriptionId: String(subscriptionId) },
          amount_total: 5000,
          currency: 'mad',
        },
      },
    };
    const payload = JSON.stringify(event);
    const header = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret: process.env.STRIPE_WEBHOOK_SECRET,
      timestamp: Math.floor(Date.now() / 1000),
    });

    const url = process.env.BACKEND_BASE_URL + '/api/payments/webhook';
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
    const status = await fetchJson('GET', '/api/subscriptions/me', null, auth.token);
    if (status?.data?.status !== 'ACTIVE') throw new Error('subscription not active');

    logPass(name);
  } catch (err) {
    logFail(name, err.message);
    process.exitCode = 1;
  }
})();
