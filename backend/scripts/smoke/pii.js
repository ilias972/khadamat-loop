const token = process.env.SMOKE_TOKEN || '';

async function run() {
  const exportRes = await fetch('http://localhost:3000/api/pii/export', { headers: { Authorization: `Bearer ${token}` } });
  console.log('export status', exportRes.status);
  try {
    const data = await exportRes.json();
    console.log('export keys', Object.keys(data?.data || {}).length);
  } catch {}
  const delRes = await fetch('http://localhost:3000/api/pii/me', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  console.log('delete status', delRes.status);
}

run().catch(e => { console.error(e); process.exit(1); });
