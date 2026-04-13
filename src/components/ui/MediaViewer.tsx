"use client";

import { X, Download, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

/**
 * MediaViewer - Enhanced with professional scaling logic.
 * Constraints enforced for phones and tablets.
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
      <DialogContent className="max-w-none w-screen h-screen p-0 bg-black/95 border-none flex flex-col items-center justify-center z-[100] outline-none overflow-hidden">
        <DialogTitle>
          <VisuallyHidden>Media viewer - {media.id}</VisuallyHidden>
        </DialogTitle>
        
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-[110] bg-gradient-to-b from-black/80 to-transparent pt-safe">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full transition-transform active:scale-90">
            <X className="w-6 h-6" />
          </Button>
          
          <div className="flex gap-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full transition-transform active:scale-90">
              <Share2 className="w-5 h-5" />
            </Button>
            {mode === 'status' ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDownload?.(media.id)}
                className="text-white hover:bg-white/20 rounded-full transition-transform active:scale-90"
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
                className="text-white hover:bg-destructive rounded-full transition-transform active:scale-90"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="relative w-full h-full flex items-center justify-center p-6">
          {/* Professional Scaling Logic: constrained max-h and max-w */}
          <div className="relative w-full max-w-[min(85vw,320px)] max-h-[70vh] aspect-[9/16] shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black transition-all duration-500">
            <Image 
              src={media.imageUrl} 
              alt="Status preview" 
              fill 
              className="object-contain"
              priority
              sizes="(max-width: 520px) 100vw, 320px"
            />
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 p-6 flex flex-col items-center gap-2 text-white/40 text-[clamp(8px,2vw,10px)] font-black uppercase tracking-[0.3em] pointer-events-none">
          <span>Status keeper stable build</span>
          <div className="w-8 h-0.5 bg-primary/40 rounded-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}