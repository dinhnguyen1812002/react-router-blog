import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "~/types";
import { authApi } from "~/api/auth";

// =====================
// Helper: check token expiration
// =====================
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

 let refreshInFlight: Promise<string | null> | null = null;



interface AuthState {
  user: User | null;
  token: string | null; // access token - stored in memory only
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  checkTokenValidity: () => boolean;
  refreshAccessToken: () => Promise<string | null>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore, [["zustand/persist", { user: User | null; isAuthenticated: boolean }]]>(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),

      login: (user: User, accessToken: string) => {
      
        set({
          user,
          token: accessToken,
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
      },

      checkTokenValidity: () => {
        const { token } = get();
        if (!token) return false;
        return !isTokenExpired(token);
      },


      refreshAccessToken: async (): Promise<string | null> => {
        if (refreshInFlight) return refreshInFlight;

        refreshInFlight = (async () => {
          try {
            const response = await authApi.refreshToken();
            if (!response?.accessToken) throw new Error("No new access token returned");
            const { accessToken } = response;

            set({
              token: accessToken,
              isAuthenticated: !!get().user,
            });

            return accessToken;
          } catch (err) {
           
            get().logout();
            return null;
          } finally {
            refreshInFlight = null;
          }
        })();

        return refreshInFlight;
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string | null) => {
        set({ token });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,  // user object already contains slug
        isAuthenticated: state.isAuthenticated,
      }),
      version: 1,
      onRehydrateStorage: () => (state, action) => {},
    }
  )
);