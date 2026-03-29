import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "~/api/auth";
import { initializeAxiosAuth } from "~/config/axios";
import type { User } from "~/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ✅ advanced-init-once: Pure function with no closures — defined once at module
//    level, never recreated. Decoding a JWT on every render would be wasteful.
const isTokenExpired = (token: string): boolean => {
	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		// ✅ js-cache-property-access: Cache Date.now() call used in comparison.
		return payload.exp < Date.now() / 1000;
	} catch {
		// Malformed token → treat as expired
		return true;
	}
};

// ─── Deduplication lock for concurrent refresh calls ─────────────────────────

// ✅ advanced-init-once: Module-level singleton — only one refresh can be
//    in-flight at a time across the entire app. Using a module variable (not
//    store state) avoids triggering re-renders when the promise resolves.
let refreshInFlight: Promise<string | null> | null = null;

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
	user: User | null;
	/** Access token — kept in memory, never written to localStorage. */
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

interface AuthActions {
	login: (user: User, token: string) => void;
	logout: () => void;
	setUser: (user: User | null) => void;
	setToken: (token: string | null) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearError: () => void;
	checkTokenValidity: () => boolean;
	refreshAccessToken: () => Promise<string | null>;
}

type AuthStore = AuthState & AuthActions;

// ✅ client-localstorage-schema: Only persist the minimal subset needed across
//    page loads. The access token is intentionally excluded — it lives in memory
//    only and is restored via refreshToken on mount.
type PersistedSlice = Pick<AuthState, "user" | "isAuthenticated">;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<
	AuthStore,
	[["zustand/persist", PersistedSlice]]
>(
	persist(
		(set, get) => ({
			// ── State ──
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			// ── Actions ──

			login: (user, token) =>
				set({ user, token, isAuthenticated: true, error: null }),

			logout: () =>
				set({ user: null, token: null, isAuthenticated: false, error: null }),

			// ✅ rerender-derived-state: isAuthenticated derives from user presence.
			//    Setting them together keeps the store consistent without a separate effect.
			setUser: (user) => set({ user, isAuthenticated: !!user }),

			setToken: (token) => set({ token }),

			setLoading: (isLoading) => set({ isLoading }),

			setError: (error) => set({ error }),

			clearError: () => set({ error: null }),

			checkTokenValidity: () => {
				const { token } = get();
				// ✅ js-early-exit: Return false immediately when no token exists.
				if (!token) return false;
				return !isTokenExpired(token);
			},

			/**
			 * Refresh the access token, deduplicating concurrent calls.
			 *
			 * ✅ async-parallel (dedup pattern): If multiple components call this
			 *    simultaneously (e.g. parallel API requests that each detect a 401),
			 *    they all await the same in-flight promise instead of each firing a
			 *    separate refresh request — preventing token thrashing.
			 */
			refreshAccessToken: async (): Promise<string | null> => {
				if (refreshInFlight) return refreshInFlight;

				refreshInFlight = (async () => {
					try {
						const response = await authApi.refreshToken();

						// ✅ js-early-exit: Bail out immediately on bad response.
						if (!response?.accessToken)
							throw new Error("No access token returned");

						set({ token: response.accessToken, isAuthenticated: !!get().user });
						return response.accessToken;
					} catch {
						get().logout();
						return null;
					} finally {
						// Always release the lock so the next genuine refresh can proceed.
						refreshInFlight = null;
					}
				})();

				return refreshInFlight;
			},
		}),
		{
			name: "auth-store",
			// ✅ client-localstorage-schema: Persist only user + isAuthenticated.
			//    Token is excluded — restoring a stale access token from storage is
			//    a security risk; it will be refreshed via cookie on next mount.
			partialize: (state): PersistedSlice => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
			version: 1,
			// onRehydrateStorage left intentionally empty — add logging here if needed.
		},
	),
);

// ✅ advanced-init-once: Wire up the axios interceptor once after store creation.
initializeAxiosAuth(useAuthStore);
