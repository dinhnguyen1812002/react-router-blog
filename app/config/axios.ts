import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

// ─── Instance ─────────────────────────────────────────────────────────────────

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
	timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000"),
	withCredentials: true,
	headers: { "Content-Type": "application/json" },
});

let authStore: any = null;

export const initializeAxiosAuth = (store: any): void => {
	authStore = store;
};

const AUTH_SKIP_PATHS = new Set([
	"/auth/refresh-token",
	"/auth/login",
	"/auth/logout",
	"/auth/register",
	"/auth/oauth/login",
	"/auth/forgot-password",
	"/auth/reset-password",
]);

const REFRESH_PATH = "/auth/refresh-token";

const isRefreshTokenRequest = (
	config: InternalAxiosRequestConfig | undefined,
): boolean => config?.url?.includes(REFRESH_PATH) ?? false;

const shouldRetryRequest = (
	config: InternalAxiosRequestConfig | undefined,
): boolean => {
	if (!config?.url) return false;
	// ✅ js-set-map-lookups: O(1) Set.has() instead of Array.some() + includes()
	return !AUTH_SKIP_PATHS.has(config.url);
};

// ─── Token refresh queue ──────────────────────────────────────────────────────
let refreshInFlight: Promise<string> | null = null;

const getOrStartRefresh = (): Promise<string> => {
	if (refreshInFlight) return refreshInFlight;

	refreshInFlight = (async (): Promise<string> => {
		if (!authStore) throw new Error("Auth store not initialized");
		const newToken: string | null = await authStore
			.getState()
			.refreshAccessToken();
		if (!newToken) throw new Error("Token refresh returned null");
		return newToken;
	})();

	return refreshInFlight;
};

// ─── Request Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
	(config) => {
		if (!authStore || isRefreshTokenRequest(config)) return config;

		const token: string | null = authStore.getState().token;
		if (token) config.headers.Authorization = `Bearer ${token}`;

		return config;
	},
	(error) => Promise.reject(error),
);

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axiosInstance.interceptors.response.use(
	(response) => response,

	async (error: AxiosError) => {
		const originalRequest = error.config as RetryableConfig | undefined;
		const status = error.response?.status;

		if (status === 401) {
			if (!shouldRetryRequest(originalRequest) || originalRequest?._retry) {
				authStore?.getState().logout();
				return Promise.reject(error);
			}

			originalRequest!._retry = true;

			try {
				const newToken = await getOrStartRefresh();
				originalRequest!.headers.Authorization = `Bearer ${newToken}`;
				return axiosInstance(originalRequest!);
			} catch (refreshError) {
				authStore?.getState().logout();
				return Promise.reject(refreshError);
			}
		}

		// ── 403 Forbidden ───────────────────────────────────────────────────────
		if (status === 403 && originalRequest?.url?.includes(REFRESH_PATH)) {
			const { user, isAuthenticated } = authStore?.getState() ?? {};
			if (user || isAuthenticated) authStore?.getState().logout();
		}

		// ── Dev logging ─────────────────────────────────────────────────────────
		if (process.env.NODE_ENV === "development") {
			console.error("API Error:", {
				status,
				url: error.config?.url,
				method: error.config?.method,
				message: (error.response?.data as any)?.message ?? error.message,
			});
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
