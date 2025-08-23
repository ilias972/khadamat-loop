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

async function getAuthToken(email, password) {
  let login = await fetchJson('POST', '/api/auth/login', { email, password });
  if (!login.success) {
    await fetchJson('POST', '/api/auth/register', { email, password, role: 'PROVIDER' });
    login = await fetchJson('POST', '/api/auth/login', { email, password });
  }
  if (login.success) {
    return { token: login.data.accessToken, user: login.data.user };
  }
  return null;
}

module.exports = { fetchJson, logPass, logFail, logSkip, getAuthToken };
