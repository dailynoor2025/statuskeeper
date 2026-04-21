"use client";

import { useState } from 'react';
import { Star, X } from 'lucide-react';
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
    // Simulate API call to analytics/backend
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem('has_rated_app', 'true');
      toast({ title: t.rating.success, variant: "success" });
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[calc(100%-2rem)] w-[320px] rounded-3xl p-6 border-none shadow-2xl animate-in zoom-in-95 duration-300">
        <DialogTitle className="text-xl font-black tracking-tight text-gray-900 text-center">
          {t.rating.title}
        </DialogTitle>
        <DialogDescription className="text-center text-xs font-medium text-gray-400 mt-1">
          {t.rating.subtitle}
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
                  "w-8 h-8 transition-colors",
                  star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                )}
              />
            </button>
          ))}
        </div>

        <Textarea 
          placeholder={t.rating.placeholder}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px] rounded-2xl bg-gray-50 border-gray-100 text-xs focus-visible:ring-primary/20 p-4"
        />

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-xl font-black text-[10px] uppercase tracking-wider text-gray-400"
          >
            {t.common.later}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl font-black text-[10px] uppercase tracking-wider bg-primary shadow-lg shadow-primary/20"
          >
            {isSubmitting ? "..." : t.common.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
