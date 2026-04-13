{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_22
    pkgs.openjdk17
    pkgs.android-tools
  ];
  env = {
    JAVA_HOME = "${pkgs.openjdk17}";
    ANDROID_HOME = "/usr/lib/android-sdk";
  };
  idx = {
    extensions = [
      "usernamehw.errorlens"
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
