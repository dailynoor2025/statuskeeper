"use client";

import { ShieldCheck, FolderOpen, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoIcon } from '@/components/layout/AppHeader';

interface PermissionViewProps {
  onGrant: () => void;
}

export function PermissionView({ onGrant }: PermissionViewProps) {
  return (
    <div className="flex flex-col h-full w-full bg-white animate-in slide-in-from-bottom-10 duration-700 overflow-hidden pt-safe">
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm flex flex-col items-center space-y-6 sm:space-y-8">
          <div className="relative">
            <div className="bg-primary/10 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-inner transition-all duration-500">
              <LogoIcon className="w-14 h-14 sm:w-20 sm:h-20" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-accent p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl border-4 border-white">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Access required</h2>
            <p className="text-gray-500 max-w-[280px] mx-auto leading-relaxed text-sm sm:text-base font-medium tracking-tight">
              To discover your latest WhatsApp statuses, we need your permission to access local media.
            </p>
          </div>

          <div className="w-full">
            <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm transition-all">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-black text-gray-800 tracking-tight truncate">Storage access</p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold tracking-tight truncate">Images & videos only</p>
              </div>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary ml-auto fill-primary/10 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-4 sm:space-y-5 bg-white border-t border-gray-50 pb-safe">
        <Button 
          onClick={onGrant}
          className="w-full h-14 sm:h-16 rounded-[1.25rem] sm:rounded-[1.5rem] text-base sm:text-lg font-black tracking-tight shadow-2xl shadow-primary/30 hover:scale-[0.98] active:scale-95 transition-all"
        >
          Grant permission
        </Button>
        
        <div className="flex flex-col items-center gap-1 opacity-60">
          <p className="text-[9px] sm:text-[10px] text-center text-gray-400 font-bold tracking-tight">
            Your privacy is protected
          </p>
          <div className="flex items-center gap-1 opacity-40">
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="text-[7px] sm:text-[8px] font-black">Local storage only</span>
          </div>
        </div>
      </div>
    </div>
  );
}