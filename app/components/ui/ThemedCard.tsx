import React from 'react';

interface ThemedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

export const ThemedCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick 
}: ThemedCardProps) => {
  const baseClasses = 'theme-card transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white dark:bg-black border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-black border-0 shadow-lg dark:shadow-gray-900/20',
    outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
    glass: 'theme-glass backdrop-blur-sm'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${paddingClasses[padding]} 
        ${hoverClasses} 
        ${clickableClasses}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface ThemedCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ThemedCardHeader = ({ children, className = '' }: ThemedCardHeaderProps) => {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 ${className}`}>
      {children}
    </div>
  );
};

interface ThemedCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ThemedCardContent = ({ children, className = '' }: ThemedCardContentProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};