"use client";

import { useState, useEffect } from 'react';
import { X, ShieldCheck, Trophy, Sparkles, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { AD_CONFIG } from '@/lib/ad-config';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

/**
 * AdOverlay - Immersive full-screen ad presentation for Stable Build.
 * Optimized with object-cover and minimalist controls (no backgrounds).
 */
function AdOverlay({ 
  isOpen, 
  title, 
  subtitle, 
  buttonText, 
  onClose, 
  disabledClose, 
  timerLabel,
  variant = 'interstitial'
}: { 
  isOpen: boolean; 
  title: string; 
  subtitle: string; 
  buttonText: string; 
  onClose: () => void; 
  disabledClose?: boolean; 
  timerLabel?: string;
  variant?: 'interstitial' | 'rewarded' | 'app-open';
}) {
  const isRewarded = variant === 'rewarded';
  const isAppOpen = variant === 'app-open';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !disabledClose && onClose()}>
      <DialogContent className="fixed inset-0 z-[1200] w-screen h-[100dvh] max-w-none m-0 p-0 border-none bg-black rounded-none shadow-none flex flex-col outline-none overflow-hidden translate-x-0 translate-y-0 left-0 top-0">
        <DialogTitle>
          <VisuallyHidden>{title}</VisuallyHidden>
        </DialogTitle>
        
        {/* Full-Screen Immersive Media */}
        <div className="absolute inset-0 z-0 bg-black">
          <Image 
            src={`https://picsum.photos/seed/${variant}-stable-v2/1080/1920`} 
            alt="Ad media" 
            fill 
            className="object-cover animate-in fade-in duration-700"
            priority
            sizes="100vw"
            data-ai-hint="full screen video"
          />
          {/* Subtle gradient for overlay text clarity */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>

        {/* Minimalist Top Bar - No backgrounds on buttons */}
        <div className="relative z-20 pt-safe w-full">
          <div className="p-4 flex justify-between items-center w-full">
            <div className="flex items-center gap-1.5 drop-shadow-md">
              {isRewarded ? (
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
              ) : isAppOpen ? (
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-primary/80" />
              )}
              <span className="text-[7px] font-black text-white/90 tracking-[0.2em] uppercase">
                {isRewarded ? 'Premium reward' : isAppOpen ? 'Welcome' : 'Sponsored'}
              </span>
            </div>
            
            <button 
              disabled={disabledClose} 
              onClick={onClose} 
              className={cn(
                "w-8 h-8 flex items-center justify-center transition-all active:scale-75 border-none outline-none bg-transparent drop-shadow-lg", 
                disabledClose ? "opacity-50" : "text-white/80 hover:text-white"
              )}
            >
              {disabledClose ? (
                <span className="text-[9px] font-black tracking-tighter tabular-nums text-white">{timerLabel}</span>
              ) : (
                <X className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Minimalist Bottom Actions */}
        <div className="relative z-10 flex-1 flex flex-col justify-end p-6 pb-12 w-full max-w-[300px] mx-auto">
          <div className="space-y-4">
            <div className="space-y-0.5">
              {(isRewarded || isAppOpen) && (
                <div className="inline-flex items-center gap-1 text-amber-400 text-[6px] font-black uppercase tracking-[0.3em] mb-1 drop-shadow-md">
                  <Sparkles className="w-2 h-2" />
                  <span>Elite access bonus</span>
                </div>
              )}
              <h2 className={cn(
                "text-base font-black tracking-tight leading-none drop-shadow-lg",
                isRewarded || isAppOpen ? "text-amber-400" : "text-white"
              )}>
                {title}
              </h2>
              <p className="text-[8px] text-white/70 font-bold tracking-tight leading-tight line-clamp-2 mt-1 drop-shadow-md">
                {subtitle}
              </p>
            </div>

            <div className="space-y-3">
              <Button className={cn(
                "w-full h-11 rounded-2xl font-black tracking-tight text-[10px] uppercase active:scale-95 transition-all border-none shadow-2xl",
                isRewarded || isAppOpen
                  ? "bg-amber-500 text-black hover:bg-amber-400" 
                  : "bg-primary text-white hover:bg-primary/90"
              )}>
                {buttonText}
              </Button>
              
              <div className="flex flex-col items-center opacity-30">
                <span className="text-[5px] font-black text-white uppercase tracking-[0.5em]">
                  Secure stable architecture
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function InterstitialAd({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

  return (
    <AdOverlay 
      isOpen={isOpen}
      onClose={onClose}
      disabledClose={timer > 0}
      timerLabel={`${timer}s`}
      title="Unlock instant access"
      subtitle="Remove all interruptions and enjoy seamless status saving forever."
      buttonText="Go premium"
      variant="interstitial"
    />
  );
}

export function AppOpenAd({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    if (isOpen) {
      setTimer(3);
      const interval = setInterval(() => {
        setTimer(t => (t <= 1 ? (clearInterval(interval), 0) : t - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AdOverlay 
      isOpen={isOpen}
      onClose={onClose}
      disabledClose={timer > 0}
      timerLabel={`${timer}s`}
      title="Status peeker"
      subtitle="Your favorites are ready. Start browsing and saving media instantly."
      buttonText="Start exploring"
      variant="app-open"
    />
  );
}

export function useRewardedAd(onReward: () => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const showRewardedAd = () => {
    if (isProcessing || isWatching) return;
    setIsProcessing(true);
    // Fast processing simulation for Tier 1 users
    setTimeout(() => {
      setIsProcessing(false);
      setIsWatching(true);
      setCountdown(AD_CONFIG.SETTINGS.REWARDED_COUNTDOWN_SEC);
    }, 1200);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWatching && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWatching, countdown]);

  const completeReward = () => {
    if (countdown === 0) {
      onReward();
    }
    setIsWatching(false);
  };

  return { showRewardedAd, isProcessing, isWatching, countdown, completeReward };
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
    <AdOverlay 
      isOpen={isOpen}
      onClose={onClose}
      disabledClose={countdown > 0}
      timerLabel={`${countdown}s`}
      title="Premium bonus unlocked"
      subtitle="Complete this video to activate your 24-hour elite ad-free pass."
      buttonText="Claim 24h pro"
      variant="rewarded"
    />
  );
}

export function NativeVideoAd({ className }: { className?: string }) {
  const [adStatus, setAdStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const loadAd = async () => {
      try {
        setAdStatus('loading');
        await new Promise(resolve => setTimeout(resolve, 800));
        setAdStatus('ready');
      } catch (e) {
        setAdStatus('error');
      }
    };
    loadAd();
  }, []);

  if (adStatus === 'error' || adStatus === 'loading') return null;

  return (
    <div className={cn(
      "relative flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 transition-all duration-300 h-full", 
      className
    )}>
      <div className="relative aspect-[9/14] w-full bg-gray-900 overflow-hidden group cursor-pointer">
        <Image 
          src={`https://picsum.photos/seed/native-pro-v1/400/622`} 
          alt="Ad" 
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 480px) 33vw, 25vw"
        />
        
        <div className="absolute top-1 left-1 z-10">
          <div className="bg-white/90 backdrop-blur-md px-1 py-[0.5px] rounded-[3px] shadow-sm border border-gray-100">
            <span className="text-[5px] font-black text-gray-900 uppercase">Ad</span>
          </div>
        </div>

        <div className="absolute bottom-1 left-1 z-10">
          <div className="bg-black/30 backdrop-blur-sm px-1.5 py-[1px] rounded-[4px] border border-white/10">
            <span className="text-[6px] font-black text-white/80 tracking-tight uppercase">Featured</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-1 py-1 bg-primary/5 border-t border-gray-50 min-h-[24px]">
        <button className="bg-primary text-white w-full h-4 rounded-lg text-[6px] font-black uppercase tracking-tight active:scale-95 transition-all">
          Install
        </button>
      </div>
    </div>
  );
}