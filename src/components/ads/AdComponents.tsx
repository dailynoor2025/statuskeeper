"use client";

import { useState, useEffect } from 'react';
import { X, ShieldCheck, Trophy, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { AD_CONFIG } from '@/lib/ad-config';

/**
 * AdOverlayLayout - Full-screen immersive layout for Interstitial and Rewarded ads.
 * Covers the entire screen with object-cover media to match real AdMob behavior.
 */
function AdOverlayLayout({ 
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
  variant?: 'interstitial' | 'rewarded';
}) {
  if (!isOpen) return null;

  const isRewarded = variant === 'rewarded';

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-500 overflow-hidden text-white">
      {/* Background Media - Immersive Full Screen */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={`https://picsum.photos/seed/${isRewarded ? 'reward' : 'inter'}-v9/1080/1920`} 
          alt="Ad background" 
          fill 
          className="object-cover opacity-60"
          priority
          sizes="100vw"
          data-ai-hint="ad immersive background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
      </div>

      {/* Header Bar - Floats above background */}
      <div className="relative z-20 pt-safe bg-black/20 backdrop-blur-sm border-b border-white/5">
        <div className="p-4 flex justify-between items-center max-w-lg mx-auto w-full">
          <div className="flex items-center gap-1.5">
            {isRewarded ? (
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            )}
            <span className="text-[10px] font-black text-white/70 tracking-tight uppercase">
              {isRewarded ? 'Reward video' : 'Sponsored'}
            </span>
          </div>
          <button 
            disabled={disabledClose} 
            onClick={onClose} 
            className={cn(
              "h-9 px-5 rounded-full flex items-center gap-2 transition-all active:scale-95 border-none", 
              disabledClose 
                ? "bg-white/10 text-white/30" 
                : isRewarded 
                  ? "bg-amber-500 text-black shadow-lg" 
                  : "bg-primary text-white shadow-lg"
            )}
          >
            {disabledClose ? (
              <span className="text-[10px] font-black tracking-tight">Wait {timerLabel}</span>
            ) : (
              <>
                <span className="text-[10px] font-black tracking-tight">Skip ad</span>
                <X className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-12">
        <div className="max-w-sm w-full mx-auto space-y-6">
          <div className="space-y-2">
            {isRewarded && (
              <div className="inline-flex items-center gap-1.5 bg-amber-500 text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider mb-2 animate-bounce">
                <Sparkles className="w-3 h-3" />
                <span>Premium reward</span>
              </div>
            )}
            <h2 className={cn(
              "text-3xl font-black tracking-tighter leading-none drop-shadow-lg",
              isRewarded ? "text-amber-400" : "text-white"
            )}>
              {title}
            </h2>
            <p className="text-sm text-white/80 font-medium tracking-tight leading-relaxed line-clamp-3 drop-shadow-md">
              {subtitle}
            </p>
          </div>

          <div className="space-y-4">
            <Button className={cn(
              "w-full h-14 rounded-2xl font-black tracking-tight text-base active:scale-95 transition-all border-none shadow-2xl",
              isRewarded 
                ? "bg-amber-500 text-black hover:bg-amber-400" 
                : "bg-primary text-white hover:bg-primary/90"
            )}>
              {buttonText}
            </Button>
            <p className="text-[9px] text-center text-white/40 font-bold tracking-[0.2em] uppercase">
              {isRewarded ? "Watch until end to claim" : "Status keeper stable build"}
            </p>
          </div>
        </div>
      </div>

      <div className="pb-safe" />
    </div>
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

  if (!isOpen) return null;

  return (
    <AdOverlayLayout 
      isOpen={isOpen}
      onClose={onClose}
      disabledClose={timer > 0}
      timerLabel={`${timer}s`}
      title="Status keeper pro"
      subtitle="Remove all advertisements and enjoy an enhanced status saving experience today."
      buttonText="Upgrade now"
      variant="interstitial"
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
  if (!isOpen) return null;
  return (
    <AdOverlayLayout 
      isOpen={isOpen}
      onClose={onClose}
      disabledClose={countdown > 0}
      timerLabel={`${countdown}s`}
      title="Unlock elite access"
      subtitle="Complete this short video to unlock 24 hours of premium ad-free features instantly."
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
          data-ai-hint="sponsored content"
        />
        
        {/* Ad Label on Media Surface */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <div className="bg-white/90 backdrop-blur-md px-1.5 py-[1px] rounded-md shadow-sm border border-gray-100 flex items-center">
            <span className="text-[5px] font-black text-gray-900 tracking-tight uppercase">Ad</span>
          </div>
        </div>

        <div className="absolute bottom-1.5 left-1.5 right-1.5 z-10 flex items-center gap-1 opacity-80 pointer-events-none">
          <ShieldCheck className="w-2 h-2 text-white/70" />
          <span className="text-[clamp(5px,1.5vw,7px)] font-black text-white/70 truncate block tracking-wider">
            {mediaType === 'reels' ? 'Trending now' : 'Promoted content'}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      <div className="flex items-center justify-center px-1.5 py-1 bg-primary/5 border-t border-gray-50 min-h-[28px]">
        <button className="bg-primary text-white px-[clamp(8px,2vw,14px)] h-4 rounded-md text-[clamp(6px,1.5vw,8px)] font-black uppercase tracking-tighter active:scale-95 transition-all shrink-0 flex items-center justify-center leading-none">
          {mediaType === 'reels' ? 'Watch' : 'Install'}
        </button>
      </div>
    </div>
  );
}
