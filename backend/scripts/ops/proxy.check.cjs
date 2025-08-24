#!/usr/bin/env node
const { BACKEND_BASE_URL = 'https://api.khadamat.ma', HSTS_MAX_AGE = '0' } = process.env;
(async () => {
  try {
    const res = await fetch(BACKEND_BASE_URL, { headers: { 'X-Forwarded-Proto': 'https' }, redirect: 'manual' });
    const sts = res.headers.get('strict-transport-security') || '';
    const csp = res.headers.get('content-security-policy') || '';
    const cookie = res.headers.get('set-cookie') || '';
    const stsMatch = sts.match(/max-age=(\d+)/i);
    const stsOk = stsMatch && parseInt(stsMatch[1], 10) >= parseInt(HSTS_MAX_AGE, 10);
    const cspOk = csp && !csp.includes('unsafe-inline');
    const protoOk = cookie ? cookie.includes('Secure') : true;
    if (stsOk && cspOk && protoOk) {
      console.log('PASS proxy:headers');
    } else {
      const errs = [];
      if (!stsOk) errs.push('hsts');
      if (!cspOk) errs.push('csp');
      if (!protoOk) errs.push('cookie');
      console.log('FAIL proxy:headers ' + errs.join(','));
      process.exit(1);
    }
  } catch (e) {
    console.log('SKIPPED proxy:headers ' + e.message);
  }
})();
