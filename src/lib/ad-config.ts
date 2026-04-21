/**
 * Centralized AdMob configuration.
 * Placements: App open, Native video, Interstitial, and Rewarded.
 */

export const AD_CONFIG = {
  // Official AdMob App ID
  APP_ID: "ca-app-pub-9704872868499742~4538679298",

  // Production Ad Unit IDs
  UNITS: {
    APP_OPEN: "ca-app-pub-9704872868499742/1450930000",
    NATIVE: "ca-app-pub-9704872868499742/6511690000", 
    INTERSTITIAL: "ca-app-pub-9704872868499742/1450930000", 
    REWARDED: "ca-app-pub-9704872868499742/6915220000", 
  },

  // Operational settings for Stable Build
  SETTINGS: {
    INTERSTITIAL_INTERVAL_MS: 10 * 60 * 1000, // 10 minutes interval
    APP_OPEN_COOLDOWN_MS: 30 * 1000,         // 30 seconds cooldown between opens
    REWARDED_COUNTDOWN_SEC: 10,
    SESSION_RATING_THRESHOLD: 12,            // Show rating after 12 sessions
  }
};