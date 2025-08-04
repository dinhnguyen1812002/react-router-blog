import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Hydration-safe date formatting utility
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions) {
  // Use a consistent format that works the same on server and client
  const date = new Date(dateString);
  
  // Default options for Vietnamese locale
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh', // Explicit timezone to ensure consistency
  };

  const formatOptions = { ...defaultOptions, ...options };
  
  try {
    return date.toLocaleDateString('vi-VN', formatOptions);
  } catch (error) {
    // Fallback to a simple format if locale formatting fails
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

// Simple date format without time for cards and lists
export function formatDateSimple(dateString: string) {
  const date = new Date(dateString);
  
  try {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  } catch (error) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
