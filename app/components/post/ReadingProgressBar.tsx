import { useState, useEffect, useRef } from 'react';
import { ArrowUp, Clock, Eye } from 'lucide-react';

interface ReadingProgressBarProps {
  targetRef?: React.RefObject<HTMLElement>;
  className?: string;
  showBackToTop?: boolean;
  showReadingTime?: boolean;
  showScrollPercentage?: boolean;
  estimatedReadingTime?: number;
  position?: 'top' | 'bottom';
  color?: string;
}

export default function ReadingProgressBar({
  targetRef,
  className = '',
  showBackToTop = true,
  showReadingTime = true,
  showScrollPercentage = false,
  estimatedReadingTime = 5,
  position = 'top',
  color = '#3B82F6',
}: ReadingProgressBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateProgress = () => {
      let element: HTMLElement | null = null;
      
      if (targetRef?.current) {
        element = targetRef.current;
      } else {
        // Default to document body
        element = document.documentElement;
      }

      if (!element) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = element.scrollHeight - window.innerHeight;
      
      if (scrollHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
      setScrollProgress(progress);

      // Show/hide based on scroll position
      setIsVisible(scrollTop > 100);

      // Calculate reading time based on scroll progress
      if (estimatedReadingTime > 0) {
        const timeSpent = (progress / 100) * estimatedReadingTime;
        setReadingTime(timeSpent);
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    // Initial calculation
    calculateProgress();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [targetRef, estimatedReadingTime]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)}s`;
    }
    return `${Math.round(minutes)}m`;
  };

  const progressBarClasses = `
    fixed left-0 right-0 z-50 transition-all duration-300 ease-out
    ${position === 'top' ? 'top-0' : 'bottom-0'}
    ${isVisible ? 'opacity-100 translate-y-0' : position === 'top' ? 'opacity-0 -translate-y-full' : 'opacity-0 translate-y-full'}
    ${className}
  `;

  return (
    <>
      {/* Progress Bar */}
      <div className={progressBarClasses}>
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            className="h-1 transition-all duration-150 ease-out"
            style={{
              background: `linear-gradient(to right, ${color} ${scrollProgress}%, transparent ${scrollProgress}%)`,
            }}
          />

          {/* Info Bar */}
          <div className="px-4 py-2 flex items-center justify-between text-sm">
            {/* Left side - Reading info */}
            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
              {showReadingTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {readingTime > 0 ? formatTime(readingTime) : formatTime(estimatedReadingTime)} đọc
                  </span>
                </div>
              )}
              
              {showScrollPercentage && (
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{Math.round(scrollProgress)}% hoàn thành</span>
                </div>
              )}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              {/* Progress percentage */}
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[3rem] text-right">
                {Math.round(scrollProgress)}%
              </span>

              {/* Back to top button */}
              {showBackToTop && scrollProgress > 10 && (
                <button
                  onClick={scrollToTop}
                  className="p-1.5 rounded-full bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Về đầu trang"
                >
                  <ArrowUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button (Alternative) */}
      {showBackToTop && isVisible && scrollProgress > 20 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white dark:bg-black shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-110 group"
          title="Về đầu trang"
        >
          <ArrowUp className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          
          {/* Progress ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="text-gray-200 dark:text-gray-700"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="transition-all duration-300 ease-out"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${scrollProgress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </button>
      )}

      {/* Mini Progress Indicator (Mobile) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-gray-200 dark:bg-black md:hidden">
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </>
  );
}

// Hook for reading progress
export function useReadingProgress(targetRef?: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const calculateProgress = () => {
      let element: HTMLElement | null = null;
      
      if (targetRef?.current) {
        element = targetRef.current;
      } else {
        element = document.documentElement;
      }

      if (!element) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = element.scrollHeight - window.innerHeight;
      
      if (scrollHeight <= 0) {
        setProgress(0);
        setIsReading(false);
        return;
      }

      const currentProgress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
      setProgress(currentProgress);
      setIsReading(scrollTop > 100 && currentProgress < 95);
    };

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    calculateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [targetRef]);

  return { progress, isReading };
}

// Estimated reading time calculator
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
