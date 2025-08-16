// Auth Store với Zustand - Single source of truth
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { clearAllAuthData } from '~/lib/auth-utils';
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
  isLoading: boolean; // To show loading state during login/register API calls
  error: string | null;
  _hasHydrated: boolean; // To check if the store has been rehydrated
  
}

interface AuthActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  checkTokenValidity: () => boolean;
  setHasHydrated: (hydrated: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false, // Not for initialization, but for API calls
      error: null,
      _hasHydrated: false, // Default hydration state

      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      setHasHydrated: (hydrated: boolean) => set({ _hasHydrated: hydrated }),

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        console.log('👋 Logging out user...');
        clearAllAuthData(); // Clear localStorage
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkTokenValidity: () => {
        const { token } = get();
        if (!token) return false;
        if (isTokenExpired(token)) {
          console.log('Token expired, logging out...');
          get().logout();
          return false;
        }
        return true;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('✅ Auth store has been rehydrated');
          if (state.token && isTokenExpired(state.token)) {
            console.log('Token expired on rehydration, clearing state.');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          } else if (state.token) {
            state.isAuthenticated = true;
          }
        }
        state?.setHasHydrated(true);
      },
    }
  )
);