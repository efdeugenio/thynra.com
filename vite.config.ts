import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Conditionally import Replit plugins only in development
let replitPlugins: any[] = [];
if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
  try {
    const runtimeErrorOverlay = require("@replit/vite-plugin-runtime-error-modal").default;
    replitPlugins.push(runtimeErrorOverlay());
  } catch (e) {
    // Plugin not available, skip
  }
  
  try {
    const { cartographer } = require("@replit/vite-plugin-cartographer");
    replitPlugins.push(cartographer());
  } catch (e) {
    // Plugin not available, skip
  }
  
  try {
    const { devBanner } = require("@replit/vite-plugin-dev-banner");
    replitPlugins.push(devBanner());
  } catch (e) {
    // Plugin not available, skip
  }
}

export default defineConfig({
  plugins: [
    react(),
    ...replitPlugins,
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
