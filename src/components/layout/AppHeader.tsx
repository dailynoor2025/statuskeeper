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

interface AppHeaderProps {
  isPro?: boolean;
  onHelpClick?: () => void;
}

/**
 * AppHeader - Minimalist header. 
 * Logo removed as per user request.
 */
export function AppHeader({ isPro, onHelpClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 pt-safe w-full flex-shrink-0 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between h-14 w-full">
        <div className="flex items-center gap-2">
          {/* Logo removed as per user request for minimal look */}
          <h1 className="text-[clamp(12px,3vw,14px)] font-black tracking-tight text-gray-900">
            Status <span className="text-primary">keeper</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-1">
          {isPro && (
            <Badge className="bg-primary/10 text-primary border-none px-2 py-0.5 text-[8px] font-black flex items-center gap-1 mr-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              Pro
            </Badge>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-gray-400">
                <MoreVertical className="w-4 h-4" />
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
