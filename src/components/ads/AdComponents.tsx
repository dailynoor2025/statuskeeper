"use client";

import { useState, useEffect, useCallback } from 'react';
import { PlayCircle, X, ShieldCheck, ExternalLink, Loader2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAds } from '@/hooks/use-ads';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { AD_CONFIG } from '@/lib/ad-config';

/**
 * Native Video Ad Component - Logic: Only appears if ad content is "ready".
 * Updated to match StatusCard dimensions and styling exactly.
 */
export function NativeVideoAd({ className }: { className?: string }) {
  const { isPro } = useAds();
  const [adStatus, setAdStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPro) return;

    const loadAd = async () => {
      try {
        setAdStatus('loading');
        await new Promise(resolve => setTimeout(resolve, 1200));
        const isAdAvailable = Math.random() > 0.1; // 90% fill rate simulation
        setAdStatus(isAdAvailable ? 'ready' : 'error');
      } catch (e) {
        setAdStatus('error');
      }
    };

    loadAd();
  }, [isPro]);

  useEffect(() => {
    if (adStatus === 'ready') {
      const interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 1));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [adStatus]);

  if (isPro || adStatus === 'error' || adStatus === 'loading') {
    return null;
  }

  return (
    <div className={cn("relative flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 transition-all duration-300 h-full", className)}>
      {/* Sponsored Tag */}
      <div className="absolute top-1.5 left-1.5 z-20">
        <div className="bg-black/40 backdrop-blur-md px-1 py-0.5 rounded-md border border-white/10 shadow-sm flex items-center gap-1">
          <span className="text-[6px] font-black text-white tracking-tight">Sponsored</span>
        </div>
      </div>

      {/* Video Content Container - Matches StatusCard aspect ratio */}
      <div className="relative aspect-[9/14] w-full bg-gray-900 group cursor-pointer">
        <img 
          src="https://picsum.photos/seed/ad-card-native/400/622" 
          alt="Ad" 
          className="w-full h-full object-cover opacity-80" 
        />
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
          <div className="bg-primary/20 backdrop-blur-md p-1.5 rounded-full border border-white/30 animate-pulse">
            <PlayCircle className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
      
      {/* Ad Details Footer - Unified with StatusCard px/py and height */}
      <div className="flex items-center justify-between px-1.5 py-1 border-t border-gray-50 bg-primary/5 min-h-[28px]">
        <div className="flex items-center gap-1 overflow-hidden">
          <div className="bg-primary px-1 rounded-[2px] flex-shrink-0">
            <span className="text-[5px] font-black text-white">Ad</span>
          </div>
          <span className="text-[6px] font-black tracking-tight text-primary truncate">Promoted content</span>
        </div>
        <button className="p-0.5 text-primary hover:bg-primary/10 rounded-md active:scale-90 transition-all duration-200">
          <ExternalLink className="w-2.5 h-2.5" />
        </button>
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
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-500 overflow-hidden pt-safe">
      <div className="bg-black/40 border-b border-white/5">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black text-white/60 tracking-widest uppercase">Premium Partner</span>
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
                <span className="text-[10px] font-black tracking-tight uppercase">Close Ad</span>
                <X className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[320px] mx-auto space-y-8">
          <div className="relative aspect-[9/16] w-full max-h-[55vh] bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl group">
            <img src="https://picsum.photos/seed/inter-ad-main/600/1067" alt="Ad content" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
              <h2 className="text-xl font-black text-white tracking-tight leading-tight">Unlock Pro Experience</h2>
              <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase">No more ads, just status</p>
            </div>
          </div>
          
          <div className="space-y-4 px-2">
            <Button className="w-full h-14 rounded-2xl font-black tracking-tight text-[12px] bg-primary shadow-2xl shadow-primary/40 active:scale-95 transition-all">
              Remove All Ads Now
            </Button>
            <p className="text-[8px] text-center text-white/30 font-bold tracking-widest uppercase">Safe & Secure Payment</p>
          </div>
        </div>
      </div>
      <div className="pb-safe" />
    </div>
  );
}

/**
 * Hook for Rewarded Ads with full lifecycle simulation.
 */
export function useRewardedAd(onReward: () => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const showRewardedAd = useCallback(() => {
    if (isProcessing || isWatching) return;
    setIsProcessing(true);
    
    // Simulate AdMob SDK preparing the video
    setTimeout(() => {
      setIsProcessing(false);
      setIsWatching(true);
      setCountdown(AD_CONFIG.SETTINGS.REWARDED_COUNTDOWN_SEC);
      toast({ title: "Video ready", description: "Watch until end to receive your reward" });
    }, 1500); 
  }, [isProcessing, isWatching]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWatching && countdown > 0) {
      interval = setInterval(() => setCountdown(p => p - 1), 1000);
    } else if (isWatching && countdown === 0) {
      setIsWatching(false);
      onReward();
      toast({ 
        title: "Reward granted!", 
        description: "You've earned ad-free access time.", 
        variant: "success" 
      });
    }
    return () => clearInterval(interval);
  }, [isWatching, countdown, onReward]);

  return { showRewardedAd, isProcessing, isWatching, countdown };
}
