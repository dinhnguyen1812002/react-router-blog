import { useState, useEffect, useRef, useCallback } from "react";
import { Skeleton } from "~/components/ui/skeleton";

interface ProgressiveContentLoaderProps {
  content: string;
  className?: string;
  onLoadComplete?: () => void;
  enableLazyImages?: boolean;
  enableProgressiveText?: boolean;
  chunkSize?: number;
  delayBetweenChunks?: number;
}

export function ProgressiveContentLoader({
  content,
  className = "",
  onLoadComplete,
  enableLazyImages = true,
  enableProgressiveText = false,
  chunkSize = 500,
  delayBetweenChunks = 50,
}: ProgressiveContentLoaderProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract images from content
  const extractImages = useCallback((htmlContent: string) => {
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    const images: string[] = [];
    let match;
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      images.push(match[1]);
    }
    return images;
  }, []);

  // Progressive text loading
  const loadContentProgressively = useCallback(async () => {
    if (!enableProgressiveText) {
      setDisplayedContent(content);
      setIsLoading(false);
      return;
    }

    const chunks = [];
    const textContent = content.replace(/<[^>]*>/g, "");
    
    for (let i = 0; i < textContent.length; i += chunkSize) {
      chunks.push(textContent.slice(i, i + chunkSize));
    }

    let currentContent = "";
    for (let i = 0; i < chunks.length; i++) {
      currentContent += chunks[i];
      setDisplayedContent(currentContent);
      setCurrentChunk(i + 1);
      
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenChunks));
      }
    }

    // Restore HTML structure
    setDisplayedContent(content);
    setIsLoading(false);
    onLoadComplete?.();
  }, [content, enableProgressiveText, chunkSize, delayBetweenChunks, onLoadComplete]);

  // Lazy load images
  const setupLazyImages = useCallback(() => {
    if (!enableLazyImages || !contentRef.current) return;

    const images = contentRef.current.querySelectorAll('img');
    setTotalImages(images.length);

    if (images.length === 0) {
      setIsLoading(false);
      onLoadComplete?.();
      return;
    }

    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Continue even if image fails to load
        }
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(images.length);
      setIsLoading(false);
      onLoadComplete?.();
    });
  }, [enableLazyImages, onLoadComplete]);

  // Intersection Observer for lazy loading
  const setupIntersectionObserver = useCallback(() => {
    if (!enableLazyImages || !contentRef.current) return;

    const images = contentRef.current.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || "";
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    images.forEach(img => imageObserver.observe(img));

    return () => imageObserver.disconnect();
  }, [enableLazyImages]);

  // Process content for lazy loading
  const processContentForLazyLoading = useCallback((htmlContent: string) => {
    if (!enableLazyImages) return htmlContent;

    return htmlContent.replace(
      /<img([^>]+)src="([^"]+)"([^>]*)>/g,
      '<img$1data-src="$2"$3 loading="lazy">'
    );
  }, [enableLazyImages]);

  useEffect(() => {
    setIsLoading(true);
    setCurrentChunk(0);
    setImagesLoaded(0);
    
    const processedContent = processContentForLazyLoading(content);
    setDisplayedContent(processedContent);
    
    loadContentProgressively();
  }, [content, loadContentProgressively, processContentForLazyLoading]);

  useEffect(() => {
    if (!isLoading) {
      setupLazyImages();
      setupIntersectionObserver();
    }
  }, [isLoading, setupLazyImages, setupIntersectionObserver]);

  // Loading progress indicator
  const getLoadingProgress = () => {
    if (enableProgressiveText && totalImages === 0) {
      return (currentChunk / Math.ceil(content.length / chunkSize)) * 100;
    }
    if (enableLazyImages && totalImages > 0) {
      return (imagesLoaded / totalImages) * 100;
    }
    return 0;
  };

  return (
    <div className="relative">
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Loading content...</span>
            <span>{Math.round(getLoadingProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${getLoadingProgress()}%` }}
            />
          </div>
          {enableProgressiveText && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Loading text chunk {currentChunk}...
            </div>
          )}
          {enableLazyImages && totalImages > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Loading images... ({imagesLoaded}/{totalImages})
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
        dangerouslySetInnerHTML={{ __html: displayedContent }}
      />

      {/* Loading skeleton for images */}
      {isLoading && enableLazyImages && (
        <div className="space-y-4 mt-4">
          {Array.from({ length: Math.min(totalImages, 3) }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Skeleton className="w-16 h-12 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Optimized image component with lazy loading
export function OptimizedImage({
  src,
  alt,
  className = "",
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23f3f4f6'/%3E%3C/svg%3E",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  placeholder?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      )}
      <img
        {...props}
        src={hasError ? placeholder : src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}

// Content preloader hook
export function useContentPreloader(content: string) {
  const [isPreloaded, setIsPreloaded] = useState(false);

  useEffect(() => {
    if (!content) return;

    // Preload critical resources
    const preloadResources = async () => {
      const images = extractImages(content);
      
      // Preload first few images
      const criticalImages = images.slice(0, 3);
      await Promise.allSettled(
        criticalImages.map(src => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
          });
        })
      );

      setIsPreloaded(true);
    };

    preloadResources();
  }, [content]);

  return isPreloaded;
}

// Helper function to extract images from HTML content
function extractImages(htmlContent: string): string[] {
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  const images: string[] = [];
  let match;
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    images.push(match[1]);
  }
  return images;
}
