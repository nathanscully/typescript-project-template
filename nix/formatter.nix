{
  perSystem =
    { ... }:
    {
      # Formats the *template repo's own* files (Nix, shell, markdown).
      # Generated projects format themselves via `vp fmt` / treefmt inside the template.
      treefmt = {
        projectRootFile = "flake.nix";
        programs = {
          nixfmt.enable = true;
          shfmt = {
            enable = true;
            indent_size = 2;
          };
          prettier.enable = true; # markdown / yaml / json in this repo
        };
        settings.global.excludes = [
          "templates/**" # template files are formatted by their own toolchain
          "*.lock"
          "flake.lock"
        ];
      };
    };
}
