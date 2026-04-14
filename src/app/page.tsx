
"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav, type TabType } from "@/components/layout/BottomNav";
import { StatusView } from "@/components/views/StatusView";
import { SavedView } from "@/components/views/SavedView";
import { PremiumView } from "@/components/views/PremiumView";
import { SettingsView } from "@/components/views/SettingsView";
import { HelpView } from "@/components/views/HelpView";
import { SplashScreen as AppSplashScreen } from "@/components/views/SplashScreen";
import { PermissionView } from "@/components/views/PermissionView";
import { NoInternetView } from "@/components/views/NoInternetView";
import { InterstitialAd } from "@/components/ads/AdComponents";
import { SplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { Filesystem } from '@capacitor/filesystem';

type AppLifecycle = 'splash' | 'permission' | 'main';
type ExtendedTabType = TabType | 'help';

export default function MainApp() {
  const [lifecycle, setLifecycle] = useState<AppLifecycle>('splash');
  const [activeTab, setActiveTab] = useState<ExtendedTabType>('status');
  const [isPro, setIsPro] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);

  useEffect(() => {
    // Initialize last interstitial time if not exists to prevent immediate ad on first action
    if (!localStorage.getItem('last_interstitial_time')) {
      localStorage.setItem('last_interstitial_time', Date.now().toString());
    }

    const hideNativeSplash = async () => {
      try { await SplashScreen.hide(); } catch (e) {}
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
      await new Promise(r => setTimeout(r, 2500));
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

    const handleInterstitialRequest = () => triggerInterstitialLogic();
    window.addEventListener('request-interstitial', handleInterstitialRequest);

    return () => {
      clearInterval(proInterval);
      if (networkListener && typeof networkListener.remove === 'function') {
        networkListener.remove();
      }
      window.removeEventListener('request-interstitial', handleInterstitialRequest);
    };
  }, [isPro]);

  const triggerInterstitialLogic = () => {
    if (isPro) return;
    
    const lastShown = parseInt(localStorage.getItem('last_interstitial_time') || '0');
    const interval = 10 * 60 * 1000; // 10 minutes gap strictly for policy compliance
    
    // Only show if 10 minutes have passed since last ad
    if (Date.now() - lastShown > interval) {
      setShowInterstitial(true);
      localStorage.setItem('last_interstitial_time', Date.now().toString());
    }
  };

  const handleTabChange = (tab: ExtendedTabType) => {
    if (activeTab === tab) return;
    // Interstitial logic removed from tab changes to strictly follow Save/Close requirement
    setActiveTab(tab);
  };

  const handleGrantPermission = async () => {
    try {
      const status = await Filesystem.requestPermissions();
      if (status.publicStorage === 'granted') {
        localStorage.setItem('storage_permission_granted', 'true');
        setLifecycle('main');
      }
    } catch (e) {
      localStorage.setItem('storage_permission_granted', 'true');
      setLifecycle('main');
    }
  };

  if (!isOnline) return <NoInternetView />;
  if (lifecycle === 'splash') return <AppSplashScreen />;
  if (lifecycle === 'permission') return <PermissionView onGrant={handleGrantPermission} />;

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden w-full relative">
      <AppHeader isPro={isPro} onHelpClick={() => handleTabChange('help')} />
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
    </div>
  );
}
