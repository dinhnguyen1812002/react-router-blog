// store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (theme: Theme): 'light' | 'dark' =>
  theme === 'system' ? getSystemTheme() : theme;

const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
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
        const nextTheme: Theme =
          theme === 'light' ? 'dark' : theme === 'dark' ? 'light' : 'light';
        get().setTheme(nextTheme);
      },
    }),
    {
      name: 'theme-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const actualTheme = resolveTheme(state.theme);
          applyTheme(actualTheme);
          state.actualTheme = actualTheme;

          if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
              if (state.theme === 'system') {
                const newActualTheme = getSystemTheme();
                applyTheme(newActualTheme);
                // Update the state directly without calling the hook
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
