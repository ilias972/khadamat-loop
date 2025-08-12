import assert from "assert";

const base = process.env.BASE_URL || "http://localhost:3000";
async function run() {
  const suggestRes = await fetch(`${base}/api/providers/suggest?q=ah`);
  assert.equal(suggestRes.status, 200, "suggest status");
  const suggest = await suggestRes.json();
  assert.ok(suggest.data.items.length <= 8, "limit not respected");

  const searchRes = await fetch(`${base}/api/providers/search?q=ah&page=1&size=10`);
  assert.equal(searchRes.status, 200, "search status");
  console.log("e2e:smoke:providers ok");
}
run().catch((err)=>{
  console.error(err);
  process.exit(1);
});
