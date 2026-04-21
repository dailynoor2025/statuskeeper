
"use client";

import { X, Download, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Share } from '@capacitor/share';
import { toast } from '@/hooks/use-toast';

/**
 * MediaViewer - Optimized for immersive full-screen experience.
 * Controls are minimalist without backgrounds for a professional look.
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
      <DialogContent className="fixed inset-0 z-[1300] w-screen h-[100dvh] max-w-none m-0 p-0 border-none bg-black rounded-none shadow-none flex flex-col outline-none overflow-hidden translate-x-0 translate-y-0 left-0 top-0">
        <DialogTitle>
          <VisuallyHidden>Media viewer - {media.id}</VisuallyHidden>
        </DialogTitle>
        
        {/* Top Control Bar - Minimalist, no icon backgrounds */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-[1320] bg-gradient-to-b from-black/60 to-transparent pt-safe">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose} 
            className="text-white hover:text-white/60 transition-transform active:scale-90 border-none bg-transparent"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              className="text-white hover:text-white/60 transition-transform active:scale-90 border-none bg-transparent"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            {mode === 'status' ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDownload?.(media.id)}
                className="text-white hover:text-primary transition-transform active:scale-90 border-none bg-transparent"
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
                className="text-white hover:text-destructive transition-transform active:scale-90 border-none bg-transparent"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Media Surface - Full screen frame-less container */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black z-0">
          <Image 
            src={media.imageUrl} 
            alt="Status preview" 
            fill 
            className="object-contain animate-in fade-in duration-500"
            priority
            sizes="100vw"
            data-ai-hint="media preview"
          />
        </div>

        {/* Brand Overlay - Minimal and ultra-transparent */}
        <div className="absolute bottom-8 left-0 right-0 p-6 flex flex-col items-center gap-1 text-white/20 text-[7px] font-black uppercase tracking-[0.4em] pointer-events-none z-[1320]">
          <span>Stable build</span>
          <div className="w-4 h-0.5 bg-primary/20 rounded-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
