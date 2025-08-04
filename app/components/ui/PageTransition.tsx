import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    // Start exit animation
    setIsVisible(false);
    
    // After exit animation, update content and start enter animation
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 150); // Half of transition duration

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  useEffect(() => {
    // Initial mount animation
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2'
        }
        ${className}
      `}
    >
      {displayChildren}
    </div>
  );
};

// Fade transition variant
export const FadeTransition = ({ children, className = '' }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    setIsVisible(false);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        transition-opacity duration-200 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
    >
      {displayChildren}
    </div>
  );
};

// Slide transition variant
export const SlideTransition = ({ children, className = '' }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    setIsVisible(false);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 translate-x-4'
        }
        ${className}
      `}
    >
      {displayChildren}
    </div>
  );
};