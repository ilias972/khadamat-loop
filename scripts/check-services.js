// Simple check to prevent hardcoded service names in client/src
import { spawn } from "child_process";

const API_URL = process.env.API_URL || "http://localhost:3000";

function rg(pattern) {
  try {
    return spawn("rg", [pattern, "client/src", "-l"], {
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch (e) {
    console.error("ripgrep is required");
    process.exit(1);
  }
}

async function main() {
  const res = await fetch(`${API_URL}/api/services/catalog`).catch(() => null);
  if (!res || !res.ok) {
    console.error("Failed to fetch services catalog");
    process.exit(1);
  }
  const services = await res.json();
  const names = new Set();
  services.forEach((s) => {
    if (s.name_fr) names.add(s.name_fr);
    if (s.name_ar) names.add(s.name_ar);
  });

  let found = false;
  for (const name of names) {
    const proc = rg(name);
    const output = await new Promise((resolve) => {
      let data = "";
      proc.stdout.on("data", (d) => (data += d.toString()));
      proc.on("close", () => resolve(data));
    });
    if (output.trim()) {
      console.error(`Found hardcoded service name: ${name}\n${output}`);
      found = true;
    }
  }
  if (found) {
    process.exit(1);
  }
  console.log("No hardcoded service names found.");
}

main();

