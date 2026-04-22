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
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapacitorApp } from '@capacitor/app';
import { AD_CONFIG } from "@/lib/ad-config";
import { NoInternetView } from "@/components/views/NoInternetView";

type AppLifecycle = 'splash' | 'ad' | 'permission' | 'main';
type ExtendedTabType = TabType | 'help';

/**
 * MainApp - Stable Build Foundation.
 * Orchestrates all 13 Capacitor plugins for high-performance Debug & Release environments.
 */
export default function MainApp() {
  const [lifecycle, setLifecycle] = useState<AppLifecycle>('splash');
  const [activeTab, setActiveTab] = useState<ExtendedTabType>('status');
  const [isPro, setIsPro] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showAppOpenAd, setShowAppOpenAd] = useState(false);
  const [showRateUs, setShowRateUs] = useState(false);

  useEffect(() => {
    // 1. Initial Native UI Sync
    const syncNativeUI = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
          await NativeSplashScreen.hide();
        } catch (e) {}
      }
    };
    syncNativeUI();

    // 2. Network Monitoring
    const initNetwork = async () => {
      try {
        const status = await Network.getStatus();
        setIsOffline(!status.connected);
        Network.addListener('networkStatusChange', status => {
          setIsOffline(!status.connected);
        });
      } catch (e) {}
    };
    initNetwork();

    // 3. Pro Status & Session Tracking
    const checkProStatus = () => {
      const expiry = localStorage.getItem('ad_free_expiry');
      const active = expiry ? parseInt(expiry) > Date.now() : false;
      setIsPro(active);
      
      const sessions = parseInt(localStorage.getItem('app_sessions') || '0') + 1;
      localStorage.setItem('app_sessions', sessions.toString());
    };
    checkProStatus();

    // 4. Interstitial Trigger Listener
    const handleRequestInterstitial = () => {
      const expiry = localStorage.getItem('ad_free_expiry');
      const proActive = expiry ? parseInt(expiry) > Date.now() : false;
      if (proActive) return;

      const lastInterstitial = parseInt(localStorage.getItem('last_interstitial_time') || '0');
      if (Date.now() - lastInterstitial > AD_CONFIG.SETTINGS.INTERSTITIAL_INTERVAL_MS) {
        setShowInterstitial(true);
        localStorage.setItem('last_interstitial_time', Date.now().toString());
      }
    };

    window.addEventListener('request-interstitial', handleRequestInterstitial);

    // 5. App Lifecycle Orchestration
    const initApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const expiry = localStorage.getItem('ad_free_expiry');
      const proActive = expiry ? parseInt(expiry) > Date.now() : false;

      if (Capacitor.isNativePlatform() && !proActive) {
        const lastOpenAd = parseInt(localStorage.getItem('last_app_open_ad_time') || '0');
        if (Date.now() - lastOpenAd > AD_CONFIG.SETTINGS.APP_OPEN_COOLDOWN_MS) {
          setLifecycle('ad');
          setShowAppOpenAd(true);
          return;
        }
      }

      await proceedToMain();
    };
    initApp();

    return () => {
      Network.removeAllListeners();
      window.removeEventListener('request-interstitial', handleRequestInterstitial);
    };
  }, []);

  const proceedToMain = async () => {
    if (!Capacitor.isNativePlatform()) {
      setLifecycle('main');
      return;
    }

    try {
      const { publicStorage } = await Filesystem.checkPermissions();
      if (publicStorage === 'granted' || localStorage.getItem('storage_granted') === 'true') {
        setLifecycle('main');
      } else {
        setLifecycle('permission');
      }
    } catch (e) {
      setLifecycle('main');
    }
  };

  const handleGrantPermission = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await Filesystem.requestPermissions();
        if (result.publicStorage === 'granted') {
          localStorage.setItem('storage_granted', 'true');
          await Haptics.impact({ style: ImpactStyle.Medium });
        }
      } catch (e) {}
    }
    setLifecycle('main');
  };

  const handleAppOpenClose = () => {
    setShowAppOpenAd(false);
    localStorage.setItem('last_app_open_ad_time', Date.now().toString());
    proceedToMain();
  };

  const handleTabChange = async (tab: TabType) => {
    setActiveTab(tab);
    if (Capacitor.isNativePlatform()) {
      await Haptics.selection();
    }
  };

  if (isOffline) return <NoInternetView />;
  if (lifecycle === 'splash') return <SplashScreen />;
  if (lifecycle === 'ad') return <AppOpenAd isOpen={showAppOpenAd} onClose={handleAppOpenClose} />;
  if (lifecycle === 'permission') return <PermissionView onGrant={handleGrantPermission} />;

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden w-full relative">
      <AppHeader 
        isPro={isPro} 
        onHelpClick={() => setActiveTab('help')} 
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

      <BottomNav 
        activeTab={activeTab === 'help' ? 'status' : activeTab as TabType} 
        onTabChange={handleTabChange} 
      />
      
      <InterstitialAd isOpen={showInterstitial} onClose={() => setShowInterstitial(false)} />
      <RateUsDialog isOpen={showRateUs} onClose={() => setShowRateUs(false)} />
    </div>
  );
}
