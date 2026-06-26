import { defineConfig } from "vite-plus";

// App-local build/test config only. Lint, format, and staged checks come from
// the workspace root vite.config.ts.
export default defineConfig({
  pack: {
    entry: ["src/server.ts"],
    format: ["esm"],
    sourcemap: true,
    dts: false,
  },

  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
