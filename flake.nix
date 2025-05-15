{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs =
    { nixpkgs, ... }:
    {
      devShells =
        let
          system = "x86_64-linux";
          pkgs = import nixpkgs { inherit system; };
        in
        {
          ${system}.default = pkgs.mkShellNoCC {
            packages = with pkgs; [
              deno
              pkgs.nil # Nix language server
              pkgs.nixfmt-rfc-style
            ];
          };
        };
    };
}
