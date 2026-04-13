import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Shared utility for conditional Tailwind class merging.
 * Essential for ShadCN components and responsive logic.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
