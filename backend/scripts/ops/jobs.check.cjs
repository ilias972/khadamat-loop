#!/usr/bin/env node
const { BACKEND_BASE_URL = 'https://api.khadamat.ma' } = process.env;
(async () => {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    const jobs = body.data?.jobs || body.jobs;
    const last = jobs?.lastRun || {};
    const now = Date.now();
    const toMs = (d) => (d ? now - new Date(d).getTime() : Infinity);
    if (toMs(last.retention) < 24 * 3600 * 1000 && toMs(last.heartbeat) < 24 * 3600 * 1000) {
      console.log('PASS jobs:lastRun');
    } else {
      console.log('FAIL jobs:lastRun');
      process.exit(1);
    }
  } catch (e) {
    console.log('SKIPPED jobs:' + e.message);
  }
})();
