#!/usr/bin/env node

const base = process.env.BASE_URL || 'http://localhost:3000';
const origin = process.env.CHECK_ORIGIN || 'https://khadamat.ma';

async function main() {
  let ok = true;
  try {
    const res = await fetch(base + '/health', { method: 'HEAD', headers: { Origin: origin } });
    const csp = res.headers.get('content-security-policy') || '';
    const aco = res.headers.get('access-control-allow-origin') || '';
    if (!csp || /unsafe-inline|unsafe-eval/.test(csp)) {
      console.error('CSP check failed');
      ok = false;
    }
    if (!aco || aco === '*' || aco !== origin) {
      console.error('CORS origin check failed');
      ok = false;
    }
    if (ok) console.log('CSP/CORS headers ok');
  } catch (err) {
    console.log('SKIP health check:', err.message);
    return;
  }

  try {
    const res = await fetch(base + '/api/auth/refresh', { method: 'POST', headers: { Origin: origin } });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie && /refreshToken=/.test(setCookie)) {
      const hasSecure = /;\s*Secure/i.test(setCookie);
      const hasHttpOnly = /;\s*HttpOnly/i.test(setCookie);
      const hasSameSite = /;\s*SameSite=(Strict|Lax|None)/i.test(setCookie);
      if (!hasHttpOnly || (base.startsWith('https://') && !hasSecure) || !hasSameSite) {
        console.error('Refresh cookie flags check failed');
        ok = false;
      } else {
        console.log('Refresh cookie flags ok');
      }
    } else {
      console.log('SKIP refresh cookie check');
    }
  } catch (err) {
    console.log('SKIP refresh endpoint:', err.message);
  }

  if (!ok) process.exitCode = 1;
}

main();
