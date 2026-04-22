
"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { toast } from '@/hooks/use-toast';
import { Browser } from '@capacitor/browser';

interface RateUsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * RateUsDialog - Strategic Prompting with Play Store Redirection.
 * Optimized for Capacitor 7 using Browser plugin for deep linking.
 */
export function RateUsDialog({ isOpen, onClose }: RateUsDialogProps) {
  const { t } = useTranslation();
  const [rating, setStarRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Please select stars", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Logic: If 5 stars, redirect to Play Store
      if (rating === 5) {
        const packageName = "com.qhaleelahmad.statuskeeper";
        await Browser.open({ 
          url: `market://details?id=${packageName}`,
          windowName: '_blank'
        }).catch(async () => {
          // Fallback to web link if market protocol fails
          await Browser.open({ 
            url: `https://play.google.com/store/apps/details?id=${packageName}` 
          });
        });
      }
      
      localStorage.setItem('has_rated_app', 'true');
      toast({ title: t.rating.success, variant: "success" });
      onClose();
    } catch (err) {
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[calc(100%-2rem)] w-[320px] rounded-[2.5rem] p-6 border-none shadow-2xl animate-in zoom-in-95 duration-300 outline-none">
        <DialogTitle className="text-lg font-black tracking-tight text-gray-900 text-center">
          Love Status Keeper?
        </DialogTitle>
        <DialogDescription className="text-center text-[9px] font-bold text-gray-400 mt-2 leading-relaxed px-2 uppercase tracking-wide">
          Your 5-star rating keeps us fast and free for everyone. Share your favorite part!
        </DialogDescription>

        <div className="flex justify-center gap-2 my-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setStarRating(star)}
              className="focus:outline-none transition-transform active:scale-75"
            >
              <Star 
                className={cn(
                  "w-8 h-8 transition-colors duration-300",
                  star <= rating ? "fill-amber-400 text-amber-400 drop-shadow-md" : "text-gray-100"
                )}
              />
            </button>
          ))}
        </div>

        <Textarea 
          placeholder="Tell us what you love most..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[80px] rounded-2xl bg-gray-50 border-gray-100 text-[10px] font-medium focus-visible:ring-primary/20 p-4 no-scrollbar border-none"
        />

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-xl font-black text-[9px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 border-none"
          >
            {t.common.later}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl font-black text-[9px] uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:scale-[0.98] active:scale-95 transition-all border-none"
          >
            {isSubmitting ? "..." : t.common.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
