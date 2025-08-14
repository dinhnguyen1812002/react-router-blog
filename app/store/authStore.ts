// Auth Store với Zustand - Single source of truth
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '~/types';

// Helper function to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true; // If we can't decode, consider it expired
  }
};

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
  checkTokenValidity: () => boolean;
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

      // Check if current token is valid
      checkTokenValidity: () => {
        const { token } = get();
        if (token && isTokenExpired(token)) {
          console.log('Token expired, logging out...');
          get().logout();
          return false;
        }
        return !!token;
      },

      // Initialize auth state on app start
      initialize: async () => {
        const { token, user } = get();
        if (token && user) {
          // Check if token is expired
          if (isTokenExpired(token)) {
            console.log('Token expired during initialization, logging out...');
            get().logout();
            set({ isLoading: false });
            return;
          }
          
          try {
            set({ isAuthenticated: true, isLoading: false });
          } catch (error) {
            console.error('Token validation failed:', error);
            get().logout();
            set({ isLoading: false });
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
      // Custom hydration to check token expiration on load
      onRehydrateStorage: () => (state) => {
        if (state?.token && isTokenExpired(state.token)) {
          console.log('Token expired on rehydration, clearing storage...');
          // Clear expired data
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      },
    }
  )
);