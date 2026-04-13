{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_22
    pkgs.jdk17
    pkgs.android-tools
  ];
  env = {
    JAVA_HOME = "${pkgs.jdk17}";
    ANDROID_HOME = "/home/user/Android/Sdk";
  };
  idx = {
    extensions = [
      "dsznajder.es7-react-js-snippets"
    ];
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "-p" "$PORT"];
          manager = "web";
        };
      };
    };
  };
}