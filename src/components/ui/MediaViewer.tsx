"use client";

import { X, Download, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

/**
 * MediaViewer - True fullscreen responsive view with high-visibility actions.
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
    // Dispatch event to potentially show interstitial ad after closing the viewer (natural break)
    window.dispatchEvent(new CustomEvent('request-interstitial'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-none w-screen h-[100dvh] p-0 bg-black border-none flex flex-col items-center justify-center z-[100] outline-none overflow-hidden rounded-none shadow-none">
        <DialogTitle>
          <VisuallyHidden>Media viewer - {media.id}</VisuallyHidden>
        </DialogTitle>
        
        {/* Actions Overlay Layer */}
        <div className="absolute inset-0 z-[110] pointer-events-none flex flex-col justify-between">
          {/* Top Bar */}
          <div className="w-full p-4 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent pt-safe pointer-events-auto">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose} 
              className="text-white hover:bg-white/20 rounded-full transition-all active:scale-90 bg-black/20 backdrop-blur-md border border-white/10 shadow-lg"
            >
              <X className="w-6 h-6" />
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 rounded-full transition-all active:scale-90 bg-black/20 backdrop-blur-md border border-white/10 shadow-lg"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              {mode === 'status' ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDownload?.(media.id)}
                  className="text-white hover:bg-primary/80 rounded-full transition-all active:scale-90 bg-primary/20 backdrop-blur-md border border-primary/20 shadow-[0_0_15px_rgba(37,211,102,0.3)]"
                >
                  <Download className="w-5 h-5" />
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    onDelete?.(media.id);
                    handleClose();
                  }}
                  className="text-white hover:bg-destructive rounded-full transition-all active:scale-90 bg-destructive/20 backdrop-blur-md border border-destructive/20 shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="w-full p-10 flex flex-col items-center gap-2 pointer-events-none">
            <span className="bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-xl border border-white/10 text-white/60 text-[clamp(8px,2vw,10px)] font-black uppercase tracking-[0.3em] shadow-2xl drop-shadow-lg">
              Status keeper stable build
            </span>
            <div className="w-16 h-0.5 bg-primary/60 rounded-full shadow-[0_0_15px_rgba(37,211,102,0.6)]" />
          </div>
        </div>

        {/* Content Layer */}
        <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden">
          <div className="relative w-full h-full">
            <Image 
              src={media.imageUrl} 
              alt="Status content" 
              fill 
              className="object-contain animate-in fade-in duration-700"
              priority
              quality={100}
              sizes="100vw"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
