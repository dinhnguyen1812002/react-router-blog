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
  refreshToken: string | null;
  isAuthenticated: boolean;

  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
}

interface AuthActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string, refreshToken: string | null) => void;
  logout: () => void;
  clearError: () => void;
  checkTokenValidity: () => boolean;
  setHasHydrated: (hydrated: boolean) => void;
  refreshAccessToken: () => Promise<string | null>;
  initializeAuth: () => Promise<void>;

}

type AuthStore = AuthState & AuthActions;

// =====================
// Store
// =====================
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ---- State ----
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      // ---- Actions ----
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      setHasHydrated: (hydrated: boolean) => set({ _hasHydrated: hydrated }),

      login: (user: User, token: string, refreshToken: string | null) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        console.log(" Logging out user...");
        clearAllAuthData();
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkTokenValidity: () => {
        const { token } = get();
        if (!token) return false;
        if (isTokenExpired(token)) {
          console.log(" Token expired");
          return false;
        }
        return true;
      },

      // ---- Refresh access token using refresh token ----
      refreshAccessToken: async () => {
        try {
          const storedRefreshToken = get().refreshToken;
          if (!storedRefreshToken) {
            throw new Error("No refresh token available");
          }
          const token = await authApi.refreshToken(storedRefreshToken);

          if (!token) throw new Error("No access token returned");

          // Cập nhật token vào store
          const currentUser = get().user;
          set({
            token,
            isAuthenticated: !!currentUser,
          });

          console.log("Token refreshed successfully");
          return token;
        } catch (error) {
          console.error("Refresh token failed:", error);
          get().logout();
          return null;
        }
      },

      // ---- Initialize auth ----
      initializeAuth: async () => {
        const { token, user } = get();
      
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
      
        // Nếu token hết hạn thì thử refresh
        if (isTokenExpired(token)) {
          try {
            const newToken = await get().refreshAccessToken();
            set({
              token: newToken,
              isAuthenticated: !!user,
            });
          } catch (err) {
            console.error("Token refresh failed:", err);
            set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
          }
        } else {
          // Token vẫn còn hạn => giữ trạng thái đăng nhập
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
        refreshToken: state.refreshToken,
      }),

    
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("Auth store rehydrated");
          
          // Nếu có token nhưng hết hạn, thử refresh
          if (state.token && isTokenExpired(state.token)) {
            console.log("Token expired on rehydration, attempting refresh...");
            
            // Thử refresh token
            state.refreshAccessToken().then((newToken) => {
              if (newToken) {
                console.log("Token refreshed successfully on rehydration");
                console.log(state.user?.avatar)
                state.isAuthenticated = true;
              } else {
                console.log("Token refresh failed, clearing state");
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
              }
            }).catch((error) => {
              console.error("Token refresh error:", error);
              state.user = null;
              state.token = null;
              state.refreshToken = null;
              state.isAuthenticated = false;
            });
          } else if (state.token) {
            // Token còn hạn, set authenticated
            state.isAuthenticated = true;
            console.log("Valid token found, user authenticated");
          } else {
            // Không có token
            state.isAuthenticated = false;
            console.log(" No token found, user not authenticated");
          }
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
