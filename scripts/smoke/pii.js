const base = process.env.BACKEND_BASE_URL || 'http://localhost:3000';
const token = process.env.SMOKE_TOKEN_CLIENT;

(async () => {
  if (!token) {
    console.log('SMOKE:pii SKIPPED (no token)');
    return;
  }
  try {
    const res = await fetch(base + '/api/pii/me', { headers: { Authorization: 'Bearer ' + token } });
    if (res.ok) console.log('SMOKE:pii PASS');
    else console.log('SMOKE:pii FAIL ' + res.status);
  } catch (err) {
    console.log('SMOKE:pii FAIL ' + err.message);
    process.exit(1);
  }
})();
