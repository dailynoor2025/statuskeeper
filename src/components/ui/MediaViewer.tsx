"use client";

import { X, Download, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

/**
 * MediaViewer - Updated to fill the screen and provide high-visibility controls.
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-none w-screen h-[100dvh] p-0 bg-black border-none flex flex-col items-center justify-center z-[100] outline-none overflow-hidden rounded-none">
        <DialogTitle>
          <VisuallyHidden>Media viewer - {media.id}</VisuallyHidden>
        </DialogTitle>
        
        {/* Top bar with improved icon visibility logic */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-[110] bg-gradient-to-b from-black/90 via-black/40 to-transparent pt-safe transition-opacity duration-300">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-white hover:bg-white/20 rounded-full transition-all active:scale-90 bg-black/20 backdrop-blur-md border border-white/10"
          >
            <X className="w-6 h-6" />
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-full transition-all active:scale-90 bg-black/20 backdrop-blur-md border border-white/10"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            {mode === 'status' ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDownload?.(media.id)}
                className="text-white hover:bg-primary/80 rounded-full transition-all active:scale-90 bg-primary/20 backdrop-blur-md border border-primary/20"
              >
                <Download className="w-5 h-5" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  onDelete?.(media.id);
                  onClose();
                }}
                className="text-white hover:bg-destructive rounded-full transition-all active:scale-90 bg-destructive/20 backdrop-blur-md border border-destructive/20"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Full screen resize logic using object-contain to preserve quality */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full transition-all duration-500 bg-black">
            <Image 
              src={media.imageUrl} 
              alt="Status preview" 
              fill 
              className="object-contain"
              priority
              quality={100}
              sizes="100vw"
            />
          </div>
        </div>

        {/* Bottom indicator with improved accessibility */}
        <div className="absolute bottom-10 left-0 right-0 p-6 flex flex-col items-center gap-2 text-white/60 text-[clamp(8px,2vw,10px)] font-black uppercase tracking-[0.3em] pointer-events-none drop-shadow-lg">
          <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
            Status keeper stable build
          </span>
          <div className="w-12 h-0.5 bg-primary/60 rounded-full shadow-[0_0_10px_rgba(37,211,102,0.5)]" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
