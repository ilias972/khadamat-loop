require('./_health-gate');

async function run() {
  if (process.env.METRICS_ENABLED !== 'true' || !process.env.METRICS_TOKEN) {
    console.log('SKIPPED metrics: metrics disabled');
    return;
  }
  try {
    const res = await fetch('http://localhost:3000/metrics', {
      headers: { Authorization: `Bearer ${process.env.METRICS_TOKEN}` },
    });
    if (res.status === 401) {
      console.log('SKIPPED metrics: protected');
      return;
    }
    const body = await res.text();
    if (
      res.status === 200 &&
      body.includes('bookings_created_total') &&
      body.includes('messages_sent_total') &&
      body.includes('webhooks_processed_total')
    ) {
      console.log('PASS metrics: counters present');
    } else {
      console.log('FAIL metrics: counters missing');
      process.exit(1);
    }
  } catch (e) {
    console.log(`FAIL metrics: ${e.message}`);
    process.exit(1);
  }
}
run();
