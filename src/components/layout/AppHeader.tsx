"use client";

import { MoreVertical, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

export const LogoIcon = ({ className }: { className?: string }) => (
  <div className={cn("relative", className)}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary">
      <path d="M12 2C6.477 2 2 6.477 2 12C2 13.891 2.525 15.66 3.438 17.168L2 22L7.023 20.692C8.523 21.523 10.223 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor"/>
      <path d="M12 7V14M12 14L9 11M12 14L15 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 17H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

interface AppHeaderProps {
  isPro?: boolean;
  onHelpClick?: () => void;
}

/**
 * AppHeader - Minimalist header with restored brand logo and smaller icons.
 */
export function AppHeader({ isPro, onHelpClick }: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 pt-safe w-full flex-shrink-0 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between h-14 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-xl shadow-inner">
            <LogoIcon className="w-4 h-4" />
          </div>
          <h1 className="text-[clamp(12px,3vw,14px)] font-black tracking-tight text-gray-900">
            {t.app_name.split(' ')[0]} <span className="text-primary">{t.app_name.split(' ')[1]}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-1">
          {isPro && (
            <Badge className="bg-primary/10 text-primary border-none px-2 py-0.5 text-[8px] font-black flex items-center gap-1 mr-1">
              <ShieldCheck className="w-2 h-2" />
              Pro
            </Badge>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-gray-400">
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-2xl border-none glass-morphism">
              <DropdownMenuItem className="rounded-xl text-[10px] font-bold py-2" asChild>
                <a href="https://sites.google.com/view/qhaleel-latest-apps/home" target="_blank" rel="noopener noreferrer">
                  Latest apps
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl text-[10px] font-bold py-2" asChild>
                <a href="https://sites.google.com/view/status-peeker-privacy-policy-/home" target="_blank" rel="noopener noreferrer">
                  Privacy policy
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl text-[10px] font-bold py-2" asChild>
                <a href="https://sites.google.com/view/status-peeker-terms-conditions/home" target="_blank" rel="noopener noreferrer">
                  Terms & conditions
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100 mx-1 my-1" />
              <DropdownMenuItem 
                className="rounded-xl text-[10px] font-bold py-2"
                onClick={onHelpClick}
              >
                Help & support
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
