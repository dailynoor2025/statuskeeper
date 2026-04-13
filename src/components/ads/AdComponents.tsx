"use client";

import { useState, useEffect, useCallback } from 'react';
import { PlayCircle, X, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAds } from '@/hooks/use-ads';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { AD_CONFIG } from '@/lib/ad-config';

/**
 * Native Ad Component - Logic: Only appears if ad content is "ready".
 * If ad fails to load, it returns null to collapse the space.
 */
export function NativeVideoAd({ className }: { className?: string }) {
  const { isPro } = useAds();
  const [adStatus, setAdStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (isPro) return;

    // Logic: Placement calls the ad unit ID from config
    // In production, this hooks into AdMob.addListener('nativeAdLoaded', ...)
    const loadAd = async () => {
      try {
        setAdStatus('loading');
        // Simulating network latency for AdMob fetch
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulating "No Fill" or Network Error (20% chance of failure for demo)
        const isAdAvailable = Math.random() > 0.15;
        setAdStatus(isAdAvailable ? 'ready' : 'error');
      } catch (e) {
        setAdStatus('error');
      }
    };

    loadAd();
  }, [isPro]);

  // If Pro user, or Ad failed to load, don't occupy space
  if (isPro || adStatus === 'error' || adStatus === 'loading') {
    return null;
  }

  return (
    <div className={cn("relative flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 transition-all duration-300 h-full", className)}>
      <div className="absolute top-1 left-1 z-10">
        <div className="bg-black/40 backdrop-blur-md px-1 py-0.5 rounded-md border border-white/10 shadow-sm flex items-center gap-1">
          <span className="text-[6px] font-black text-white tracking-tight">Sponsored</span>
        </div>
      </div>

      <div className="relative aspect-[9/14] w-full bg-gray-900 group cursor-pointer">
        <img src="https://picsum.photos/seed/ad-card-native/400/622" alt="Ad" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
          <div className="bg-primary/20 backdrop-blur-md p-1.5 rounded-full border border-white/30 animate-pulse">
            <PlayCircle className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-[6px] text-white/90 font-bold tracking-tight leading-tight line-clamp-2">Remove ads in settings for a premium experience.</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-1.5 py-1 border-t border-gray-50 bg-primary/5 min-h-[28px]">
        <div className="flex items-center gap-1 overflow-hidden">
          <div className="bg-primary px-1 rounded-[2px] flex-shrink-0"><span className="text-[5px] font-black text-white">Ad</span></div>
          <span className="text-[6px] font-black tracking-tight text-primary truncate">Promoted content</span>
        </div>
        <button className="p-0.5 text-primary hover:bg-primary/10 rounded-md active:scale-90 transition-all duration-200"><ExternalLink className="w-2.5 h-2.5" /></button>
      </div>
    </div>
  );
}

/**
 * Interstitial Ad Component for full-screen transitions.
 */
export function InterstitialAd({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isPro } = useAds();
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (isOpen) {
      setTimer(5);
      const interval = setInterval(() => {
        setTimer(t => {
          if (t <= 1) { clearInterval(interval); return 0; }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (isPro || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-500 overflow-hidden pt-safe">
      <div className="bg-black/40 border-b border-white/5">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black text-white/60 tracking-tight">Sponsored content</span>
          </div>
          <button 
            disabled={timer > 0} 
            onClick={onClose} 
            className={cn(
              "h-9 px-5 rounded-full flex items-center gap-2 transition-all active:scale-95", 
              timer > 0 ? "bg-white/10 text-white/30" : "bg-primary text-white shadow-lg shadow-primary/30"
            )}
          >
            {timer > 0 ? (
              <span className="text-[10px] font-black tracking-tight">Wait {timer}s</span>
            ) : (
              <>
                <span className="text-[10px] font-black tracking-tight">Skip ad</span>
                <X className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[320px] mx-auto space-y-6">
          <div className="relative aspect-[9/16] w-full max-h-[60vh] bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <img src="https://picsum.photos/seed/inter-ad-main/600/1067" alt="Ad content" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/40 to-transparent">
              <h2 className="text-base font-black text-white tracking-tight mb-0.5">Status keeper pro</h2>
              <p className="text-[9px] text-white/60 font-bold tracking-tight leading-none">Upgrade for ad-free experience</p>
            </div>
          </div>
          
          <div className="space-y-4 px-2">
            <Button className="w-full h-12 rounded-xl font-black tracking-tight text-[11px] bg-primary shadow-xl shadow-primary/40 active:scale-95 transition-all">
              Go ad-free now
            </Button>
            <p className="text-[8px] text-center text-white/20 font-bold tracking-tight">Remove ads in settings permanently</p>
          </div>
        </div>
      </div>
      <div className="pb-safe" />
    </div>
  );
}

/**
 * Hook for Rewarded Ads.
 */
export function useRewardedAd(onReward: () => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const showRewardedAd = useCallback(() => {
    if (isProcessing || isWatching) return;
    setIsProcessing(true);
    // Simulate SDK loading
    setTimeout(() => {
      setIsProcessing(false);
      setIsWatching(true);
      setCountdown(AD_CONFIG.SETTINGS.REWARDED_COUNTDOWN_SEC);
      toast({ title: "Video loaded", description: "Watch until end to receive reward" });
    }, 1800); 
  }, [isProcessing, isWatching]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWatching && countdown > 0) {
      interval = setInterval(() => setCountdown(p => p - 1), 1000);
    } else if (isWatching && countdown === 0) {
      setIsWatching(false);
      onReward();
      toast({ title: "Reward success", description: "Pro status updated", variant: "success" });
    }
    return () => clearInterval(interval);
  }, [isWatching, countdown, onReward]);

  return { showRewardedAd, isProcessing, isWatching, countdown };
}