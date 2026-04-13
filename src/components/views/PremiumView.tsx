"use client";

import { useState, useEffect } from 'react';
import { RefreshCcw, Gem, ShieldCheck, Zap, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRewardedAd, RewardedAdOverlay } from '@/components/ads/AdComponents';
import { cn } from '@/lib/utils';

interface PremiumViewProps {
  isPro: boolean;
  onProChange: (status: boolean) => void;
}

export function PremiumView({ isPro, onProChange }: PremiumViewProps) {
  const [adCount, setAdCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const GOAL = 3;

  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem('ad_progress_24h') || '0');
    setAdCount(savedCount);

    const updateTimer = () => {
      const expiry = localStorage.getItem('ad_free_expiry');
      if (expiry) {
        const remaining = parseInt(expiry) - Date.now();
        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}h ${mins}m ${secs}s`);
          onProChange(true);
        } else {
          setTimeLeft(null);
          onProChange(false);
          localStorage.removeItem('ad_free_expiry');
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [onProChange]);

  const activateAdFree = (hours: number) => {
    const currentExpiry = parseInt(localStorage.getItem('ad_free_expiry') || Date.now().toString());
    const newExpiry = Math.max(currentExpiry, Date.now()) + hours * 60 * 60 * 1000;
    localStorage.setItem('ad_free_expiry', newExpiry.toString());
    onProChange(true);
  };

  const { 
    showRewardedAd: show7hAd, 
    isProcessing: isProc7h, 
    isWatching: isWatching7h, 
    countdown: count7h,
    completeReward: complete7h
  } = useRewardedAd(() => activateAdFree(7));
  
  const { 
    showRewardedAd: show24hStepAd, 
    isProcessing: isProc24h, 
    isWatching: isWatching24h, 
    countdown: count24h,
    completeReward: complete24h
  } = useRewardedAd(() => {
    const nextCount = adCount + 1;
    if (nextCount >= GOAL) {
      setAdCount(0);
      localStorage.setItem('ad_progress_24h', '0');
      activateAdFree(24);
    } else {
      setAdCount(nextCount);
      localStorage.setItem('ad_progress_24h', nextCount.toString());
    }
  });

  return (
    <div className="px-3 py-3 space-y-3 w-full h-full overflow-y-auto no-scrollbar bg-gray-50/10">
      <div className="text-center space-y-0.5 animate-in fade-in duration-500">
        <h2 className="text-[clamp(10px,2.5vw,12px)] font-black text-gray-900 tracking-tight">Premium dashboard</h2>
        <p className="text-[clamp(8px,2vw,10px)] text-gray-400 font-bold tracking-tight">Ad-free access points</p>
      </div>

      {isPro && (
        <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-white/5 relative overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="absolute top-0 right-0 p-2 opacity-10"><Gem className="w-8 h-8" /></div>
          <div className="relative z-10 space-y-1.5">
            <Badge className="bg-primary text-white border-none px-1.5 py-0 text-[7px] font-black h-4">Pro active</Badge>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-white/80 tracking-tight">Unlimited status saving</p>
                <p className="text-[11px] font-black text-primary tabular-nums mt-0.5 tracking-tight">Ends in: {timeLeft}</p>
              </div>
              <Button 
                onClick={() => {
                  localStorage.removeItem('ad_free_expiry');
                  onProChange(false);
                }} 
                variant="ghost" 
                className="h-6 px-2 text-[8px] font-black text-red-400 border border-red-400/20 active:scale-95 transition-all"
              >
                End
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "bg-white border border-gray-100 rounded-xl p-3 space-y-2.5 transition-all duration-500",
        isPro ? "opacity-40 grayscale pointer-events-none scale-95" : "animate-staggered shadow-sm"
      )}>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg"><Zap className="w-4 h-4 text-primary" /></div>
          <div>
            <h3 className="font-black text-[clamp(10px,2.5vw,11px)] tracking-tight leading-none">Quick boost</h3>
            <p className="text-[clamp(8px,2vw,9px)] text-gray-400 font-bold tracking-tight">7 hours ad-free</p>
          </div>
        </div>
        
        <Button 
          onClick={show7hAd} 
          disabled={isProc7h || isWatching7h || isPro} 
          className="w-full h-10 rounded-lg font-black text-[10px] bg-primary shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          {isProc7h ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : "Watch video"}
        </Button>
      </div>

      <div className={cn(
        "bg-primary text-white rounded-xl p-3 space-y-3 transition-all duration-500 relative overflow-hidden",
        isPro ? "opacity-40 grayscale pointer-events-none scale-95" : "animate-staggered shadow-xl"
      )}>
        <div className="absolute -right-4 -top-4 opacity-10 rotate-12"><Star className="w-16 h-16" /></div>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md"><Gem className="w-4 h-4 text-white" /></div>
          <div>
            <h3 className="font-black text-[clamp(10px,2.5vw,11px)] tracking-tight text-white leading-none">Elite access</h3>
            <p className="text-[clamp(8px,2vw,9px)] text-white/70 font-bold tracking-tight">24 hours ad-free</p>
          </div>
        </div>
        
        <div className="space-y-1 relative z-10">
          <div className="flex justify-between text-[8px] font-black opacity-80">
            <span>Mission progress</span>
            <span>{adCount}/{GOAL}</span>
          </div>
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-out" 
              style={{ width: `${(adCount / GOAL) * 100}%` }} 
            />
          </div>
        </div>

        <Button 
          onClick={show24hStepAd} 
          disabled={isProc24h || isWatching24h || isPro} 
          className="w-full h-10 rounded-lg font-black text-[10px] bg-white text-primary hover:bg-white/90 active:scale-95 shadow-2xl transition-all"
        >
          {isProc24h ? (
            <RefreshCcw className="w-4 h-4 animate-spin" />
          ) : "Next step"}
        </Button>
      </div>

      <div className="p-4 text-center space-y-1 opacity-20">
        <div className="flex items-center justify-center gap-1.5 text-gray-400 font-black tracking-tight text-[8px]">
          <ShieldCheck className="w-3 h-3" />
          <span>Secured Status keeper network</span>
        </div>
      </div>

      <RewardedAdOverlay isOpen={isWatching7h} countdown={count7h} onClose={complete7h} />
      <RewardedAdOverlay isOpen={isWatching24h} countdown={count24h} onClose={complete24h} />
    </div>
  );
}