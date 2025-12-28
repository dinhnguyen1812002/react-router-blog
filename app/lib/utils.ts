import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateSimple(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}