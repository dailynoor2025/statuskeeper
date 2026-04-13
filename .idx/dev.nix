{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
    pkgs.openjdk17
    pkgs.android-tools
  ];
  idx = {
    extensions = [
      "dsznajder.es7-react-js-snippets"
      "bradlc.vscode-tailwindcss"
    ];
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm", "run", "dev", "--", "--port", "$PORT", "--hostname", "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}