import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { clearAllAuthData } from "~/lib/auth-utils";
import { authApi } from "~/api/auth";
import type { User } from "~/types";

// =====================
// Helper: check token expiration
// =====================
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true; // Nếu decode lỗi => coi như hết hạn
  }
};

interface AuthState {
  user: User | null;
  token: string | null; // access token
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
  refreshAccessToken: () => Promise<string | null>;
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      setHasHydrated: (hydrated: boolean) => set({ _hasHydrated: hydrated }),

      // ✅ login chỉ còn 2 tham số
      login: (user: User, accessToken: string) => {
        set({
          user,
          token: accessToken,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        console.log("Logging out user...");
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
          console.log("Token expired");
          return false;
        }
        return true;
      },

      refreshAccessToken: async () => {
        try {
          const { accessToken } = await authApi.refreshToken();
          if (!accessToken) throw new Error("No new access token returned");

          set({
            token: accessToken,
            isAuthenticated: !!get().user,
          });

          return accessToken;
        } catch (err) {
          console.error("Refresh token failed:", err);
          get().logout();
          return null;
        }
      },


      initializeAuth: async () => {
        const { token, user } = get();

        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        if (isTokenExpired(token)) {
          try {
            const newToken = await get().refreshAccessToken();
            set({
              token: newToken,
              isAuthenticated: !!user,
            });
          } catch {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
        } else {
          set({ isAuthenticated: true });
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
          console.log("Auth store rehydrated");
          // Chỉ set flag hydrated, để initializeAuth xử lý token refresh
          // Tránh duplicate refresh token requests
        }
        state?.setHasHydrated(true);
      },
    }
  )
);