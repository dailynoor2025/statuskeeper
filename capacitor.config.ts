import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qhaleelahmad.statuskeeper',
  appName: 'Status Keeper',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Filesystem: {
      allowOutOfAppDir: true
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: "#25D366",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    AdMob: {
      initializeOnIdfv: true
    }
  }
};

export default config;