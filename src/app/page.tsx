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
 * Manages Debug vs Release logics for AdMob and In-App Review.
 */
export default function MainApp() {
  const [lifecycle, setLifecycle] = useState<AppLifecycle>('splash');
  const [activeTab, setActiveTab] = useState<ExtendedTabType>('status');
  const [isPro, setIsPro] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showAppOpenAd, setShowAppOpenAd] = useState(false);
  const [showRateUs, setShowRateUs] = useState(false);

  useEffect(() => {
    // 1. Session Logic for Release builds
    const sessionCount = parseInt(localStorage.getItem('app_session_count') || '0') + 1;
    localStorage.setItem('app_session_count', sessionCount.toString());

    if (!localStorage.getItem('last_interstitial_time')) {
      localStorage.setItem('last_interstitial_time', Date.now().toString());
    }

    // 2. Hide Native Splash Screen instantly
    const hideNativeSplash = async () => {
      if (Capacitor.isNativePlatform()) {
        try { await NativeSplashScreen.hide(); } catch (e) {}
      }
    };
    hideNativeSplash();
    
    // 3. Network Connection Check
    const checkInitialNetwork = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const status = await Network.getStatus();
          setIsOnline(status.connected);
        } catch (e) {
          setIsOnline(true);
        }
      }
    };
    checkInitialNetwork();

    // 4. Pro Status Subscription Logic
    const checkProStatus = () => {
      const expiry = localStorage.getItem('ad_free_expiry');
      setIsPro(expiry ? parseInt(expiry) > Date.now() : false);
    };
    checkProStatus();
    const proInterval = setInterval(checkProStatus, 5000);

    // 5. Initial Launch Sequence (Debug vs Release)
    const initApp = async () => {
      const permissionCheck = checkPermissionsAndProceed(true);
      
      // Release Logic: Pre-load Ad during splash
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const lastOpenAd = parseInt(localStorage.getItem('last_app_open_ad_time') || '0');
      const cooldown = AD_CONFIG.SETTINGS.APP_OPEN_COOLDOWN_MS;
      const isAdDue = Date.now() - lastOpenAd > cooldown;
      const expiry = localStorage.getItem('ad_free_expiry');
      const proActive = expiry ? parseInt(expiry) > Date.now() : false;

      // Show App Open Ad only on Native + Not Pro + Not Cooldown
      if (Capacitor.isNativePlatform() && !proActive && isAdDue) {
        setLifecycle('ad');
        setShowAppOpenAd(true);
      } else {
        await permissionCheck;
      }
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

  const checkPermissionsAndProceed = async (silent = false) => {
    if (!Capacitor.isNativePlatform()) {
      setLifecycle('main');
      return;
    }

    try {
      const status = await Filesystem.checkPermissions();
      const hasPerm = status.publicStorage === 'granted' || localStorage.getItem('storage_permission_granted') === 'true';
      if (hasPerm) {
        setLifecycle('main');
      } else if (!silent) {
        setLifecycle('permission');
      } else {
        setLifecycle('main'); // Proceed to main in silent debug mode
      }
    } catch (e) {
      setLifecycle('main');
    }
  };

  const handleAppOpenAdClose = () => {
    setShowAppOpenAd(false);
    localStorage.setItem('last_app_open_ad_time', Date.now().toString());
    // Instant launch to main screen
    setLifecycle('main');
    checkPermissionsAndProceed();
  };

  const triggerRatingLogic = () => {
    const sessions = parseInt(localStorage.getItem('app_session_count') || '0');
    const hasRated = localStorage.getItem('has_rated_app') === 'true';

    // Strategic Prompting: 12+ sessions for Tier 1 quality feedback
    if (!hasRated && sessions >= 12) {
      setShowRateUs(true);
    }
  };

  const triggerSmartActionLogic = () => {
    if (!Capacitor.isNativePlatform()) return;

    const expiry = localStorage.getItem('ad_free_expiry');
    const proActive = expiry ? parseInt(expiry) > Date.now() : false;
    
    const lastAdShown = parseInt(localStorage.getItem('last_interstitial_time') || '0');
    const adInterval = AD_CONFIG.SETTINGS.INTERSTITIAL_INTERVAL_MS;
    const isAdDue = (Date.now() - lastAdShown > adInterval);

    if (proActive || !isAdDue) {
      triggerRatingLogic();
      return;
    }

    if (!proActive && isAdDue) {
      setShowInterstitial(true);
      localStorage.setItem('last_interstitial_time', Date.now().toString());
    }
  };

  const handleTabChange = (tab: ExtendedTabType) => {
    if (activeTab === tab) return;
    setActiveTab(tab);
  };

  const handleGrantPermission = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Filesystem.requestPermissions();
        localStorage.setItem('storage_permission_granted', 'true');
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