import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ThemedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
}

export const ThemedInput = React.forwardRef<HTMLInputElement, ThemedInputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  inputSize = 'md',
  className = '',
  type,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseClasses = 'theme-input transition-all duration-200 focus:ring-2 focus:ring-blue-500/20';
  
  const variantClasses = {
    default: 'border-gray-300 dark:border-gray-600 focus:border-blue-500',
    filled: 'bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500',
    outlined: 'border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const errorClasses = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
    : '';

  const leftPadding = leftIcon ? 'pl-10' : '';
  const rightPadding = rightIcon || isPassword ? 'pr-10' : '';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${sizeClasses[inputSize]}
            ${errorClasses}
            ${leftPadding}
            ${rightPadding}
            ${className}
          `}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {rightIcon && !isPassword && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400 dark:text-gray-500">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

ThemedInput.displayName = 'ThemedInput';

// Textarea variant
interface ThemedTextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rows?: number;
  resize?: boolean;
}

export const ThemedTextarea = React.forwardRef<HTMLTextAreaElement, ThemedTextareaProps>(({
  label,
  error,
  helperText,
  rows = 4,
  resize = true,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'theme-input transition-all duration-200 focus:ring-2 focus:ring-blue-500/20';
  const errorClasses = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500';
  const resizeClasses = resize ? 'resize-y' : 'resize-none';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={`
          ${baseClasses}
          ${errorClasses}
          ${resizeClasses}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

ThemedTextarea.displayName = 'ThemedTextarea';