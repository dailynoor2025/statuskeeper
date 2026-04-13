"use client";

import { WifiOff, RefreshCcw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NoInternetView() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <div className="pt-safe" />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative mb-8">
          <div className="bg-red-50 p-10 rounded-[3rem] shadow-inner">
            <WifiOff className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-red-600 p-3 rounded-2xl shadow-xl border-4 border-white">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">No connection</h2>
          <p className="text-gray-500 max-w-[260px] mx-auto text-sm font-medium leading-relaxed">
            Please check your data connection or Wi-Fi to continue using Status keeper.
          </p>
        </div>

        <Button 
          onClick={handleRetry}
          className="w-full h-16 rounded-[1.5rem] bg-gray-900 text-white font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <RefreshCcw className="w-5 h-5" />
          Retry connection
        </Button>
      </div>

      <div className="pb-safe p-6 flex flex-col items-center gap-1 opacity-20">
        <span className="text-[10px] font-black uppercase tracking-widest">Stable build offline protection</span>
      </div>
    </div>
  );
}
