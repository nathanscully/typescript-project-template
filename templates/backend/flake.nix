{
  description = "Node.js + Fastify backend (vite+ toolchain, Nix-pinned runtime)";

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
        # Nix owns the runtime. vite+ is a dev-dependency (`pnpm exec vp`) and
        # we keep its env manager off so it never tries to download Node itself.
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
            export VP_ENV_MODE=off          # let Nix's node win; vp won't manage runtime
            echo "backend devshell — node $(node --version), pnpm $(pnpm --version)"
            echo "  pnpm install        install deps"
            echo "  pnpm dev            start Fastify with watch + type-strip"
            echo "  pnpm exec vp check  format + lint + typecheck"
            echo "  pnpm exec vp test   run tests"
            echo "  pnpm run build      bundle to dist/ (tsdown via vp pack)"
          '';
        };
      }
    );
}
