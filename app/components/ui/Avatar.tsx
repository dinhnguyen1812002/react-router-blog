interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
  className?: string;
}

export const Avatar = ({ src, alt, size = 'md', fallback, className = '' }: AvatarProps) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium ${sizes[size]} ${className}`}>
      {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
    </div>
  );
};