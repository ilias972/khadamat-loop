#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const base = process.env.BACKEND_BASE_URL;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const providerEmail = process.env.TEST_PROVIDER_EMAIL;
const providerPassword = process.env.TEST_PROVIDER_PASSWORD;
const outFile = path.join(__dirname, '..', '..', '.env.tokens.staging');

async function postJson(url, body, token) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    return { res, json };
  } catch (e) {
    return { error: e };
  }
}

async function getProviderToken() {
  if (!base || !providerEmail || !providerPassword) {
    return { token: null, reason: 'missing env' };
  }
  const { res, json, error } = await postJson(`${base}/api/auth/login`, {
    email: providerEmail,
    password: providerPassword,
  });
  if (error || !res || !res.ok || !json?.data?.accessToken) {
    return { token: null, reason: 'login failed' };
  }
  return { token: json.data.accessToken };
}

async function getAdminToken() {
  if (!base || !adminEmail || !adminPassword) {
    return { token: null, reason: 'missing env' };
  }
  const { res, json, error } = await postJson(`${base}/api/auth/login`, {
    email: adminEmail,
    password: adminPassword,
  });
  if (error || !res || !res.ok || !json) {
    return { token: null, reason: 'login failed' };
  }
  if (json?.data?.mfaRequired) {
    const pending = json.data.pendingToken;
    const totp = process.env.ADMIN_TOTP;
    const recovery = process.env.ADMIN_RECOVERY_CODE;
    if (!totp && !recovery) {
      return { token: null, reason: 'missing mfa' };
    }
    const body = totp ? { code: totp } : { recoveryCode: recovery };
    const { res: vRes, json: vJson, error: vErr } = await postJson(
      `${base}/api/auth/mfa/verify`,
      body,
      pending ? `Bearer ${pending}` : undefined,
    );
    if (vErr || !vRes || !vRes.ok || !vJson?.data?.accessToken) {
      return { token: null, reason: 'mfa failed' };
    }
    return { token: vJson.data.accessToken };
  }
  if (json?.data?.accessToken) {
    return { token: json.data.accessToken };
  }
  return { token: null, reason: 'login failed' };
}

(async () => {
  const admin = await getAdminToken();
  const provider = await getProviderToken();
  const lines = [];
  if (admin.token) lines.push(`ADMIN_BEARER_TOKEN=${admin.token}`);
  if (provider.token) lines.push(`PROVIDER_BEARER_TOKEN=${provider.token}`);
  if (lines.length) {
    try {
      fs.writeFileSync(outFile, lines.join('\n') + '\n');
    } catch {}
  }
  console.log(admin.token ? 'PASS token:admin' : `SKIPPED token:admin${admin.reason ? ' ' + admin.reason : ''}`);
  console.log(provider.token ? 'PASS token:provider' : `SKIPPED token:provider${provider.reason ? ' ' + provider.reason : ''}`);
})();
