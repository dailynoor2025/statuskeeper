"use client";

import { Smartphone, Download, Crown, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'status' | 'saved' | 'premium' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems: { label: string; id: TabType; icon: any }[] = [
  { label: 'Status', id: 'status', icon: Smartphone },
  { label: 'Saved', id: 'saved', icon: Download },
  { label: 'Premium', id: 'premium', icon: Crown },
  { label: 'Settings', id: 'settings', icon: Settings },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-gray-100 h-16 flex items-center justify-around px-2 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.06)] w-full overflow-hidden">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 w-full h-full transition-all duration-300 outline-none border-none bg-transparent relative group active:scale-90",
              isActive ? "text-primary" : "text-gray-400"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              isActive ? "bg-primary/10 shadow-sm" : "group-hover:bg-gray-50"
            )}>
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300",
                isActive ? "fill-primary/20 scale-110" : "scale-100"
              )} />
            </div>
            <span className={cn(
              "text-[8px] font-black tracking-wider transition-all duration-300",
              isActive ? "opacity-100 translate-y-0" : "opacity-40 translate-y-0.5"
            )}>
              {item.label}
            </span>
            
            {isActive && (
              <div className="absolute top-0 w-6 h-1 bg-primary rounded-full shadow-[0_0_12px_rgba(37,211,102,0.6)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
