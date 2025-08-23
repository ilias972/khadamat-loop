#!/usr/bin/env node

const { OPS_BACKEND_URL, METRICS_TOKEN, OPS_ADMIN_BEARER } = process.env;

(async () => {
  try {
    if (!OPS_BACKEND_URL) {
      throw new Error('OPS_BACKEND_URL is required');
    }

    const healthRes = await fetch(`${OPS_BACKEND_URL}/health`);
    if (!healthRes.ok) {
      throw new Error(`/health HTTP ${healthRes.status}`);
    }
    const health = await healthRes.json();
    if (!health?.db?.connected) {
      throw new Error('/health missing db.connected');
    }
    if (!health?.cache?.driver) {
      throw new Error('/health missing cache.driver');
    }
    console.log('health: OK');

    if (METRICS_TOKEN) {
      const metricsRes = await fetch(`${OPS_BACKEND_URL}/metrics`, {
        headers: { Authorization: `Bearer ${METRICS_TOKEN}` },
      });
      if (!metricsRes.ok) {
        throw new Error(`/metrics HTTP ${metricsRes.status}`);
      }
      const metricsText = await metricsRes.text();
      const hasReqTotal = metricsText.includes('http_requests_total');
      const hasDuration = metricsText.includes('http_request_duration_ms_bucket');
      const hasCache = metricsText.includes('cache_hits_total') || metricsText.includes('cache_misses_total');
      if (!hasReqTotal || !hasDuration || !hasCache) {
        throw new Error('/metrics missing required counters');
      }
      console.log('metrics: OK');
    } else {
      console.log('metrics: SKIPPED (missing METRICS_TOKEN)');
    }

    if (OPS_ADMIN_BEARER) {
      const webhookRes = await fetch(`${OPS_BACKEND_URL}/api/admin/webhooks/status`, {
        headers: { Authorization: OPS_ADMIN_BEARER },
      });
      if (!webhookRes.ok) {
        throw new Error(`/api/admin/webhooks/status HTTP ${webhookRes.status}`);
      }
      const hooks = await webhookRes.json();
      if (!('checkout' in hooks) || !('kyc' in hooks)) {
        throw new Error('webhooks missing checkout or kyc');
      }
      if (!(hooks.checkout === null || typeof hooks.checkout === 'object')) {
        throw new Error('webhooks checkout invalid');
      }
      if (!(hooks.kyc === null || typeof hooks.kyc === 'object')) {
        throw new Error('webhooks kyc invalid');
      }
      const ts = (obj) => {
        if (!obj || typeof obj !== 'object') return null;
        return (
          obj.lastTimestamp ||
          obj.timestamp ||
          obj.last ||
          obj.updatedAt ||
          obj.createdAt ||
          null
        );
      };
      console.log('webhooks checkout last:', ts(hooks.checkout));
      console.log('webhooks kyc last:', ts(hooks.kyc));
    } else {
      console.log('webhooks: SKIPPED (missing OPS_ADMIN_BEARER)');
    }

    console.log('PASS ops:verify');
  } catch (err) {
    console.log(`FAIL ops:verify: ${err.message}`);
    process.exit(1);
  }
})();
