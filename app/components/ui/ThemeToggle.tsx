import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore, type Theme } from '~/store/themeStore';
import { Button } from './button';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  className?: string;
}

export const ThemeToggle = ({ variant = 'button', className = '' }: ThemeToggleProps) => {
  const { theme, actualTheme, setTheme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className={`w-9 h-9 p-0 ${className}`}>
        <Sun className="w-4 h-4" />
      </Button>
    );
  }

  const getThemeIcon = (themeType: Theme) => {
    switch (themeType) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  const getThemeLabel = (themeType: Theme) => {
    switch (themeType) {
      case 'light':
        return 'Sáng';
      case 'dark':
        return 'Tối';
      case 'system':
        return 'Hệ thống';
      default:
        return 'Sáng';
    }
  };

  if (variant === 'dropdown') {
    return (
      <div className={`space-y-1 ${className}`}>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
          Giao diện
        </p>
        {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
          <button
            key={themeOption}
            onClick={() => setTheme(themeOption)}
            className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left transition-colors rounded-md ${
              theme === themeOption
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {getThemeIcon(themeOption)}
            <span>{getThemeLabel(themeOption)}</span>
            {theme === themeOption && (
              <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`w-9 h-9 p-0 transition-all duration-200 hover:scale-105 ${className}`}
      title={`Chuyển sang ${theme === 'light' ? 'tối' : theme === 'dark' ? 'hệ thống' : 'sáng'}`}
    >
      <div className="relative">
        {getThemeIcon(theme)}
        {theme === 'system' && (
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-gray-800" />
        )}
      </div>
    </Button>
  );
};

// Separate component for theme status display
export const ThemeStatus = ({ className = '' }: { className?: string }) => {
  const { theme, actualTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 ${className}`}>
      <span>Giao diện:</span>
      <span className="font-medium">
        {getThemeLabel(theme)}
        {theme === 'system' && ` (${actualTheme === 'dark' ? 'Tối' : 'Sáng'})`}
      </span>
    </div>
  );
};

const getThemeLabel = (themeType: Theme) => {
  switch (themeType) {
    case 'light':
      return 'Sáng';
    case 'dark':
      return 'Tối';
    case 'system':
      return 'Hệ thống';
    default:
      return 'Sáng';
  }
};
