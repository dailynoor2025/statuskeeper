
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
import { AD_CONFIG } from "@/lib/ad-config";

type AppLifecycle = 'splash' | 'ad' | 'permission' | 'main';
type ExtendedTabType = TabType | 'help';

/**
 * MainApp - Entry point for the Status Keeper application.
 * Integrated with custom Strategic Prompting logic for rating.
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
    // Session Counting for Rating Logic
    const sessionCount = parseInt(localStorage.getItem('app_session_count') || '0') + 1;
    localStorage.setItem('app_session_count', sessionCount.toString());

    if (!localStorage.getItem('last_interstitial_time')) {
      localStorage.setItem('last_interstitial_time', Date.now().toString());
    }

    const hideNativeSplash = async () => {
      try { await NativeSplashScreen.hide(); } catch (e) {}
    };
    hideNativeSplash();
    
    const checkInitialNetwork = async () => {
      try {
        const status = await Network.getStatus();
        setIsOnline(status.connected);
      } catch (e) {
        setIsOnline(true);
      }
    };
    checkInitialNetwork();

    const checkProStatus = () => {
      const expiry = localStorage.getItem('ad_free_expiry');
      setIsPro(expiry ? parseInt(expiry) > Date.now() : false);
    };
    checkProStatus();
    const proInterval = setInterval(checkProStatus, 5000);

    const initApp = async () => {
      const permissionCheck = checkPermissionsAndProceed(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const lastOpenAd = parseInt(localStorage.getItem('last_app_open_ad_time') || '0');
      const cooldown = AD_CONFIG.SETTINGS.APP_OPEN_COOLDOWN_MS;
      const isAdDue = Date.now() - lastOpenAd > cooldown;
      const expiry = localStorage.getItem('ad_free_expiry');
      const proActive = expiry ? parseInt(expiry) > Date.now() : false;

      if (!proActive && isAdDue) {
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
    try {
      const status = await Filesystem.checkPermissions();
      const hasPerm = status.publicStorage === 'granted' || localStorage.getItem('storage_permission_granted') === 'true';
      if (hasPerm) {
        setLifecycle('main');
      } else if (!silent) {
        setLifecycle('permission');
      }
    } catch (e) {
      if (!silent) setLifecycle('permission');
    }
  };

  const handleAppOpenAdClose = () => {
    setShowAppOpenAd(false);
    localStorage.setItem('last_app_open_ad_time', Date.now().toString());
    setLifecycle('main');
    checkPermissionsAndProceed();
  };

  const triggerRatingLogic = () => {
    const sessions = parseInt(localStorage.getItem('app_session_count') || '0');
    const hasRated = localStorage.getItem('has_rated_app') === 'true';

    // Strategic Prompting: 12+ sessions and only show once
    if (!hasRated && sessions >= 12) {
      setShowRateUs(true);
    }
  };

  const triggerSmartActionLogic = () => {
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
      await Filesystem.requestPermissions();
      localStorage.setItem('storage_permission_granted', 'true');
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
