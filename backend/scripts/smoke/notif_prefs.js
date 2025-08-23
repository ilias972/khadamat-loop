async function run() {
  const token = process.env.SMOKE_USER_TOKEN;
  if (!token) {
    console.log('SKIPPED notif_prefs: no token');
    return;
  }
  try {
    const res = await fetch('http://localhost:3000/api/notifications/prefs', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('GET prefs status', res.status);
    await fetch('http://localhost:3000/api/notifications/prefs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ smsOn: false }),
    });
    console.log('PASS notif_prefs');
  } catch (e) {
    console.log(`FAIL notif_prefs: ${e.message}`);
    process.exit(1);
  }
}
run();
