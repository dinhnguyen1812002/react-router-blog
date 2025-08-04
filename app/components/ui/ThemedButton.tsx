import React from 'react';
import { Loader2 } from 'lucide-react';

interface ThemedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  gradient?: boolean;
}

export const ThemedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  gradient = false,
  className = '',
  disabled,
  ...props
}: ThemedButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: gradient 
      ? 'theme-gradient-bg text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
    secondary: 'theme-button-secondary',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded-md gap-1',
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-6 py-3 text-base rounded-lg gap-2',
    xl: 'px-8 py-4 text-lg rounded-xl gap-3'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClasses}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

// Icon Button variant
interface ThemedIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  tooltip?: string;
}

export const ThemedIconButton = ({
  icon,
  variant = 'ghost',
  size = 'md',
  loading = false,
  tooltip,
  className = '',
  ...props
}: ThemedIconButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300',
    ghost: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
    danger: 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      title={tooltip}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
    </button>
  );
};