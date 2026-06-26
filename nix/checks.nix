{
  perSystem =
    { pkgs, self', ... }:
    let
      # ---------------------------------------------------------------------
      # L1 smoke-test runner.
      #
      # Pure `nix flake check` derivations run sandboxed & offline, so they
      # cannot `pnpm install`. Instead each template's smoke test is a
      # runnable app: it copies the template to a temp dir, installs deps,
      # runs `vp check` + build, optionally boots the server and curls it.
      #
      # `extraSteps` is shell run from inside the initialised project dir,
      # after `pnpm install`. It should fail (non-zero) on any problem.
      # ---------------------------------------------------------------------
      mkSmoke =
        {
          name,
          template,
          extraSteps,
        }:
        pkgs.writeShellApplication {
          name = "smoke-${name}";
          runtimeInputs = with pkgs; [
            nodejs_24
            (pnpm.override { withNode = false; })
            git
            curl
            coreutils
          ];
          text = ''
            set -euo pipefail
            export PNPM_HOME="$HOME/.local/share/pnpm"
            work="$(mktemp -d)"
            # Keep the dir on failure for debugging; clean only on success.
            ok=0
            trap '[ "$ok" = 1 ] && rm -rf "$work" || echo "↳ kept work dir for debugging: $work"' EXIT
            echo "▸ smoke[${name}]: copying template → $work"
            cp -r "${../templates}/${template}/." "$work/"
            chmod -R u+w "$work"        # files come read-only from the Nix store
            cd "$work"
            # vp's commit-hook setup and some tooling expect a git repo.
            git init -q
            git config user.email smoke@example.com
            git config user.name smoke
            git add -A

            echo "▸ smoke[${name}]: pnpm install"
            # No lockfile is shipped in the template, so install fresh.
            # vp's native binding ships as a platform optionalDependency — make
            # sure optional deps are installed for this platform.
            pnpm install --no-frozen-lockfile --config.confirmModulesPurge=false

            ${extraSteps}

            ok=1
            echo "✓ smoke[${name}]: passed"
          '';
        };

      backendSmoke = mkSmoke {
        name = "backend";
        template = "backend";
        extraSteps = ''
          echo "▸ vp check (lint + format + types)"
          pnpm exec vp check

          echo "▸ build"
          pnpm run build

          echo "▸ boot server + curl /health"
          PORT=3030 pnpm run start &
          srv=$!
          for _ in $(seq 1 40); do
            if curl -fsS "http://127.0.0.1:3030/health" >/dev/null 2>&1; then break; fi
            sleep 0.25
          done
          body="$(curl -fsS http://127.0.0.1:3030/health || true)"
          kill "$srv" 2>/dev/null || true
          echo "  /health → $body"
          echo "$body" | grep -q '"status"' || { echo "✗ health check failed"; exit 1; }
        '';
      };

      spaSmoke = mkSmoke {
        name = "spa";
        template = "spa";
        extraSteps = ''
          echo "▸ vp check (lint + format + types)"
          pnpm exec vp check

          echo "▸ build"
          pnpm run build

          echo "▸ preview server + curl page"
          # Bind to 127.0.0.1 and let Vite choose a free port (--strictPort off),
          # then read the actual port it printed — robust against a busy port.
          pnpm exec vp preview --host 127.0.0.1 >preview.log 2>&1 &
          srv=$!
          port=""
          for _ in $(seq 1 80); do
            port="$(grep -aoE 'http://127\.0\.0\.1:[0-9]+' preview.log | head -1 | grep -oE '[0-9]+$' || true)"
            [ -n "$port" ] && curl -fsS "http://127.0.0.1:$port/" >/dev/null 2>&1 && break
            sleep 0.25
          done
          page="$(curl -fsS "http://127.0.0.1:$port/" 2>/dev/null || true)"
          kill "$srv" 2>/dev/null || true
          if ! printf '%s' "$page" | grep -qi "<!doctype html\|<html"; then
            echo "✗ page did not render (port=$port); preview log:"; cat preview.log || true
            exit 1
          fi
          echo "  page served on port $port"
        '';
      };

      monorepoSmoke = mkSmoke {
        name = "monorepo";
        template = "monorepo";
        extraSteps = ''
          # Build first: the client's TanStack Router plugin generates
          # src/routeTree.gen.ts during build, which `vp check`'s type pass
          # needs. Real usage runs `pnpm dev`/`build` which does the same.
          echo "▸ build all workspaces"
          pnpm run build

          echo "▸ vp check (lint + format + types across workspace)"
          pnpm exec vp check

          echo "▸ test all workspaces"
          pnpm run test
        '';
      };
    in
    {
      apps = {
        smoke-backend = {
          type = "app";
          program = "${backendSmoke}/bin/smoke-backend";
        };
        smoke-spa = {
          type = "app";
          program = "${spaSmoke}/bin/smoke-spa";
        };
        smoke-monorepo = {
          type = "app";
          program = "${monorepoSmoke}/bin/smoke-monorepo";
        };
      };

      # `nix flake check` runs only the pure, offline-safe checks (eval +
      # formatting). The network-bound smoke tests run via `nix run .#smoke-*`.
      checks = {
        formatting = self'.formatter;
      };
    };
}
