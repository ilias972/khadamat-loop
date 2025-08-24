#!/usr/bin/env node
const {
  BACKEND_BASE_URL = 'https://api.khadamat.ma',
  ADMIN_BEARER_TOKEN,
  GO_LIVE_MAX_DLQ_WEBHOOKS = '5',
  GO_LIVE_MAX_DLQ_SMS = '5',
  GATE_ALLOW_SKIPS = 'false',
} = process.env;
const allowSkips = GATE_ALLOW_SKIPS === 'true';
if (!ADMIN_BEARER_TOKEN) {
  if (allowSkips) {
    console.log('SKIPPED dlq missing tokens');
    process.exit(0);
  }
  console.log('FAIL dlq: missing tokens: run npm --prefix backend run tokens:get:staging.');
  process.exit(1);
}
(async () => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/admin/dlq/stats`, {
      headers: { Authorization: `Bearer ${ADMIN_BEARER_TOKEN}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    const data = body.data || body;
    const w = data.webhooksBacklog || 0;
    const s = data.smsBacklog || 0;
    if (w > parseInt(GO_LIVE_MAX_DLQ_WEBHOOKS, 10) || s > parseInt(GO_LIVE_MAX_DLQ_SMS, 10)) {
      console.log(`FAIL dlq:backlog w=${w} s=${s}`);
      process.exit(1);
    }
    console.log(`PASS dlq:backlog w=${w} s=${s}`);
  } catch (e) {
    if (allowSkips) {
      console.log('SKIPPED dlq:' + e.message);
    } else {
      console.log('FAIL dlq:' + e.message);
      process.exit(1);
    }
  }
})();
