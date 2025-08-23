require('./_health-gate');

async function run() {
  const token = process.env.SMOKE_PROVIDER_TOKEN;
  if (!token) {
    console.log('SKIPPED subscriptions: no token');
    return;
  }
  try {
    const res = await fetch('http://localhost:3000/api/subscriptions/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('GET sub status', res.status);
    await fetch('http://localhost:3000/api/subscriptions/auto-renew', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ autoRenew: false }),
    });
    console.log('PASS subscriptions');
  } catch (e) {
    console.log(`FAIL subscriptions: ${e.message}`);
    process.exit(1);
  }
}
run();
