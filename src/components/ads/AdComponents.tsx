"use client";

import { useState, useEffect, useCallback } from 'react';
import { PlayCircle, X, ShieldCheck, ExternalLink, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAds } from '@/hooks/use-ads';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { AD_CONFIG } from '@/lib/ad-config';

/**
 * Native Video Ad Component - Perfectly synchronized with StatusCard dimensions.
 */
export function NativeVideoAd({ className }: { className?: string }) {
  const { isPro } = useAds();
  const [adStatus, setAdStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPro) return;
    const loadAd = async () => {
      try {
        setAdStatus('loading');
        await new Promise(resolve => setTimeout(resolve, 1200));
        setAdStatus('ready');
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
      <div className="absolute top-1.5 left-1.5 z-20">
        <div className="bg-black/40 backdrop-blur-md px-1 py-0.5 rounded-lg border border-white/10 shadow-sm flex items-center gap-1">
          <span className="text-[6px] font-black text-white uppercase tracking-wider">Sponsored</span>
        </div>
      </div>

      <div className="relative aspect-[9/14] w-full bg-gray-900 group cursor-pointer overflow-hidden">
        <img 
          src="https://picsum.photos/seed/ad-card-native/400/622" 
          alt="Ad" 
          className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
          <div className="bg-primary/20 backdrop-blur-md p-1.5 rounded-full border border-white/30 animate-pulse">
            <PlayCircle className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      
      <div className="flex items-center justify-between px-1.5 py-1 border-t border-gray-50 bg-primary/5 min-h-[28px]">
        <div className="flex items-center gap-1 overflow-hidden">
          <Clock className="w-2.5 h-2.5 text-primary/60" />
          <span className="text-[6px] font-black tracking-tight text-primary truncate">Promoted content</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-0.5 text-primary hover:bg-primary/10 rounded-md active:scale-90 transition-all duration-200">
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Shared Ad Overlay Layout for consistent sizing between Interstitial and Rewarded ads.
 */
function AdOverlayLayout({ 
  isOpen, 
  title, 
  subtitle, 
  buttonText, 
  onClose, 
  disabledClose, 
  timerLabel 
}: { 
  isOpen: boolean; 
  title: string; 
  subtitle: string; 
  buttonText: string; 
  onClose: () => void; 
  disabledClose?: boolean; 
  timerLabel?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-500 overflow-hidden pt-safe">
      <div className="bg-black/40 border-b border-white/5">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black text-white/60 tracking-widest uppercase">Premium partner</span>
          </div>
          <button 
            disabled={disabledClose} 
            onClick={onClose} 
            className={cn(
              "h-9 px-5 rounded-full flex items-center gap-2 transition-all active:scale-95", 
              disabledClose ? "bg-white/10 text-white/30" : "bg-primary text-white shadow-lg shadow-primary/30"
            )}
          >
            {disabledClose ? (
              <span className="text-[10px] font-black tracking-tight">{timerLabel}</span>
            ) : (
              <>
                <span className="text-[10px] font-black tracking-tight uppercase">Close ad</span>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
              <h2 className="text-xl font-black text-white tracking-tight leading-tight">{title}</h2>
              <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase">{subtitle}</p>
            </div>
          </div>
          <div className="space-y-4 px-2">
            <Button className="w-full h-14 rounded-2xl font-black tracking-tight text-[12px] bg-primary shadow-2xl shadow-primary/40 active:scale-95 transition-all">
              {buttonText}
            </Button>
            <p className="text-[8px] text-center text-white/30 font-bold tracking-widest uppercase">Safe & secure network</p>
          </div>
        </div>
      </div>
      <div className="pb-safe" />
    </div>
  );
}

export function InterstitialAd({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isPro } = useAds();
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (isOpen) {
      setTimer(5);
      const interval = setInterval(() => {
        setTimer(t => (t <= 1 ? (clearInterval(interval), 0) : t - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (isPro) return null;

  return (
    <AdOverlayLayout 
      isOpen={isOpen}
      onClose={onClose}
      disabledClose={timer > 0}
      timerLabel={`Wait ${timer}s`}
      title="Unlock pro experience"
      subtitle="No more ads, just status"
      buttonText="Remove all ads now"
    />
  );
}

export function RewardedAdOverlay({ 
  isOpen, 
  countdown, 
  onClose 
}: { 
  isOpen: boolean; 
  countdown: number; 
  onClose: () => void 
}) {
  return (
    <AdOverlayLayout 
      isOpen={isOpen}
      onClose={onClose}
      disabledClose={countdown > 0}
      timerLabel={`Reward in ${countdown}s`}
      title="Elite reward active"
      subtitle="Watch to unlock premium"
      buttonText="Claim your reward"
    />
  );
}

export function useRewardedAd(onReward: () => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const showRewardedAd = useCallback(() => {
    if (isProcessing || isWatching) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsWatching(true);
      setCountdown(AD_CONFIG.SETTINGS.REWARDED_COUNTDOWN_SEC);
      toast({ title: "Video ready", description: "Watch until end to receive reward" });
    }, 1500); 
  }, [isProcessing, isWatching]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWatching && countdown > 0) {
      interval = setInterval(() => setCountdown(p => p - 1), 1000);
    } else if (isWatching && countdown === 0) {
      // Auto-complete or wait for user to close? 
      // For this MVP, we'll auto-complete after a small delay once closed or auto
    }
    return () => clearInterval(interval);
  }, [isWatching, countdown]);

  const completeReward = useCallback(() => {
    setIsWatching(false);
    onReward();
    toast({ title: "Reward granted!", description: "Ad-free access updated.", variant: "success" });
  }, [onReward]);

  return { showRewardedAd, isProcessing, isWatching, countdown, completeReward };
}