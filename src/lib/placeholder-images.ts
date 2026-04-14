
import data from '@/app/lib/placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Unified source of truth for placeholder images
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
