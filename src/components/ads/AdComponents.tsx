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
 * z-index set to 1200+ to ensure it covers Header and Bottom Nav.
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
      <DialogContent className="fixed inset-0 z-[1500] w-screen h-[100dvh] max-w-none m-0 p-0 border-none bg-black rounded-none shadow-none flex flex-col outline-none overflow-hidden translate-x-0 translate-y-0 left-0 top-0">
        <DialogTitle>
          <VisuallyHidden>{title}</VisuallyHidden>
        </DialogTitle>
        
        {/* Full-Screen Immersive Media with Resize Logic */}
        <div className="absolute inset-0 z-0 bg-black">
          <Image 
            src={`https://picsum.photos/seed/${variant}-stable-v5/1080/1920`} 
            alt="Ad media" 
            fill 
            className="object-cover animate-in fade-in duration-1000"
            priority
            sizes="100vw"
            data-ai-hint="full screen video"
          />
          {/* Heavy gradient for text clarity on top of video */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
        </div>

        {/* Minimalist Top Bar - No backgrounds as requested */}
        <div className="relative z-20 pt-safe w-full">
          <div className="p-5 flex justify-between items-center w-full">
            <div className="flex items-center gap-2 drop-shadow-lg">
              {isRewarded ? (
                <Trophy className="w-4 h-4 text-amber-400" />
              ) : isAppOpen ? (
                <Sparkles className="w-4 h-4 text-primary" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-primary/90" />
              )}
              <span className="text-[8px] font-black text-white/90 tracking-[0.25em] uppercase">
                {isRewarded ? 'Premium reward' : isAppOpen ? 'Welcome' : 'Sponsored'}
              </span>
            </div>
            
            <button 
              disabled={disabledClose} 
              onClick={onClose} 
              className={cn(
                "w-10 h-10 flex items-center justify-center transition-all active:scale-75 border-none outline-none bg-transparent drop-shadow-2xl", 
                disabledClose ? "opacity-40" : "text-white hover:text-primary"
              )}
            >
              {disabledClose ? (
                <span className="text-[10px] font-black tracking-tighter tabular-nums text-white">{timerLabel}</span>
              ) : (
                <X className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Immersive Bottom Actions */}
        <div className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-16 w-full max-w-[340px] mx-auto">
          <div className="space-y-5">
            <div className="space-y-1">
              {(isRewarded || isAppOpen) && (
                <div className="inline-flex items-center gap-1.5 text-amber-400 text-[7px] font-black uppercase tracking-[0.3em] mb-1 drop-shadow-md">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Elite access bonus</span>
                </div>
              )}
              <h2 className={cn(
                "text-xl font-black tracking-tight leading-none drop-shadow-2xl",
                isRewarded || isAppOpen ? "text-amber-400" : "text-white"
              )}>
                {title}
              </h2>
              <p className="text-[10px] text-white/80 font-bold tracking-tight leading-relaxed line-clamp-2 mt-2 drop-shadow-lg">
                {subtitle}
              </p>
            </div>

            <div className="space-y-4">
              <Button className={cn(
                "w-full h-14 rounded-[1.25rem] font-black tracking-widest text-[11px] uppercase active:scale-95 transition-all border-none shadow-2xl",
                isRewarded || isAppOpen
                  ? "bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20" 
                  : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
              )}>
                {buttonText}
              </Button>
              
              <div className="flex flex-col items-center opacity-20">
                <span className="text-[6px] font-black text-white uppercase tracking-[0.6em]">
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

/**
 * NativeVideoAd - Optimized for grid presentation with high-quality badge.
 */
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
      <div className="relative aspect-[9/14] w-full bg-slate-900 overflow-hidden group cursor-pointer">
        <Image 
          src={`https://picsum.photos/seed/native-v7/400/622`} 
          alt="Ad" 
          fill
          className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 480px) 33vw, 25vw"
        />
        
        {/* Redesigned Ad Badge - Premium Primary Style */}
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-primary px-1.5 py-0.5 rounded-[4px] shadow-lg border border-primary/20 flex items-center">
            <span className="text-[6px] font-black text-white uppercase tracking-tighter">Ad</span>
          </div>
        </div>

        {/* Featured Overlay Label */}
        <div className="absolute bottom-2 left-2 z-10">
          <div className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            <span className="text-[7px] font-black text-white/90 tracking-widest uppercase">Promoted</span>
          </div>
        </div>
        
        {/* Hover interaction */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex items-center justify-center p-1.5 bg-primary/5 border-t border-gray-50 min-h-[32px]">
        <button className="bg-primary text-white w-full h-6 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all hover:bg-primary/90">
          Learn more
        </button>
      </div>
    </div>
  );
}
