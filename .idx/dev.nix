{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.jdk21
    pkgs.nodejs_22
    pkgs.nodePackages.npm
    pkgs.nodePackages.pnpm
    pkgs.bun
  ];
  env = {
    JAVA_HOME = "${pkgs.jdk21}/lib/openjdk";
  };
  idx = {
    extensions = [
      "ms-vscode.js-debug"
      "ms-vscode.vscode-typescript-next"
    ];
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        # Optional: Add any start commands
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}