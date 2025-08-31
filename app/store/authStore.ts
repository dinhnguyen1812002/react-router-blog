import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { clearAllAuthData } from "~/lib/auth-utils";
import { authApi } from "~/api/auth"; // ⬅️ cần có hàm refreshToken trong authApi
import type { User } from "~/types";

// Helper function to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
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
  _hasHydrated: boolean;
}

interface AuthActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  checkTokenValidity: () => boolean;
  setHasHydrated: (hydrated: boolean) => void;
  refreshToken: () => Promise<string | null>; // ⬅️ thêm
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
      _hasHydrated: false,

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
        console.log("👋 Logging out user...");
        clearAllAuthData();
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
          console.log("Token expired, logging out...");
          get().logout();
          return false;
        }
        return true;
      },

      // ⬇️ Hàm refresh token
      refreshToken: async () => {
        try {
          const response = await authApi.refreshToken();
          const { accessToken } = response;

          // Update lại token
          const currentUser = get().user;
          if (currentUser) {
            set({
              token: accessToken,
              isAuthenticated: true,
            });
          }

          console.log("🔄 Token refreshed successfully");
          return accessToken;
        } catch (error) {
          console.error("❌ Refresh token failed:", error);
          get().logout();
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("✅ Auth store has been rehydrated");
          if (state.token && isTokenExpired(state.token)) {
            console.log("Token expired on rehydration, clearing state.");
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
