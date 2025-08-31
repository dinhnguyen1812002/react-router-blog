import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from 'react';
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

// Calculate reading time based on content
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  if (!content) return 0;

  // Remove HTML tags and count words
  const plainText = content.replace(/<[^>]*>/g, '');
  const words = plainText.trim().split(/\s+/).length;

  return Math.ceil(words / wordsPerMinute);
}

// Format numbers with K, M suffixes
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}


// export function normalizeDateTime(value?: string): string | undefined {
//   if (!value) return undefined;
//   // nếu người dùng nhập "2025-09-01T10:00" → thêm ":00"
//   if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
//     return value + ":00";
//   }
//   return value; // đã có giây thì giữ nguyên
// }