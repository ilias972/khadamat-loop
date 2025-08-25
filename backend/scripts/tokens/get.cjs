#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

for (const fp of process.argv.slice(2)) {
  try {
    const abs = path.resolve(fp);
    const content = fs.readFileSync(abs, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      if (!line || line.trim().startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (process.env[key] === undefined || process.env[key] === '') {
        process.env[key] = value;
      }
    }
    console.log(`ENV LOADED FROM ${fp}`);
  } catch {}
}

const base = process.env.BACKEND_BASE_URL;
if (!base) {
  console.log('SKIPPED: env file not loaded.');
  process.exit(0);
}

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
  if (!providerEmail || !providerPassword) {
    return { status: 'SKIPPED', reason: 'missing env' };
  }
  const { res, json, error } = await postJson(`${base}/api/auth/login`, {
    email: providerEmail,
    password: providerPassword,
  });
  if (error || !res || !res.ok || !json?.data?.accessToken) {
    return { status: 'FAIL', reason: 'login failed' };
  }
  return { status: 'PASS', token: json.data.accessToken };
}

async function getAdminToken() {
  if (!adminEmail || !adminPassword) {
    return { status: 'SKIPPED', reason: 'missing env' };
  }
  const { res, json, error } = await postJson(`${base}/api/auth/login`, {
    email: adminEmail,
    password: adminPassword,
  });
  if (error || !res || !res.ok || !json) {
    return { status: 'FAIL', reason: 'login failed' };
  }
  if (json?.data?.mfaRequired) {
    const pending = json.data.pendingToken;
    const totp = process.env.ADMIN_TOTP;
    const recovery = process.env.ADMIN_RECOVERY_CODE;
    if (!totp && !recovery) {
      return { status: 'SKIPPED', reason: 'MFA code missing' };
    }
    const body = totp ? { code: totp } : { recoveryCode: recovery };
    const { res: vRes, json: vJson, error: vErr } = await postJson(
      `${base}/api/auth/mfa/verify`,
      body,
      pending ? `Bearer ${pending}` : undefined,
    );
    if (vErr || !vRes || !vRes.ok || !vJson?.data?.accessToken) {
      return { status: 'FAIL', reason: 'mfa failed' };
    }
    return { status: 'PASS', token: vJson.data.accessToken };
  }
  if (json?.data?.accessToken) {
    return { status: 'PASS', token: json.data.accessToken };
  }
  return { status: 'FAIL', reason: 'login failed' };
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
  console.log(`${provider.status} token:provider${provider.reason ? ' ' + provider.reason : ''}`);
  console.log(`${admin.status} token:admin${admin.reason ? ' ' + admin.reason : ''}`);
})();
