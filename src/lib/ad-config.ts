/**
 * Centralized AdMob configuration for production.
 * Placements: Native video, Interstitial, and Rewarded only.
 */

export const AD_CONFIG = {
  // Official AdMob app ID
  APP_ID: "ca-app-pub-9704872868499742~4538679298",

  // Ad unit IDs categorized by placement logic
  UNITS: {
    // Native video ads integrated into the gallery grids (StatusView & SavedView)
    NATIVE: "ca-app-pub-3940256099942544/2247696110", 

    // Interstitial ads shown during navigation between major app views
    INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712", 

    // Rewarded ads for unlocking pro status in the premium dashboard
    REWARDED: "ca-app-pub-3940256099942544/5224354917", 
  },

  // Operational settings
  SETTINGS: {
    INTERSTITIAL_INTERVAL_MS: 10 * 60 * 1000, // 10 minutes
    REWARDED_COUNTDOWN_SEC: 10,
  }
};