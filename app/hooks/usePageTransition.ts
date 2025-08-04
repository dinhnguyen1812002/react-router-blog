import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

export const usePageTransition = (delay: number = 150) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    setIsVisible(false);

    // Complete transition after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsTransitioning(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [location.pathname, delay]);

  return { isTransitioning, isVisible };
};