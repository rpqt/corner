{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-parts.inputs.nixpkgs-lib.follows = "nixpkgs";
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake
      {
        inherit inputs;
      }
      {
        systems = [
          "x86_64-linux"
          "aarch64-linux"
        ];

        perSystem =
          { pkgs, ... }:
          {
            devShells.default = pkgs.mkShellNoCC {
              packages = [
                pkgs.deno
                pkgs.nil # Nix language server
                pkgs.nixfmt-rfc-style
                pkgs.typst
                pkgs.pandoc
                pkgs.tinymist
                pkgs.vscode-css-languageserver
              ];

              FONTCONFIG_FILE = pkgs.makeFontsConf {
                fontDirectories = [
                  pkgs.atkinson-hyperlegible-next
                ];
              };
            };
          };
      };
}
