import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { SERVICE_ICON_BY_SLUG } from "../client/src/lib/serviceIcons";

const API_URL = process.env.BACKEND_BASE_URL || "http://localhost:4000";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_PATH = path.join(__dirname, "..", "client", "public", "catalog.seed.json");

async function loadCatalog() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_URL}/api/services/catalog`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch {}
  const content = await readFile(SEED_PATH, "utf8");
  const json = JSON.parse(content);
  return json.data || json;
}

async function main() {
  const catalog = await loadCatalog();
  const slugs = catalog.map((s: any) => s.slug);

  const entries = Object.entries(SERVICE_ICON_BY_SLUG);
  const iconSet = new Set(entries.map(([, icon]) => icon));
  if (iconSet.size !== entries.length) {
    console.error("Duplicate icons found in SERVICE_ICON_BY_SLUG");
    process.exit(1);
  }

  const missing = slugs.filter((slug: string) => !SERVICE_ICON_BY_SLUG[slug]);
  if (missing.length > 0) {
    console.error("Missing icons for slugs:", missing.join(", "));
    process.exit(1);
  }

  console.log("All service icons are unique and mapped.");
}

main();

