"use client";

import { useState, useEffect } from 'react';
import { X, ShieldCheck, Trophy, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { AD_CONFIG } from '@/lib/ad-config';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

/**
 * AdOverlay - Immersive full-screen ad presentation.
 * Optimized with true full-screen video resize logics using object-cover.
 * Icons are transparent (no background) to maximize immersion.
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
      <DialogContent className="fixed inset-0 z-[1100] w-screen h-[100dvh] max-w-none m-0 p-0 border-none bg-black rounded-none shadow-none flex flex-col outline-none overflow-hidden translate-x-0 translate-y-0 left-0 top-0">
        <DialogTitle>
          <VisuallyHidden>{title}</VisuallyHidden>
        </DialogTitle>
        
        {/* Immersive Video/Media Background - Fills screen perfectly */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={`https://picsum.photos/seed/${variant}-video/1080/1920`} 
            alt="Ad media" 
            fill 
            className="object-cover"
            priority
            sizes="100vw"
            data-ai-hint="video ad"
          />
          {/* Dark overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
        </div>

        {/* Top Header - No background, minimal icons */}
        <div className="relative z-20 pt-safe w-full">
          <div className="p-4 flex justify-between items-center w-full">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10">
              {isRewarded ? (
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
              ) : isAppOpen ? (
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              )}
              <span className="text-[10px] font-black text-white tracking-tight uppercase">
                {isRewarded ? 'Premium reward' : isAppOpen ? 'Welcome gift' : 'Sponsored'}
              </span>
            </div>
            
            <button 
              disabled={disabledClose} 
              onClick={onClose} 
              className={cn(
                "h-8 px-4 rounded-full flex items-center gap-2 transition-all active:scale-90 border-none", 
                disabledClose 
                  ? "text-white/40" 
                  : "text-white hover:text-white/80"
              )}
            >
              {disabledClose ? (
                <span className="text-[10px] font-black tracking-tight tabular-nums">{timerLabel}</span>
              ) : (
                <X className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Content Area - Minimalist layout floating over media */}
        <div className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-16 w-full max-w-lg mx-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              {(isRewarded || isAppOpen) && (
                <div className="inline-flex items-center gap-1.5 text-amber-400 py-1 text-[9px] font-black uppercase tracking-[0.2em] drop-shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>Unlock pro features</span>
                </div>
              )}
              <h2 className={cn(
                "text-3xl sm:text-4xl font-black tracking-tighter leading-none drop-shadow-2xl",
                isRewarded || isAppOpen ? "text-amber-400" : "text-white"
              )}>
                {title}
              </h2>
              <p className="text-[clamp(11px,2.5vw,13px)] text-white/80 font-medium tracking-tight leading-relaxed line-clamp-2 drop-shadow-xl">
                {subtitle}
              </p>
            </div>

            <div className="space-y-4">
              <Button className={cn(
                "w-full h-14 rounded-2xl font-black tracking-tight text-sm active:scale-95 transition-all border-none shadow-2xl",
                isRewarded || isAppOpen
                  ? "bg-amber-500 text-black hover:bg-amber-400" 
                  : "bg-primary text-white hover:bg-primary/90"
              )}>
                {buttonText}
              </Button>
              
              <div className="flex flex-col items-center gap-1.5 opacity-40">
                <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">
                  {isRewarded ? "Watch until end to claim" : "Status keeper stable build"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-safe" />
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
      title="Go premium today"
      subtitle="Remove all ads and get instant status saves. Support our stable build development."
      buttonText="Learn more"
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
      title="Quick start"
      subtitle="Unlock pro features for this session and enjoy ad-free status saving."
      buttonText="Get started"
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
    // Simulate loading/buffering
    setTimeout(() => {
      setIsProcessing(false);
      setIsWatching(true);
      setCountdown(AD_CONFIG.SETTINGS.REWARDED_COUNTDOWN_SEC);
    }, 1800);
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
      title="Elite access"
      subtitle="Watch this short video to unlock 24 hours of premium ad-free features instantly."
      buttonText="Claim reward"
      variant="rewarded"
    />
  );
}

export function NativeVideoAd({ className }: { className?: string }) {
  const [adStatus, setAdStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'reels'>('image');

  useEffect(() => {
    const loadAd = async () => {
      try {
        setAdStatus('loading');
        await new Promise(resolve => setTimeout(resolve, 1200));
        const types: ('image' | 'video' | 'reels')[] = ['image', 'video', 'reels'];
        setMediaType(types[Math.floor(Math.random() * types.length)]);
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
      "relative flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 transition-all duration-300 h-full hover:shadow-md", 
      className
    )}>
      <div className="relative aspect-[9/14] w-full bg-gray-900 overflow-hidden group cursor-pointer">
        <Image 
          src={`https://picsum.photos/seed/ad-${mediaType}/400/622`} 
          alt="Promoted content" 
          fill
          className={cn(
            "object-cover transition-opacity duration-500",
            mediaType === 'image' ? "opacity-90" : "opacity-70"
          )}
          sizes="(max-width: 480px) 33vw, 25vw"
        />
        
        {/* Ad Label Overlay - Integrated on media as requested */}
        <div className="absolute bottom-1.5 left-1.5 z-10">
          <div className="bg-black/40 backdrop-blur-md px-1.5 py-[1px] rounded-md shadow-sm border border-white/10 flex items-center">
            <span className="text-[clamp(5px,1.5vw,7px)] font-black text-white/90 tracking-tight uppercase">
              Promoted content
            </span>
          </div>
        </div>

        {/* Small Ad Badge at Top */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <div className="bg-white/90 backdrop-blur-md px-1.5 py-[1px] rounded-md shadow-sm border border-gray-100 flex items-center">
            <span className="text-[5px] font-black text-gray-900 tracking-tight">Ad</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Card Footer with Tiny CTA with Resize Logic */}
      <div className="flex items-center justify-center px-1.5 py-1 bg-primary/5 border-t border-gray-50 min-h-[28px]">
        <button className="bg-primary text-white w-full h-4 rounded-md text-[clamp(6px,1.5vw,8px)] font-black uppercase tracking-tight active:scale-95 transition-all flex items-center justify-center leading-none">
          {mediaType === 'reels' ? 'Watch' : 'Install'}
        </button>
      </div>
    </div>
  );
}
