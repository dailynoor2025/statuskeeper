
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
import { NoInternetView } from "@/components/views/NoInternetView";
import { SplashScreen } from "@/components/views/SplashScreen";
import { InterstitialAd } from "@/components/ads/AdComponents";
import { RateUsDialog } from "@/components/ui/RateUsDialog";
import { SplashScreen as NativeSplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { Filesystem } from '@capacitor/filesystem';

type AppLifecycle = 'splash' | 'permission' | 'main';
type ExtendedTabType = TabType | 'help';

/**
 * MainApp - Entry point for the Status Keeper application.
 * Optimized for Tier 1 markets with intelligent Rate Us logic and ad-conflict management.
 */
export default function MainApp() {
  const [lifecycle, setLifecycle] = useState<AppLifecycle>('splash');
  const [activeTab, setActiveTab] = useState<ExtendedTabType>('status');
  const [isPro, setIsPro] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showRateUs, setShowRateUs] = useState(false);

  useEffect(() => {
    // 1. Session Counting: Track how many times user returns to the app
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

    let networkListener: any;
    const setupNetworkListener = async () => {
      try {
        networkListener = await Network.addListener('networkStatusChange', status => {
          setIsOnline(status.connected);
        });
      } catch (e) {}
    };
    setupNetworkListener();

    const checkProStatus = () => {
      const expiry = localStorage.getItem('ad_free_expiry');
      setIsPro(expiry ? parseInt(expiry) > Date.now() : false);
    };
    checkProStatus();
    const proInterval = setInterval(checkProStatus, 5000);

    const initApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const status = await Filesystem.checkPermissions();
        if (status.publicStorage === 'granted' || localStorage.getItem('storage_permission_granted') === 'true') {
          setLifecycle('main');
        } else {
          setLifecycle('permission');
        }
      } catch (e) {
        setLifecycle('permission');
      }
    };
    initApp();

    const handleInterstitialRequest = () => triggerSmartActionLogic();
    const handleRateUsRequest = () => setShowRateUs(true);

    window.addEventListener('request-interstitial', handleInterstitialRequest);
    window.addEventListener('request-rate-us', handleRateUsRequest);

    return () => {
      clearInterval(proInterval);
      if (networkListener && typeof networkListener.remove === 'function') {
        networkListener.remove();
      }
      window.removeEventListener('request-interstitial', handleInterstitialRequest);
      window.removeEventListener('request-rate-us', handleRateUsRequest);
    };
  }, []);

  const triggerSmartActionLogic = () => {
    const expiry = localStorage.getItem('ad_free_expiry');
    const proActive = expiry ? parseInt(expiry) > Date.now() : false;
    
    const lastAdShown = parseInt(localStorage.getItem('last_interstitial_time') || '0');
    const adInterval = 10 * 60 * 1000;
    const isAdDue = (Date.now() - lastAdShown > adInterval);

    // LOGIC: Check if it's time for Rate Us instead of Ad
    const sessions = parseInt(localStorage.getItem('app_session_count') || '0');
    const hasPromptedRate = localStorage.getItem('has_seen_rate_prompt') === 'true';

    // Tier 1 logic: Prompt only once ever, after 12 sessions, and when ad IS NOT showing
    if (!hasPromptedRate && sessions >= 12 && (!isAdDue || proActive)) {
      setShowRateUs(true);
      localStorage.setItem('has_seen_rate_prompt', 'true');
      return; // Stop here, don't show ad
    }

    // Standard Ad Logic
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

  if (!isOnline) return <NoInternetView />;
  if (lifecycle === 'splash') return <SplashScreen />;
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
