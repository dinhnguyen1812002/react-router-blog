import React from 'react';

interface ThemedBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

export const ThemedBadge = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  pulse = false,
  className = ''
}: ThemedBadgeProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200';

  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    secondary: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    info: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200'
  };

  const sizeClasses = {
    xs: dot ? 'w-2 h-2' : 'px-1.5 py-0.5 text-xs min-w-[1rem]',
    sm: dot ? 'w-2.5 h-2.5' : 'px-2 py-0.5 text-xs min-w-[1.25rem]',
    md: dot ? 'w-3 h-3' : 'px-2.5 py-1 text-sm min-w-[1.5rem]',
    lg: dot ? 'w-4 h-4' : 'px-3 py-1.5 text-sm min-w-[2rem]'
  };

  const pulseClasses = pulse ? 'animate-pulse' : '';

  if (dot) {
    return (
      <span
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${pulseClasses}
          ${className}
        `}
      />
    );
  }

  return (
    <span
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${pulseClasses}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Notification Badge (for counts)
interface NotificationBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  className?: string;
}

export const NotificationBadge = ({
  count,
  max = 99,
  showZero = false,
  className = ''
}: NotificationBadgeProps) => {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <ThemedBadge
      variant="danger"
      size="xs"
      pulse={count > 0}
      className={`absolute -top-1 -right-1 ${className}`}
    >
      {displayCount}
    </ThemedBadge>
  );
};

// Status Badge
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  showText?: boolean;
  className?: string;
}

export const StatusBadge = ({
  status,
  showText = false,
  className = ''
}: StatusBadgeProps) => {
  const statusConfig = {
    online: { variant: 'success' as const, text: 'Online', dot: true },
    offline: { variant: 'default' as const, text: 'Offline', dot: true },
    away: { variant: 'warning' as const, text: 'Away', dot: true },
    busy: { variant: 'danger' as const, text: 'Busy', dot: true }
  };

  const config = statusConfig[status];

  if (showText) {
    return (
      <ThemedBadge
        variant={config.variant}
        size="sm"
        className={`gap-1.5 ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-current" />
        {config.text}
      </ThemedBadge>
    );
  }

  return (
    <ThemedBadge
      variant={config.variant}
      size="xs"
      dot
      className={className}
    />
  );
};