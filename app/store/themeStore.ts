import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // The actual theme being used (resolved from system)
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Function to get system theme
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Function to resolve actual theme
const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

// Function to apply theme to document
const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      actualTheme: 'light',
      
      setTheme: (theme: Theme) => {
        const actualTheme = resolveTheme(theme);
        applyTheme(actualTheme);
        
        set({ theme, actualTheme });
      },
      
      toggleTheme: () => {
        const { theme } = get();
        let newTheme: Theme;
        
        if (theme === 'light') {
          newTheme = 'dark';
        } else if (theme === 'dark') {
          newTheme = 'system';
        } else {
          newTheme = 'light';
        }
        
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply theme after rehydration
          const actualTheme = resolveTheme(state.theme);
          applyTheme(actualTheme);
          state.actualTheme = actualTheme;
          
          // Listen for system theme changes
          if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
              if (state.theme === 'system') {
                const newActualTheme = getSystemTheme();
                applyTheme(newActualTheme);
                state.actualTheme = newActualTheme;
              }
            };
            
            mediaQuery.addEventListener('change', handleChange);
          }
        }
      },
    }
  )
);

// Hook to initialize theme on client side
export const useThemeInitializer = () => {
  const { theme, setTheme } = useThemeStore();
  
  // Initialize theme on client side
  if (typeof window !== 'undefined') {
    const actualTheme = resolveTheme(theme);
    applyTheme(actualTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const newActualTheme = getSystemTheme();
        applyTheme(newActualTheme);
        useThemeStore.setState({ actualTheme: newActualTheme });
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }
};
