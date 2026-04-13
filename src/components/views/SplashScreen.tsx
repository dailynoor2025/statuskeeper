"use client";

const LogoIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
      <path d="M12 2C6.477 2 2 6.477 2 12C2 13.891 2.525 15.66 3.438 17.168L2 22L7.023 20.692C8.523 21.523 10.223 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor"/>
      <path d="M12 7V14M12 14L9 11M12 14L15 11" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--primary))' }} />
      <path d="M8 17H16" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--primary))' }} />
    </svg>
  </div>
);

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