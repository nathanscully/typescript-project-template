import { defineConfig } from "vite-plus";

// Root config: the single home for workspace-wide lint, format, staged checks,
// and task caching. Each app keeps its own vite.config.ts for build/test specifics
// (the client's Vite plugins, the server's tsdown pack config, etc.).
//
// Globs in overrides are resolved from this root file, so use workspace paths
// like "apps/client/**".
export default defineConfig({
  run: {
    // Cache package.json scripts too (vp run -r build/test).
    cache: true,
  },

  lint: {
    ignorePatterns: ["**/dist/**", "**/routeTree.gen.ts"],
    plugins: ["typescript"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
    },
    overrides: [
      {
        // React app: add the react plugin for matched files.
        files: ["apps/client/**"],
        plugins: ["typescript", "react"],
      },
      {
        // Node service: console is fine in a server.
        files: ["apps/server/**"],
        env: { node: true },
        rules: {
          "no-console": "off",
        },
      },
    ],
  },

  fmt: {
    ignorePatterns: ["**/dist/**", "**/routeTree.gen.ts"],
    sortPackageJson: true,
  },

  staged: {
    "*.{ts,tsx,js,jsx,css}": "vp check --fix",
  },
});
