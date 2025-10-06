import { useState, useEffect } from "react";
import { Clock, Zap, Image, FileText } from "lucide-react";

interface PerformanceMetrics {
  totalLoadTime: number;
  imageLoadTime: number;
  contentLoadTime: number;
  imagesLoaded: number;
  totalImages: number;
  bytesLoaded: number;
}

interface LoadingPerformanceIndicatorProps {
  show?: boolean;
  startTime: number;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export function LoadingPerformanceIndicator({
  show = false,
  startTime,
  onMetricsUpdate
}: LoadingPerformanceIndicatorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalLoadTime: 0,
    imageLoadTime: 0,
    contentLoadTime: 0,
    imagesLoaded: 0,
    totalImages: 0,
    bytesLoaded: 0
  });

  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (!show) return;

    const updateMetrics = () => {
      const currentTime = performance.now();
      const totalLoadTime = currentTime - startTime;

      // Get performance entries
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const imageEntries = resourceEntries.filter(entry => 
        entry.initiatorType === 'img' || 
        entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
      );

      const totalImages = imageEntries.length;
      const imagesLoaded = imageEntries.filter(entry => entry.responseEnd > 0).length;
      
      const imageLoadTimes = imageEntries
        .filter(entry => entry.responseEnd > 0)
        .map(entry => entry.responseEnd - entry.fetchStart);
      
      const avgImageLoadTime = imageLoadTimes.length > 0 
        ? imageLoadTimes.reduce((sum, time) => sum + time, 0) / imageLoadTimes.length 
        : 0;

      // Calculate bytes loaded (approximate)
      const bytesLoaded = resourceEntries.reduce((total, entry) => {
        return total + (entry.transferSize || entry.encodedBodySize || 0);
      }, 0);

      const newMetrics: PerformanceMetrics = {
        totalLoadTime: Math.round(totalLoadTime),
        imageLoadTime: Math.round(avgImageLoadTime),
        contentLoadTime: Math.round(totalLoadTime - avgImageLoadTime),
        imagesLoaded,
        totalImages,
        bytesLoaded: Math.round(bytesLoaded / 1024) // Convert to KB
      };

      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);
    };

    const interval = setInterval(updateMetrics, 100);
    updateMetrics(); // Initial call

    // Hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [show, startTime, onMetricsUpdate]);

  if (!isVisible) return null;

  const getLoadingStatus = () => {
    if (metrics.totalLoadTime < 1000) return { status: "Excellent", color: "text-green-600", bgColor: "bg-green-100" };
    if (metrics.totalLoadTime < 3000) return { status: "Good", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (metrics.totalLoadTime < 5000) return { status: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    return { status: "Slow", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const { status, color, bgColor } = getLoadingStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              Loading Performance
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {/* Overall Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`text-sm font-medium px-2 py-1 rounded ${bgColor} ${color}`}>
              {status}
            </span>
          </div>

          {/* Metrics */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Total Time:</span>
              </div>
              <span className="font-mono text-gray-900 dark:text-white">
                {metrics.totalLoadTime}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Images:</span>
              </div>
              <span className="font-mono text-gray-900 dark:text-white">
                {metrics.imagesLoaded}/{metrics.totalImages}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Data:</span>
              </div>
              <span className="font-mono text-gray-900 dark:text-white">
                {metrics.bytesLoaded}KB
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          {metrics.totalImages > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Image Loading</span>
                <span>{Math.round((metrics.imagesLoaded / metrics.totalImages) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(metrics.imagesLoaded / metrics.totalImages) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook to track loading performance
export function useLoadingPerformance() {
  const [startTime] = useState(() => performance.now());
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Show indicator during development or when explicitly enabled
    const isDev = process.env.NODE_ENV === 'development';
    const showPerf = localStorage.getItem('show-performance-indicator') === 'true';
    setShowIndicator(isDev || showPerf);
  }, []);

  const handleMetricsUpdate = (newMetrics: PerformanceMetrics) => {
    setMetrics(newMetrics);
  };

  return {
    startTime,
    metrics,
    showIndicator,
    setShowIndicator,
    handleMetricsUpdate,
    LoadingPerformanceIndicator: (props: Omit<LoadingPerformanceIndicatorProps, 'startTime' | 'onMetricsUpdate'>) => (
      <LoadingPerformanceIndicator
        {...props}
        startTime={startTime}
        onMetricsUpdate={handleMetricsUpdate}
      />
    )
  };
}
