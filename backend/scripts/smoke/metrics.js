async function run() {
  if (process.env.METRICS_ENABLED !== 'true' || !process.env.METRICS_TOKEN) {
    console.log('SKIPPED metrics: metrics disabled');
    return;
  }
  try {
    const res = await fetch('http://localhost:3000/metrics', {
      headers: { Authorization: `Bearer ${process.env.METRICS_TOKEN}` },
    });
    const body = await res.text();
    if (res.status === 200 && body.includes('http_requests_total')) {
      console.log('PASS metrics');
    } else {
      console.log('FAIL metrics: unexpected response');
      process.exit(1);
    }
  } catch (e) {
    console.log(`FAIL metrics: ${e.message}`);
    process.exit(1);
  }
}
run();
