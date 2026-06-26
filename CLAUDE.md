# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains Nix flake templates for TypeScript projects, built on the
[vite+](https://viteplus.dev) toolchain (Vite 8, Oxlint, Oxfmt, Vitest, tsdown — the
`vp` CLI). It provides three template variants, easiest to most complex:

1. **backend** — Node.js + Fastify + zod-openapi (OpenAPI/Swagger UI)
2. **spa** — Vite 8 + TanStack Router (file-based) + TanStack Query + Tailwind 4
3. **monorepo** — pnpm + vite+ workspace wiring `apps/server` + `apps/client` + `packages/tsconfig`

The runtime (Node + pnpm) is pinned by Nix; vite+ is a normal dev-dependency
(`pnpm exec vp`) with its own runtime manager disabled (`VP_ENV_MODE=off`).

## Architecture & key decisions

- **vite+, not Biome.** vite+ replaces ESLint/Prettier/Biome (Oxlint + Oxfmt),
  the test runner (Vitest), the bundler (Vite/tsdown), and commit hooks. All tool
  config lives in each project's `vite.config.ts` (`lint`/`fmt`/`test`/`pack`/`staged`
  blocks) via `defineConfig` from `vite-plus`. Do NOT add `.oxlintrc.json`,
  `vitest.config.ts`, etc.
- **Nix owns the runtime.** Each template's `flake.nix` pins `nodejs_24` + `pnpm`.
  vite+'s env manager is off so it never downloads a toolchain.
- **`node-linker=hoisted` is required** in every template `.npmrc`: vite+ ships its
  compiler as a NAPI native addon (`@voidzero-dev/vite-plus-<os>-<arch>`) that pnpm's
  default isolated linker won't place where the binding loader can `require()` it.
  Without this, every `vp` command crashes with "Cannot find native binding".
- **`vitest` is a direct devDependency** in each template (its types aren't resolvable
  via the copy bundled inside `vite-plus`).
- **Backend builds with `vp pack`** (tsdown → `dist/server.mjs`), not `vp build`
  (which is Vite-only and for frontends). SPA/monorepo client build with `vp build`.
- **SPA `vite.config.ts` casts plugins** `as PluginOption[]` (from `vite-plus`) — an
  assignability check (`: PluginOption[]`) triggers TS2321 "excessive stack depth".

## Common commands

```bash
nix flake show              # list the three templates
nix flake check             # eval + formatting checks (offline, fast)
nix fmt                     # format this repo (treefmt: nixfmt/shfmt/prettier)

# L1 smoke tests — init a template, install, vp check, build, boot & curl.
# Network-bound, so they run as apps, not pure checks:
nix run .#smoke-backend
nix run .#smoke-spa
nix run .#smoke-monorepo
```

Use a template: `nix flake init --template github:<owner>/<repo>#backend` (or `#spa` / `#monorepo`).

## Project structure

```
/
├── flake.nix              # flake-parts: templates + devshell + treefmt + smoke checks
├── nix/
│   ├── devshell.nix       # dev shell for working ON the templates
│   ├── formatter.nix      # treefmt for this repo's own files
│   └── checks.nix         # the L1 smoke-test runners (nix run .#smoke-*)
└── templates/
    ├── backend/           # Fastify + zod-openapi
    ├── spa/               # Vite + TanStack SPA
    └── monorepo/          # apps/server + apps/client + packages/tsconfig
```

## Template maintenance

When updating templates:

1. After any change, run the relevant `nix run .#smoke-*` — it is the source of truth.
2. To re-sync Oxfmt formatting into a template after editing: run `vp check --fix`
   in a throwaway install, then copy the changed files back (Oxfmt sorts package.json
   keys and dependency lists, which is tedious to match by hand).
3. Keep tool versions aligned across templates (and the monorepo `catalog:` in
   `pnpm-workspace.yaml`).
4. Bumping the pinned Node: `nix flake update` here updates the smoke-test node; each
   template flake pins its own `nixpkgs`, so bump those too if needed.
