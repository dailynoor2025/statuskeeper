"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav, type TabType } from "@/components/layout/BottomNav";
import { StatusView } from "@/components/views/StatusView";
import { SavedView } from "@/components/views/SavedView";
import { PremiumView } from "@/components/views/PremiumView";
import { SettingsView } from "@/components/views/SettingsView";
import { HelpView } from "@/components/views/HelpView";
import { PermissionView } from "@/components/views/PermissionView";
import { SplashScreen } from "@/components/views/SplashScreen";
import { InterstitialAd, AppOpenAd } from "@/components/ads/AdComponents";
import { RateUsDialog } from "@/components/ui/RateUsDialog";
import { SplashScreen as NativeSplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { AD_CONFIG } from "@/lib/ad-config";

type AppLifecycle = 'splash' | 'ad' | 'permission' | 'main';
type ExtendedTabType = TabType | 'help';

/**
 * MainApp - Stable Build Foundation.
 * Distinguishes between Web (Debug) and Native (Release) lifecycles.
 */
export default function MainApp() {
  const [lifecycle, setLifecycle] = useState<AppLifecycle>('splash');
  const [activeTab, setActiveTab] = useState<ExtendedTabType>('status');
  const [isPro, setIsPro] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showAppOpenAd, setShowAppOpenAd] = useState(false);
  const [showRateUs, setShowRateUs] = useState(false);

  useEffect(() => {
    // 1. Session tracking for strategic rating
    const sessionCount = parseInt(localStorage.getItem('app_session_count') || '0') + 1;
    localStorage.setItem('app_session_count', sessionCount.toString());

    // 2. Clear native splash screen instantly
    const hideNativeSplash = async () => {
      if (Capacitor.isNativePlatform()) {
        try { await NativeSplashScreen.hide(); } catch (e) {}
      }
    };
    hideNativeSplash();
    
    // 3. Subscription status check
    const checkProStatus = () => {
      const expiry = localStorage.getItem('ad_free_expiry');
      setIsPro(expiry ? parseInt(expiry) > Date.now() : false);
    };
    checkProStatus();
    const proInterval = setInterval(checkProStatus, 5000);

    // 4. Launch sequence: Splash -> [Ad] -> [Permission] -> Main
    const initApp = async () => {
      // Release Logic: Asset stabilization time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isNative = Capacitor.isNativePlatform();
      const expiry = localStorage.getItem('ad_free_expiry');
      const proActive = expiry ? parseInt(expiry) > Date.now() : false;

      // Handle App Open Ad (Native Release only)
      if (isNative && !proActive) {
        const lastOpenAd = parseInt(localStorage.getItem('last_app_open_ad_time') || '0');
        const cooldown = AD_CONFIG.SETTINGS.APP_OPEN_COOLDOWN_MS;
        
        if (Date.now() - lastOpenAd > cooldown) {
          setLifecycle('ad');
          setShowAppOpenAd(true);
          return;
        }
      }

      // Check permissions if no Ad is shown
      await checkPermissionsAndProceed();
    };
    initApp();

    const handleInterstitialRequest = () => triggerSmartActionLogic();
    const handleRatingRequest = () => triggerRatingLogic();

    window.addEventListener('request-interstitial', handleInterstitialRequest);
    window.addEventListener('request-rating', handleRatingRequest);

    return () => {
      clearInterval(proInterval);
      window.removeEventListener('request-interstitial', handleInterstitialRequest);
      window.removeEventListener('request-rating', handleRatingRequest);
    };
  }, []);

  const checkPermissionsAndProceed = async () => {
    if (!Capacitor.isNativePlatform()) {
      setLifecycle('main');
      return;
    }

    try {
      const status = await Filesystem.checkPermissions();
      const hasPerm = status.publicStorage === 'granted' || localStorage.getItem('storage_permission_granted') === 'true';
      
      if (hasPerm) {
        setLifecycle('main');
      } else {
        setLifecycle('permission');
      }
    } catch (e) {
      // Fallback for unexpected failures in legacy devices
      setLifecycle('main');
    }
  };

  const handleAppOpenAdClose = () => {
    setShowAppOpenAd(false);
    localStorage.setItem('last_app_open_ad_time', Date.now().toString());
    // Move to next step in lifecycle
    checkPermissionsAndProceed();
  };

  const triggerRatingLogic = () => {
    if (!Capacitor.isNativePlatform()) return;

    const sessions = parseInt(localStorage.getItem('app_session_count') || '0');
    const hasRated = localStorage.getItem('has_rated_app') === 'true';

    // Show rating dialog after reaching session threshold
    if (!hasRated && sessions >= AD_CONFIG.SETTINGS.SESSION_RATING_THRESHOLD) {
      setShowRateUs(true);
    }
  };

  const triggerSmartActionLogic = () => {
    if (!Capacitor.isNativePlatform()) return;

    const expiry = localStorage.getItem('ad_free_expiry');
    const proActive = expiry ? parseInt(expiry) > Date.now() : false;
    
    if (proActive) return;

    const lastAdShown = parseInt(localStorage.getItem('last_interstitial_time') || '0');
    const adInterval = AD_CONFIG.SETTINGS.INTERSTITIAL_INTERVAL_MS;

    if (Date.now() - lastAdShown > adInterval) {
      setShowInterstitial(true);
      localStorage.setItem('last_interstitial_time', Date.now().toString());
    } else {
      triggerRatingLogic();
    }
  };

  const handleTabChange = (tab: ExtendedTabType) => {
    if (activeTab === tab) return;
    setActiveTab(tab);
  };

  const handleGrantPermission = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const result = await Filesystem.requestPermissions();
        if (result.publicStorage === 'granted') {
          localStorage.setItem('storage_permission_granted', 'true');
        }
      }
      setLifecycle('main');
    } catch (e) {
      localStorage.setItem('storage_permission_granted', 'true');
      setLifecycle('main');
    }
  };

  if (lifecycle === 'splash') return <SplashScreen />;
  if (lifecycle === 'ad') return <AppOpenAd isOpen={showAppOpenAd} onClose={handleAppOpenAdClose} />;
  if (lifecycle === 'permission') return <PermissionView onGrant={handleGrantPermission} />;

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden w-full relative">
      <AppHeader 
        isPro={isPro} 
        onHelpClick={() => handleTabChange('help')} 
        onRateClick={() => setShowRateUs(true)}
      />
      
      <div className="flex-1 overflow-y-auto no-scrollbar w-full relative">
        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-400 w-full h-full">
          {activeTab === 'status' && <StatusView />}
          {activeTab === 'saved' && <SavedView />}
          {activeTab === 'premium' && <PremiumView isPro={isPro} onProChange={setIsPro} />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'help' && <HelpView />}
        </div>
      </div>

      <BottomNav activeTab={activeTab === 'help' ? 'status' : activeTab as TabType} onTabChange={handleTabChange} />
      
      <InterstitialAd isOpen={showInterstitial} onClose={() => setShowInterstitial(false)} />
      <RateUsDialog isOpen={showRateUs} onClose={() => setShowRateUs(false)} />
    </div>
  );
}
