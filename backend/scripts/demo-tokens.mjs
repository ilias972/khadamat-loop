import './demo-guard.js';

const base = process.env.BASE_URL || 'http://localhost:3000';

async function login(email, password) {
  const res = await fetch(base + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  const cookie = res.headers.get('set-cookie') || '';
  const refresh = (cookie.match(/refreshToken=([^;]+)/) || [])[1];
  return { accessToken: json?.data?.accessToken, refreshToken: refresh };
}

(async () => {
  const creds = {
    admin: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD },
    client: { email: process.env.DEMO_CLIENT_EMAIL, password: process.env.DEMO_CLIENT_PASSWORD },
    provider: { email: process.env.DEMO_PROVIDER_EMAIL, password: process.env.DEMO_PROVIDER_PASSWORD },
  };
  const tokens = {};
  for (const [key, c] of Object.entries(creds)) {
    tokens[key] = await login(c.email, c.password);
  }
  console.log(JSON.stringify(tokens, null, 2));
  for (const [key, t] of Object.entries(tokens)) {
    if (t.accessToken) {
      console.log(`\n# ${key}`);
      console.log(`curl -H "Authorization: Bearer ${t.accessToken}" ${base}/api/`);
    }
  }
})();
