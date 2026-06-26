{
  description = "pnpm + vite+ monorepo (Fastify backend + TanStack SPA), Nix-pinned runtime";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        node = pkgs.nodejs_24;
        pnpm = pkgs.pnpm.override { withNode = false; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            node
            pnpm
            pkgs.git
          ];

          env.VITE_GIT_HOOKS = "1";

          shellHook = ''
            export VP_ENV_MODE=off          # Nix owns the runtime; vp must not manage it
            echo "monorepo devshell — node $(node --version), pnpm $(pnpm --version)"
            echo "  pnpm install            install all workspaces"
            echo "  pnpm dev                run client + server (parallel)"
            echo "  pnpm exec vp check      format + lint + typecheck (whole repo)"
            echo "  pnpm run test           run tests across workspaces"
            echo "  pnpm run build          build all workspaces in dependency order"
          '';
        };
      }
    );
}
