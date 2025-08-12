import assert from "assert";

const base = process.env.BASE_URL || "http://localhost:3000";
async function run() {
  const catalogRes = await fetch(`${base}/api/services/catalog`);
  assert.equal(catalogRes.status, 200, "catalog status");
  const catalog = await catalogRes.json();
  const items = catalog.data?.categories ? catalog.data.categories.flatMap(c=>c.services) : catalog.data || [];
  assert.ok(items.length >= 30, "expected at least 30 services");

  const suggestRes = await fetch(
    `${base}/api/services/suggest?q=plom&city=Casablanca`
  );
  assert.equal(suggestRes.status, 200, "suggest status");
  const suggest = await suggestRes.json();
  const hasPlomberie = suggest.data.items.some(
    (it) =>
      String(it.slug || "").includes("plom") ||
      String(it.name_fr || "").toLowerCase().includes("plom")
  );
  assert.ok(hasPlomberie, "missing plomberie suggestion");
  console.log("e2e:smoke:services ok");
}
run().catch((err)=>{
  console.error(err);
  process.exit(1);
});
