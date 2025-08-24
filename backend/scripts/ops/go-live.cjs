#!/usr/bin/env node
const { execSync } = require('child_process');
const {
  GO_LIVE_MAX_DLQ_WEBHOOKS = '5',
  GO_LIVE_MAX_DLQ_SMS = '5',
  GO_LIVE_MAX_HEALTH_LATENCY_MS = '800',
  GO_LIVE_REQUIRE_ALERTS_RULES = 'true',
  OPS_BACKEND_URL = 'http://localhost:3000',
  ADMIN_BEARER_TOKEN,
  METRICS_TOKEN,
  ONLINE_TESTS_ENABLE,
} = process.env;

function log(step, status, msg) {
  console.log(`${status} ${step}${msg ? ': ' + msg : ''}`);
}

async function fetchJson(url, opts = {}) {
  try {
    const res = await fetch(url, opts);
    const body = await res.json().catch(() => ({}));
    return { res, body };
  } catch (e) {
    return { error: e };
  }
}

(async () => {
  const failures = [];

  if (!ADMIN_BEARER_TOKEN) {
    if (ONLINE_TESTS_ENABLE === 'true') {
      console.log('NO-GO: missing ADMIN_BEARER_TOKEN for admin endpoints.');
      process.exit(1);
    }
    log('token', 'WARN', 'missing ADMIN_BEARER_TOKEN');
  }

  // Step1: env hardening
  try {
    const cors = process.env.CORS_ORIGINS || '';
    const corsOk = cors && !cors.split(',').some((v) => v.trim() === '*' || v.trim() === '');
    const cookieOk = process.env.COOKIE_SECURE === 'true';
    const mocksOk = ['MOCK_EMAIL', 'MOCK_SMS', 'MOCK_REDIS', 'MOCK_STRIPE'].every((k) => process.env[k] !== 'true');
    if (corsOk && cookieOk && mocksOk) log('env', 'PASS');
    else {
      log('env', 'FAIL', 'insecure CORS/cookie or mocks enabled');
      failures.push('env');
    }
  } catch (e) {
    log('env', 'FAIL', e.message);
    failures.push('env');
  }

  // Step2: health probe
  const start = Date.now();
  const { res: hRes, body: hBody, error: hErr } = await fetchJson(`${OPS_BACKEND_URL}/health`);
  if (hErr || !hRes || !hRes.ok) {
    log('health', 'FAIL', hErr ? hErr.message : `HTTP ${hRes?.status}`);
    failures.push('health');
  } else {
    const latency = Date.now() - start;
    const data = hBody.data || hBody;
    const avRequired = process.env.UPLOAD_ANTIVIRUS === 'true';
    const ok =
      data.db?.connected &&
      data.cache?.driver &&
      (!data.redis || data.redis.connected) &&
      (!avRequired || (data.av?.enabled && data.av?.reachable)) &&
      latency <= parseInt(GO_LIVE_MAX_HEALTH_LATENCY_MS, 10);
    if (ok) log('health', 'PASS');
    else {
      log('health', 'FAIL', `latency=${latency}`);
      failures.push('health');
    }
  }

  // Step3: metrics
  if (METRICS_TOKEN) {
    const { res: mRes, body: mBody, error: mErr } = await (async () => {
      try {
        const res = await fetch(`${OPS_BACKEND_URL}/metrics`, {
          headers: { Authorization: `Bearer ${METRICS_TOKEN}` },
        });
        const text = await res.text();
        return { res, text };
      } catch (e) {
        return { error: e };
      }
    })();
    const text = mBody || mBody === '' ? mBody : mRes?.text;
    if (mErr || !mRes || !mRes.ok) {
      log('metrics', 'FAIL', mErr ? mErr.message : `HTTP ${mRes?.status}`);
      failures.push('metrics');
    } else {
      const txt = text || '';
      const has =
        txt.includes('http_requests_total') &&
        txt.includes('webhooks_processed_total') &&
        txt.includes('sms_dispatch_total') &&
        (txt.includes('cache_hits_total') || txt.includes('cache_misses_total'));
      if (has) log('metrics', 'PASS');
      else {
        log('metrics', 'FAIL', 'missing counters');
        failures.push('metrics');
      }
    }
  } else {
    log('metrics', 'SKIPPED', 'missing METRICS_TOKEN');
  }

  // Step4: DLQ stats
  if (ADMIN_BEARER_TOKEN) {
    const { res: dRes, body: dBody, error: dErr } = await fetchJson(`${OPS_BACKEND_URL}/api/admin/dlq/stats`, {
      headers: { Authorization: `Bearer ${ADMIN_BEARER_TOKEN}` },
    });
    if (dErr || !dRes || !dRes.ok) {
      log('dlq', 'FAIL', dErr ? dErr.message : `HTTP ${dRes?.status}`);
      failures.push('dlq');
    } else {
      const data = dBody.data || dBody;
      const w = data.webhooksBacklog ?? 0;
      const s = data.smsBacklog ?? 0;
      if (w <= parseInt(GO_LIVE_MAX_DLQ_WEBHOOKS, 10) && s <= parseInt(GO_LIVE_MAX_DLQ_SMS, 10)) {
        log('dlq', 'PASS');
      } else {
        log('dlq', 'FAIL', `w=${w} s=${s}`);
        failures.push('dlq');
      }
    }
  } else {
    log('dlq', 'SKIPPED', 'missing ADMIN_BEARER_TOKEN');
  }

  // Step5: alerting rules
  if (GO_LIVE_REQUIRE_ALERTS_RULES === 'true') {
    try {
      execSync('node ../../scripts/ops/alerts.validate.cjs', { stdio: 'ignore' });
      log('alerts', 'PASS');
    } catch (e) {
      log('alerts', 'FAIL', e.message);
      failures.push('alerts');
    }
  } else {
    log('alerts', 'SKIPPED');
  }

  // Step6: webhooks status
  if (ADMIN_BEARER_TOKEN) {
    const { res: wRes, body: wBody, error: wErr } = await fetchJson(
      `${OPS_BACKEND_URL}/api/admin/webhooks/status?limit=5`,
      {
        headers: { Authorization: `Bearer ${ADMIN_BEARER_TOKEN}` },
      },
    );
    if (wErr || !wRes || !wRes.ok) {
      log('webhooks', 'FAIL', wErr ? wErr.message : `HTTP ${wRes?.status}`);
      failures.push('webhooks');
    } else {
      const data = wBody.data || wBody;
      const now = Date.now();
      const recent = (prov) =>
        (data.recent || []).find(
          (e) => e.provider === prov && e.outcome === 'ok' && now - new Date(e.processedAt).getTime() < 24 * 3600 * 1000
        );
      if (recent('stripe') && recent('kyc')) {
        log('webhooks', 'PASS');
      } else {
        log('webhooks', 'WARN', 'no recent ok events');
      }
    }
  } else {
    log('webhooks', 'SKIPPED', 'missing ADMIN_BEARER_TOKEN');
  }

  if (failures.length) {
    console.log('NO-GO');
    process.exit(1);
  } else {
    console.log('GO');
  }
})();
