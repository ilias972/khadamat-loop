import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const projectRoot = path.resolve(import.meta.dirname, "..");

export default defineConfig(async () => {
  const plugins = [react(), runtimeErrorOverlay()];

  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@shared": path.resolve(projectRoot, "shared"),
        "@assets": path.resolve(projectRoot, "attached_assets"),
        wouter: path.resolve(projectRoot, "shared", "vendor", "wouter.tsx"),
      },
    },
    root: import.meta.dirname,
    build: {
      outDir: path.resolve(projectRoot, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        allow: [import.meta.dirname, path.resolve(projectRoot, "shared"), path.resolve(projectRoot, "attached_assets")],
        deny: ["**/.*"],
      },
    },
  };
});
