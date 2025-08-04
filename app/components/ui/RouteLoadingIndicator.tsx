import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

export const RouteLoadingIndicator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse">
        <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
    </div>
  );
};