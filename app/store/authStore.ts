// Auth Store với Zustand - Single source of truth
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '~/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: !!token });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        // Clear any additional storage if needed
        if (typeof window !== 'undefined') {
          localStorage.removeItem('refresh-token');
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // Initialize auth state on app start
      initialize: async () => {
        const { token, user } = get();
        if (token && user) {
          // Optionally verify token is still valid
          try {
            // You can add token validation here
            set({ isAuthenticated: true, isLoading: false });
          } catch (error) {
            console.error('Token validation failed:', error);
            get().logout();
          }
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // Keep data for 7 days
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from old version if needed
          return persistedState;
        }
        return persistedState;
      },
    }
  )
);