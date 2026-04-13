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
 * Simulates a video ad placement with mute/unmute and progress tracking.
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
    <div className={cn("relative flex flex-col rounded-2xl overflow-hidden shadow-md bg-white border border-gray-100 transition-all duration-300 h-full group", className)}>
      {/* Sponsored Tag */}
      <div className="absolute top-2 left-2 z-20">
        <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 shadow-sm flex items-center gap-1">
          <span className="text-[7px] font-black text-white/90 uppercase tracking-widest">Sponsored</span>
        </div>
      </div>

      {/* Mute Toggle */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-2 right-2 z-20 bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white hover:bg-black/60 active:scale-90 transition-all"
      >
        {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
      </button>

      {/* Video Content Container */}
      <div className="relative aspect-[9/14] w-full bg-gray-900 overflow-hidden">
        <img 
          src="https://picsum.photos/seed/ad-video-bg/400/622" 
          alt="Ad Background" 
          className="w-full h-full object-cover opacity-60 scale-110 blur-[2px]" 
        />
        
        {/* Animated Play Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
          <div className="bg-primary/20 backdrop-blur-xl p-3 rounded-full border border-white/30 animate-pulse mb-3">
            <PlayCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-[8px] font-black text-white/80 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-1">Play Ad</span>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
      
      {/* Ad Details Footer */}
      <div className="p-2 space-y-2 bg-gray-50/50">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="bg-primary px-1.5 py-0.5 rounded-[4px] flex-shrink-0">
            <span className="text-[6px] font-black text-white">AD</span>
          </div>
          <div className="min-w-0">
            <p className="text-[8px] font-black tracking-tight text-gray-900 truncate">Status Saver Premium</p>
            <p className="text-[6px] font-bold text-gray-400 leading-none truncate">Get elite tools today</p>
          </div>
        </div>
        
        <Button variant="outline" className="w-full h-7 rounded-lg text-[8px] font-black uppercase tracking-wider border-primary/20 text-primary hover:bg-primary hover:text-white">
          Install Now <ExternalLink className="w-2 h-2 ml-1" />
        </Button>
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
