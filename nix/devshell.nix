{
  perSystem =
    { pkgs, ... }:
    {
      devShells.default = pkgs.mkShell {
        # Tools for *developing the templates themselves* (not the generated projects).
        packages = with pkgs; [
          nodejs_24
          (pnpm.override { withNode = false; })
          git
          jq
          nix-prefetch-git
        ];

        shellHook = ''
          echo "ts-project-template dev shell"
          echo "  nix flake show            list the templates"
          echo "  nix flake check           run eval + L1 smoke checks"
          echo "  nix run .#smoke-backend   smoke-test the backend template"
          echo "  nix run .#smoke-spa       smoke-test the spa template"
          echo "  nix run .#smoke-monorepo  smoke-test the monorepo template"
        '';
      };
    };
}
