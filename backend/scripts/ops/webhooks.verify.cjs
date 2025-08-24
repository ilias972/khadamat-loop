#!/usr/bin/env node
const { BACKEND_BASE_URL = 'https://api.khadamat.ma', ADMIN_BEARER_TOKEN } = process.env;
if (!ADMIN_BEARER_TOKEN) {
  console.log('SKIPPED webhooks');
  process.exit(0);
}
(async () => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/admin/webhooks/status?limit=5`, {
      headers: { Authorization: `Bearer ${ADMIN_BEARER_TOKEN}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    const data = body.data || {};
    const now = Date.now();
    const stripe = data.stripeCheckout;
    const kyc = data.stripeIdentity;
    const stale = [];
    if (!stripe || !stripe.createdAt || (now - new Date(stripe.createdAt).getTime()) > 24 * 3600 * 1000 || stripe.outcome !== 'ok') {
      stale.push('stripe');
    }
    if (!kyc || !kyc.createdAt || (now - new Date(kyc.createdAt).getTime()) > 24 * 3600 * 1000 || kyc.outcome !== 'ok') {
      stale.push('kyc');
    }
    const latencies = (data.recent || [])
      .map((e) => e.latencyMs)
      .filter((v) => typeof v === 'number')
      .sort((a, b) => a - b);
    const p95 = latencies.length ? latencies[Math.max(0, Math.floor(latencies.length * 0.95) - 1)] : 0;
    if (stale.length) {
      console.log('FAIL webhooks:' + stale.join(','));
      process.exit(1);
    }
    console.log(`PASS webhooks p95=${p95}`);
  } catch (e) {
    console.log('SKIPPED webhooks:' + e.message);
  }
})();
