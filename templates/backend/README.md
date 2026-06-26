# backend

A Node.js + [Fastify](https://fastify.dev) backend with end-to-end type safety
via [zod-openapi](https://github.com/samchungy/zod-openapi). Tooling is the
[vite+](https://viteplus.dev) toolchain (Oxlint, Oxfmt, Vitest, tsdown); the
Node + pnpm runtime is pinned with Nix.

## Requirements

- [Nix](https://nixos.org) with flakes enabled (provides Node + pnpm)
- Optional: [direnv](https://direnv.net) — `direnv allow` to auto-enter the shell

## Getting started

```bash
nix develop          # or: direnv allow
pnpm install
pnpm dev             # Fastify with --watch + native TS type-stripping
```

- API: <http://localhost:3000>
- Health: <http://localhost:3000/health>
- OpenAPI docs (Swagger UI): <http://localhost:3000/docs>

## Commands

| Command               | What it does                                      |
| --------------------- | ------------------------------------------------- |
| `pnpm dev`            | Run the server with watch + type-stripping        |
| `pnpm start`          | Run the server once (no watch)                    |
| `pnpm exec vp check`  | Format + lint + typecheck (Oxfmt/Oxlint/tsgolint) |
| `pnpm exec vp test`   | Run the Vitest suite                              |
| `pnpm run build`      | Bundle to `dist/` with tsdown (`vp pack`)         |
| `pnpm run start:dist` | Run the bundled build                             |

## How it fits together

- **Runtime is Nix-owned.** The flake pins `nodejs_24` + `pnpm`. vite+'s own
  runtime manager is disabled (`VP_ENV_MODE=off`) so it never downloads Node.
- **All tool config lives in `vite.config.ts`** — the `lint`, `fmt`, `test`,
  `pack`, and `staged` blocks. There is no `.oxlintrc.json` / `vitest.config.ts`.
- **No build step in dev.** Node 24 strips types at runtime, so `src/server.ts`
  runs directly. Production builds bundle with tsdown via `pnpm run build`.
- **Commit hooks are built in.** `pnpm install` runs `vp config`, installing a
  pre-commit hook that runs `vp check --fix` on staged files
  (`staged` block). Set `VITE_GIT_HOOKS=0` to skip.

## Layout

```
src/
├── server.ts        # entrypoint: binds the port, graceful shutdown
├── app.ts           # buildApp(): Fastify + zod-openapi + swagger wiring
├── app.test.ts      # tests via app.inject() (no port needed)
└── routes/
    ├── index.ts     # registers all route plugins
    ├── health.ts    # GET /health
    └── echo.ts      # POST /echo (request validation example)
```

Add a route module under `src/routes/`, then register it in `routes/index.ts`.
