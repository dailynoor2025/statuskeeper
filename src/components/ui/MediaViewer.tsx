"use client";

import { X, Download, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Share } from '@capacitor/share';
import { toast } from '@/hooks/use-toast';

/**
 * MediaViewer - Now optimized to fill the entire screen interface.
 * Implements intelligent resize logic using object-contain.
 * Buttons are sized perfectly for high-end mobile UX.
 */

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  media: {
    id: string;
    imageUrl: string;
    type: 'image' | 'video';
  } | null;
  mode: 'status' | 'saved';
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export function MediaViewer({ isOpen, onClose, media, mode, onDelete, onDownload }: MediaViewerProps) {
  if (!media) return null;

  const handleClose = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('request-interstitial'));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Status Keeper Share',
        text: 'Look at this amazing status!',
        url: media.imageUrl,
        dialogTitle: 'Share with friends',
      });
    } catch (err) {
      toast({ title: "Share failed", description: "Could not open sharing menu" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-none w-screen h-screen p-0 bg-black border-none flex flex-col items-center justify-center z-[100] outline-none overflow-hidden rounded-none shadow-none">
        <DialogTitle>
          <VisuallyHidden>Media viewer - {media.id}</VisuallyHidden>
        </DialogTitle>
        
        {/* Action Bar - Minimalist and accessible */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-[110] bg-gradient-to-b from-black/80 to-transparent pt-safe">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose} 
            className="text-white hover:bg-white/20 rounded-full transition-transform active:scale-90"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              className="text-white hover:bg-white/20 rounded-full transition-transform active:scale-90"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            {mode === 'status' ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDownload?.(media.id)}
                className="text-white hover:bg-primary/80 rounded-full transition-transform active:scale-90"
              >
                <Download className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  onDelete?.(media.id);
                  handleClose();
                }}
                className="text-white hover:bg-destructive rounded-full transition-transform active:scale-90"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Media Surface - Fills entire interface with resize logic */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full transition-all duration-500">
            <Image 
              src={media.imageUrl} 
              alt="Status preview" 
              fill 
              className="object-contain animate-in fade-in duration-700"
              priority
              sizes="100vw"
              data-ai-hint="media preview"
            />
          </div>
        </div>

        {/* Brand Overlay - Minimal and transparent */}
        <div className="absolute bottom-8 left-0 right-0 p-6 flex flex-col items-center gap-2 text-white/30 text-[clamp(7px,1.5vw,9px)] font-black uppercase tracking-[0.3em] pointer-events-none z-[110]">
          <span>Status keeper stable build</span>
          <div className="w-6 h-0.5 bg-primary/30 rounded-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
