{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.openjdk17
    pkgs.nodejs_20
    pkgs.nodePackages.firebase-tools
  ];
  idx = {
    extensions = [
      "dsznajder.es7-react-js-snippets"
      "bradlc.vscode-tailwindcss"
    ];
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
    };
  };
}
