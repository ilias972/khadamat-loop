// Simple check to prevent hardcoded service names in client/src
import { spawn } from "child_process";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const API_URL = process.env.BACKEND_BASE_URL || "http://localhost:4000";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_PATH = path.join(__dirname, "..", "client", "public", "catalog.seed.json");

if (process.env.CI === "true" || process.env.CHECK_SERVICES === "0") {
  console.log("[check-services] skipped");
  process.exit(0);
}

async function ensureRipgrep() {
  return new Promise((resolve, reject) => {
    const proc = spawn("rg", ["--version"], { stdio: "ignore" });
    proc.on("error", (err) => {
      if (err.code === "ENOENT") {
        console.log("[check-services] rg not found, skip");
        resolve(false);
      } else {
        reject(err);
      }
    });
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`rg --version exited with code ${code}`));
        return;
      }
      resolve(true);
    });
  });
}

function rg(pattern) {
  return spawn(
    "rg",
    [
      pattern,
      "client/src",
      "-l",
      "--glob",
      "!contexts/LanguageContext.tsx",
      "--glob",
      "!i18n/**",
      "--glob",
      "!**/__tests__/**",
      "--glob",
      "!**/*.test.*",
    ],
    { stdio: ["ignore", "pipe", "ignore"] }
  );
}

async function main() {
  const hasRipgrep = await ensureRipgrep();
  if (!hasRipgrep) {
    return;
  }
  let services;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_URL}/api/services/catalog`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("bad status");
    const json = await res.json();
    services = json.data || json;
  } catch {
    const content = await readFile(SEED_PATH, "utf8").catch(() => null);
    if (!content) {
      console.error("Failed to load services catalog");
      process.exit(1);
    }
    const json = JSON.parse(content);
    services = json.data || json;
  }
  const names = new Set();
  services.forEach((s) => {
    if (s.name_fr) names.add(s.name_fr);
    if (s.name_ar) names.add(s.name_ar);
  });

  let found = false;
  for (const name of names) {
    const proc = rg(name);
    const output = await new Promise((resolve, reject) => {
      let data = "";
      proc.stdout.on("data", (d) => (data += d.toString()));
      proc.on("error", (err) => reject(err));
      proc.on("close", (code) => {
        if (code !== 0 && code !== 1) {
          reject(new Error(`rg exited with code ${code}`));
          return;
        }
        resolve({ code, data });
      });
    });
    const { code, data } = output;
    if (code === 0 && data.trim()) {
      console.error(`Found hardcoded service name: ${name}\n${data}`);
      found = true;
    }
  }
  if (found) {
    process.exit(1);
  }
  console.log("No hardcoded service names found.");
}

main().catch((error) => {
  console.error(`[check-services] ${error.message}`);
  process.exit(1);
});

