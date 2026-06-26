import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { type PluginOption, defineConfig } from "vite-plus";

// App-local Vite + test config. Lint, format, and staged checks come from the
// workspace root vite.config.ts.

// Cast (not annotate) to vite+'s PluginOption: an `as` cast bridges minor Vite
// type-version skew between the plugins and avoids a TS2321 "excessive stack
// depth" that an assignability check would trigger.
const plugins = [
  tanstackRouter({ target: "react", autoCodeSplitting: true }),
  react(),
  tailwindcss(),
] as PluginOption[];

export default defineConfig({
  plugins,

  server: {
    port: 3000,
    // Proxy /api to the Fastify server in dev so the SPA can call it same-origin.
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test-setup.ts"],
  },
});
