async function run() {
  const searchRes = await fetch('http://localhost:3000/api/services/search?service=test&city=test&radiusKm=10');
  console.log('search status', searchRes.status);
  try {
    const searchData = await searchRes.json();
    console.log('items', searchData?.data?.items?.length || 0);
  } catch {}
  const suggestRes = await fetch('http://localhost:3000/api/suggest/cities?q=te');
  console.log('suggest status', suggestRes.status);
  try {
    const suggestData = await suggestRes.json();
    console.log('cities', suggestData?.items?.length || 0);
  } catch {}
}

run().catch(e => { console.error(e); process.exit(1); });
