/**
 * Centralized AdMob configuration with official Production IDs.
 * Placements: App open, Native video, Interstitial, and Rewarded.
 * Verified for Stable Build Release.
 */

export const AD_CONFIG = {
  // Official AdMob App ID
  APP_ID: "ca-app-pub-9704872868499742~4538679298",

  // Production Ad Unit IDs provided by the user
  UNITS: {
    APP_OPEN: "ca-app-pub-9704872868499742/7637864780",
    INTERSTITIAL: "ca-app-pub-9704872868499742/1450937798", 
    NATIVE: "ca-app-pub-9704872868499742/6511692783", 
    REWARDED: "ca-app-pub-9704872868499742/6915229492", 
  },

  // Operational settings for Stable Build performance
  SETTINGS: {
    INTERSTITIAL_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes interval for higher revenue
    APP_OPEN_COOLDOWN_MS: 15 * 1000,         // 15 seconds cooldown
    REWARDED_COUNTDOWN_SEC: 10,
    SESSION_RATING_THRESHOLD: 12,            // Strategic rating prompt
  }
};