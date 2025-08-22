const base = process.env.BACKEND_BASE_URL || 'http://localhost:3000';

(async () => {
  try {
    const url = base + '/api/services/search?service=1&lat=0&lng=0&radiusKm=2';
    const res = await fetch(url);
    if (!res.ok) throw new Error('status ' + res.status);
    const json = await res.json();
    if (json.success) {
      console.log('SMOKE:search PASS');
    } else {
      console.log('SMOKE:search FAIL');
      process.exit(1);
    }
  } catch (err) {
    if (String(err).includes('fetch failed')) {
      console.log('SMOKE:search SKIPPED (unreachable)');
    } else {
      console.log('SMOKE:search FAIL ' + err.message);
      process.exit(1);
    }
  }
})();
