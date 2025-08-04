import React from 'react';

interface PageBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'pattern' | 'auth';
  className?: string;
}

export const PageBackground = ({ 
  children, 
  variant = 'default',
  className = '' 
}: PageBackgroundProps) => {
  const getBackgroundClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'theme-bg-gradient';
      case 'pattern':
        return 'theme-bg-gradient-primary theme-bg-pattern';
      case 'auth':
        return 'theme-bg-gradient-primary theme-bg-pattern';
      default:
        return 'theme-bg-page';
    }
  };

  return (
    <div className={`${getBackgroundClasses()} ${className}`}>
      {children}
    </div>
  );
};