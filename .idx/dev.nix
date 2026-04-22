{ pkgs, ... }: {
  channel = "stable";
  packages = [
    pkgs.nodejs_22
    pkgs.jdk21
    pkgs.android-tools
  ];
  env = {
    ANDROID_HOME = "/home/user/Android/Sdk";
    JAVA_HOME = "${pkgs.jdk21}/lib/openjdk";
  };
  idx = {
    extensions = [
      "google.android-sdk-extension"
    ];
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
