"use client";

import { useState, useEffect, useCallback } from 'react';
import { PlayCircle, X, ShieldCheck, ExternalLink, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * NativeVideoAd - Updated for high visual distinction to prevent policy violations.
 * Removed metadata and status-like buttons to avoid accidental clicks.
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
      "relative flex flex-col rounded-xl overflow-hidden shadow-none bg-slate-50 border-2 border-slate-200 transition-all duration-300 h-full", 
      className
    )}>
      {/* Distinct Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-primary px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
          <span className="text-[7px] font-black text-white uppercase tracking-tighter">Ad</span>
        </div>
      </div>

      <div className="relative aspect-[9/14] w-full bg-slate-200 group cursor-pointer overflow-hidden">
        <img 
          src="https://picsum.photos/seed/ad-card-v2/400/622" 
          alt="Advertisement" 
          className="w-full h-full object-cover opacity-90 grayscale-[20%]" 
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/5 transition-colors">
          <div className="bg-white/30 backdrop-blur-md p-2 rounded-full border border-white/40 animate-pulse">
            <PlayCircle className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* CTA Section - Distinct from status metadata */}
      <div className="flex flex-col gap-1 px-2 py-2 bg-white border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sponsored</span>
          <ExternalLink className="w-2.5 h-2.5 text-slate-300" />
        </div>
        <Button className="w-full h-7 rounded-lg text-[9px] font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all border-none">
          Learn more
        </Button>
      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-500 overflow-hidden pt-safe text-white">
      <div className="bg-black/40 border-b border-white/5">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black text-white/60 tracking-tight">Sponsored content</span>
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
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[320px] mx-auto space-y-6">
          <div className="relative aspect-[9/16] w-full max-h-[55vh] bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <img src="https://picsum.photos/seed/inter-ad-main/600/1067" alt="Ad content" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/40 to-transparent">
              <h2 className="text-base font-black text-white tracking-tight mb-0.5">{title}</h2>
              <p className="text-[9px] text-white/60 font-bold tracking-tight leading-none">{subtitle}</p>
            </div>
          </div>
          <div className="space-y-4 px-2">
            <Button className="w-full h-12 rounded-xl font-black tracking-tight text-[11px] bg-primary shadow-xl shadow-primary/40 active:scale-95 transition-all border-none">
              {buttonText}
            </Button>
            <p className="text-[8px] text-center text-white/20 font-bold tracking-tight">Remove ads in settings permanently</p>
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
      subtitle="Upgrade for ad-free experience"
      buttonText="Go ad-free now"
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
      setCountdown(10);
    }, 1800);
  }, [isProcessing, isWatching]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWatching && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWatching, countdown]);

  const completeReward = useCallback(() => {
    if (countdown === 0) {
      onReward();
    }
    setIsWatching(false);
  }, [countdown, onReward]);

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
      subtitle="Watch until the end to claim your reward"
      buttonText="Claim 24h premium"
    />
  );
}