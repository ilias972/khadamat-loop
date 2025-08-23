require('./_health-gate');

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/notifications', {
      headers: { 'Accept-Language': 'ar' },
    });
    const json = await res.json();
    if (json?.error?.message && /[\u0600-\u06FF]/.test(json.error.message)) {
      console.log('PASS i18n');
    } else {
      console.log('FAIL i18n: non-arabic message');
      process.exit(1);
    }
  } catch (e) {
    console.log(`FAIL i18n: ${e.message}`);
    process.exit(1);
  }
}
run();
