import React, { useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = React.useState<Theme>('system');
  const [actualTheme, setActualTheme] = React.useState<'light' | 'dark'>('light');

  // Get system theme
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Resolve actual theme
  const resolveTheme = (themeType: Theme): 'light' | 'dark' => {
    if (themeType === 'system') {
      return getSystemTheme();
    }
    return themeType;
  };

  // Apply theme to document
  const applyTheme = (newActualTheme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Add theme-switching class to prevent transitions during switch
    root.classList.add('theme-switching');
    
    if (newActualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Remove theme-switching class after a brief delay
    setTimeout(() => {
      root.classList.remove('theme-switching');
    }, 50);

    setActualTheme(newActualTheme);
  };

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const newActualTheme = resolveTheme(newTheme);
    applyTheme(newActualTheme);
  };

  useEffect(() => {
    // Initialize theme on client side
    if (typeof window === 'undefined') return;

    // Get saved theme or default to system
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    setThemeState(savedTheme);
    
    const initialActualTheme = resolveTheme(savedTheme);
    applyTheme(initialActualTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (savedTheme === 'system') {
        const newActualTheme = e.matches ? 'dark' : 'light';
        applyTheme(newActualTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const value: ThemeContextType = {
    theme,
    setTheme,
    actualTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
