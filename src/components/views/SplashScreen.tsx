"use client";

import { LogoIcon } from "@/components/layout/AppHeader";

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-primary text-white animate-in fade-in duration-500 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 blur-[80px] rounded-full" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="bg-white/20 p-6 rounded-[2.5rem] mb-6 shadow-[0_15px_40px_rgba(0,0,0,0.1)] backdrop-blur-md animate-bounce">
          <LogoIcon className="w-14 h-14" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter mb-0.5 drop-shadow-md">Status keeper</h1>
        <p className="text-white/70 text-[10px] font-black tracking-[0.25em]">WhatsApp status saver</p>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[8px] tracking-widest opacity-60 font-black">Official stable build</p>
          <p className="text-[7px] tracking-tighter opacity-30 font-bold">© 2024 Status keeper team</p>
        </div>
      </div>
    </div>
  );
}
