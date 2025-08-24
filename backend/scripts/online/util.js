const fetch = global.fetch;

async function fetchJson(method, path, body, auth) {
  const base = process.env.BACKEND_BASE_URL;
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${auth}`;
  const res = await fetch(base + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

function logPass(name) {
  console.log(`PASS ${name}`);
}

function logFail(name, reason) {
  console.log(`FAIL ${name}: ${reason}`);
}

function logSkip(name, reason) {
  console.log(`SKIPPED ${name}: ${reason}`);
}

function getProviderAuth() {
  const envToken = process.env.PROVIDER_BEARER_TOKEN;
  if (!envToken) return null;
  let payload = {};
  try {
    const part = envToken.split('.')[1];
    const pad = part
      .padEnd(part.length + (4 - (part.length % 4)) % 4, '=')
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    payload = JSON.parse(Buffer.from(pad, 'base64').toString('utf8'));
  } catch {}
  return { token: envToken, user: { id: payload.id } };
}

module.exports = { fetchJson, logPass, logFail, logSkip, getProviderAuth };
