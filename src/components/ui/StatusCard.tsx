
"use client";

import Image from 'next/image';
import { Download, Play, CheckCircle2, Share2, Trash2, Clock, Sparkles, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Share } from '@capacitor/share';
import { useTranslation } from '@/hooks/use-translation';

export interface StatusCardProps {
  id: string;
  imageUrl: string;
  type: 'image' | 'video';
  mode: 'status' | 'saved';
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (media: { id: string; imageUrl: string; type: 'image' | 'video' }) => void;
}

export function StatusCard({ 
  id, 
  imageUrl, 
  type, 
  mode, 
  isSelectionMode, 
  isSelected, 
  onToggleSelect, 
  onDelete, 
  onView 
}: StatusCardProps) {
  const { t } = useTranslation();
  const [isSaved, setIsSaved] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const times = ["2m ago", "15m ago", "1h ago", "3h ago", "5h ago"];
    setTimeAgo(times[Math.floor(Math.random() * times.length)]);

    if (mode === 'saved') {
      setIsSaved(true);
    } else {
      const saved = JSON.parse(localStorage.getItem('saved_statuses') || '[]');
      setIsSaved(saved.some((item: any) => item.id === id));
    }
  }, [id, mode]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) return;

    setIsAnimating(true);
    
    try {
      const savedItems = JSON.parse(localStorage.getItem('saved_statuses') || '[]');
      if (!savedItems.find((item: any) => item.id === id)) {
        savedItems.push({ id, imageUrl, type });
        localStorage.setItem('saved_statuses', JSON.stringify(savedItems));
        setIsSaved(true);
        
        toast({ 
          title: "Status saved", 
          description: "Media captured to gallery", 
          variant: "success" 
        });

        // Smart trigger: Dispatch event to decide between Ad or Rate Us centrally in page.tsx
        window.dispatchEvent(new CustomEvent('request-interstitial'));
      }
    } catch (err) {
      toast({ title: "Save error", description: "Storage access failed", variant: "destructive" });
    }
    
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await Share.share({
        title: 'Status keeper share',
        text: 'Check out this amazing status!',
        url: imageUrl,
        dialogTitle: 'Share with friends',
      });
    } catch (err) {
      toast({ title: "Share failed", description: "Could not open sharing menu" });
    }
  };

  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelect?.(id);
    } else {
      onView?.({ id, imageUrl, type });
    }
  };

  return (
    <div className={cn(
      "relative flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 transition-all duration-300 h-full", 
      isAnimating ? "ring-2 ring-primary scale-95" : "hover:shadow-md",
      isSelected && "ring-2 ring-primary bg-primary/5"
    )}>
      {/* Media Image Layer */}
      <div onClick={handleClick} className="relative aspect-[9/14] w-full cursor-pointer overflow-hidden group bg-gray-900">
        <Image 
          src={imageUrl} 
          alt="Status" 
          fill 
          className={cn("object-cover transition-transform duration-700 group-hover:scale-105", isSelected && "opacity-70")} 
          sizes="(max-width: 480px) 33vw, 25vw" 
        />
        
        {isSelectionMode && (
          <div className="absolute top-1.5 right-1.5 z-10">
            {isSelected ? (
              <CheckCircle className="w-3.5 h-3.5 text-primary fill-white shadow-sm" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/50 bg-black/20" />
            )}
          </div>
        )}

        <div className="absolute top-1.5 left-1.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-lg border border-white/10 shadow-sm">
            {type === 'video' ? <Play className="w-2 h-2 text-white fill-white" /> : <Sparkles className="w-2 h-2 text-white/90" />}
          </div>
        </div>
        
        {isSaved && mode === 'status' && !isSelectionMode && (
          <div className="absolute top-1.5 right-1.5 bg-primary p-0.5 rounded-full shadow-lg border border-white/20">
            <CheckCircle2 className="w-2 h-2 text-white" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card Footer with Ellipsis logic for small screens */}
      <div className="flex items-center justify-between px-1.5 py-1 border-t border-gray-50 bg-primary/5 min-h-[28px]">
        <div className="flex items-center gap-1 overflow-hidden min-w-0 flex-1">
          <Clock className="w-2 h-2 text-primary/60 shrink-0" />
          <span className="text-[clamp(5px,1.5vw,7px)] font-black tracking-tight text-primary truncate block">{timeAgo}</span>
        </div>
        {!isSelectionMode && (
          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={handleShare} 
              className="p-0.5 text-primary hover:bg-primary/10 rounded-md active:scale-90 transition-all duration-200"
              title="Share status"
            >
              <Share2 className="w-2 h-2" />
            </button>
            {mode === 'status' ? (
              <button 
                onClick={handleSave} 
                disabled={isSaved} 
                className={cn(
                  "p-0.5 active:scale-90 transition-all rounded-md duration-200", 
                  isSaved ? "text-emerald-600 bg-emerald-50" : "text-primary hover:bg-primary/10"
                )}
                title="Download status"
              >
                <Download className="w-2 h-2" />
              </button>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete?.(id); }} 
                className="p-0.5 text-destructive hover:bg-destructive/10 rounded-md active:scale-90 transition-all duration-200"
                title="Delete status"
              >
                <Trash2 className="w-2 h-2" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
