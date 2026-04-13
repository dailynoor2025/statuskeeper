"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to manage global Ad-Free (Pro) status.
 * Checks localStorage for expiration timestamp.
 */
export function useAds() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const checkProStatus = () => {
      const expiry = localStorage.getItem('ad_free_expiry');
      if (expiry) {
        const remaining = parseInt(expiry) - Date.now();
        setIsPro(remaining > 0);
      } else {
        setIsPro(false);
      }
    };

    checkProStatus();
    // Re-check every 5 seconds for status changes
    const interval = setInterval(checkProStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return { isPro };
}
