/**
 * Centralized AdMob configuration for production.
 * Placements: App open, Native video, Interstitial, and Rewarded.
 */

export const AD_CONFIG = {
  // Official AdMob App ID (Linked in AndroidManifest.xml)
  APP_ID: "ca-app-pub-9704872868499742~4538679298",

  // Ad unit IDs for direct AdMob server connection
  UNITS: {
    // App open ad shown on app start/resume
    APP_OPEN: "ca-app-pub-9704872868499742/1450930000",

    // Native video ads integrated into the gallery grids
    NATIVE: "ca-app-pub-9704872868499742/6511690000", 

    // Interstitial ads shown during navigation transitions
    INTERSTITIAL: "ca-app-pub-9704872868499742/1450930000", 

    // Rewarded ads for unlocking pro status
    REWARDED: "ca-app-pub-9704872868499742/6915220000", 
  },

  // Operational settings following Google Best Practices
  SETTINGS: {
    INTERSTITIAL_INTERVAL_MS: 10 * 60 * 1000, // 10 minutes gap
    APP_OPEN_COOLDOWN_MS: 15 * 60 * 1000,    // 15 minutes gap for app open
    AD_EXPIRATION_MS: 4 * 60 * 60 * 1000,    // 4 hours expiration for loaded ads
    REWARDED_COUNTDOWN_SEC: 10,
  }
};
