/**
 * Centralized AdMob configuration for production.
 * Placements: Native video, Interstitial, and Rewarded only.
 */

export const AD_CONFIG = {
  // Official AdMob App ID
  APP_ID: "ca-app-pub-9704872868499742~4538679298",

  // Ad unit IDs for direct AdMob server connection
  UNITS: {
    // Native video ads integrated into the gallery grids
    NATIVE: "ca-app-pub-9704872868499742/6511690000", 

    // Interstitial ads shown during navigation
    INTERSTITIAL: "ca-app-pub-9704872868499742/1450930000", 

    // Rewarded ads for unlocking pro status
    REWARDED: "ca-app-pub-9704872868499742/6915220000", 
  },

  // Operational settings
  SETTINGS: {
    INTERSTITIAL_INTERVAL_MS: 10 * 60 * 1000, // 10 minutes
    REWARDED_COUNTDOWN_SEC: 10,
  }
};