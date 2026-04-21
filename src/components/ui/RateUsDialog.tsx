"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { toast } from '@/hooks/use-toast';

interface RateUsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RateUsDialog({ isOpen, onClose }: RateUsDialogProps) {
  const { t } = useTranslation();
  const [rating, setStarRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      toast({ title: "Please select stars", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem('has_rated_app', 'true');
      toast({ title: t.rating.success, variant: "success" });
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[calc(100%-2rem)] w-[320px] rounded-[2.5rem] p-6 border-none shadow-2xl animate-in zoom-in-95 duration-300 outline-none">
        <DialogTitle className="text-xl font-black tracking-tight text-gray-900 text-center">
          {t.rating.title}
        </DialogTitle>
        <DialogDescription className="text-center text-[10px] font-bold text-gray-400 mt-2 leading-relaxed px-2 uppercase tracking-wide">
          {t.rating.subtitle}
        </DialogDescription>

        <div className="flex justify-center gap-2.5 my-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setStarRating(star)}
              className="focus:outline-none transition-transform active:scale-75"
            >
              <Star 
                className={cn(
                  "w-9 h-9 transition-colors duration-300",
                  star <= rating ? "fill-amber-400 text-amber-400 drop-shadow-md" : "text-gray-100"
                )}
              />
            </button>
          ))}
        </div>

        <Textarea 
          placeholder={t.rating.placeholder}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[90px] rounded-2xl bg-gray-50 border-gray-100 text-[10px] font-medium focus-visible:ring-primary/20 p-4 no-scrollbar"
        />

        <div className="grid grid-cols-2 gap-3 mt-8">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-xl font-black text-[9px] uppercase tracking-widest text-gray-400 hover:bg-gray-50"
          >
            {t.common.later}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl font-black text-[9px] uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:scale-[0.98] active:scale-95 transition-all"
          >
            {isSubmitting ? "..." : t.common.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
