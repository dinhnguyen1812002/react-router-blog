import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "~/store/authStore";
import { env } from "./env";

// =============================================
// Axios Instance Configuration
// =============================================
const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  withCredentials: true, // Required for cookies (refreshToken)
  headers: {
    "Content-Type": "application/json"
  },
});

// =============================================
// Request Interceptor: Attach Access Token
// =============================================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useAuthStore.getState();

    // Don't attach Authorization header for refresh token requests
    // (backend chỉ cần refresh token cookie)
    if (isRefreshTokenRequest(config)) {
      return config;
    }

    // Attach access token to Authorization header for other requests
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// =============================================
// Response Interceptor: Handle 401 & Token Refresh
// =============================================

// Global refresh state management
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Queue for failed requests during token refresh
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}
let failedQueue: QueueItem[] = [];

/**
 * Process all queued requests after token refresh
 */
const processQueue = (error: any = null, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Check if request should be retried after 401
 */
const shouldRetryRequest = (config: InternalAxiosRequestConfig | undefined): boolean => {
  if (!config?.url) return false;

  // Don't retry auth-related requests
const AUTH_PATHS = [
  '/api/v1/auth/refresh-token',
  '/api/v1/auth/login',
  '/api/v1/auth/logout',
  '/api/v1/auth/register'
];

  return !AUTH_PATHS.some(path => config.url?.includes(path));
};

/**
 * Check if request is refresh token request
 */
const isRefreshTokenRequest = (config: InternalAxiosRequestConfig | undefined): boolean => {
  return config?.url?.includes('/auth/refresh-token') || false;
};

/**
 * Refresh access token using the refresh token cookie
 */
const refreshAccessToken = async (): Promise<string> => {
  const { refreshAccessToken: storeRefresh } = useAuthStore.getState();

  try {
    const newToken = await storeRefresh();

    if (!newToken) {
      throw new Error("Failed to refresh token");
    }

    return newToken;
  } catch (error) {
    console.error("Token refresh failed in interceptor:", error);
    throw error;
  }
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {

      // Check if request should be retried
      if (!shouldRetryRequest(originalRequest)) {
        return Promise.reject(error);
      }

      // Check if already retried
      if (originalRequest._retry) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      // Mark request as retried
      originalRequest._retry = true;

      // If refresh is already in progress, queue this request
      if (isRefreshing && refreshPromise) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      // Start token refresh
      isRefreshing = true;
      // Create refresh promise
      refreshPromise = refreshAccessToken();

      try {
        const newToken = await refreshPromise;

        // Process all queued requests with new token
        processQueue(null, newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error("Token refresh failed, logging out user");

        // Process queue with error
        processQueue(refreshError, null);

        // Logout user
        useAuthStore.getState().logout();

        return Promise.reject(refreshError);

      } finally {
        // Reset refresh state
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      const url = error.config?.url || '';

      // If refresh token endpoint returns 403, logout immediately
      if (url.includes('/auth/refresh-token')) {
        const { user, isAuthenticated } = useAuthStore.getState();

        // During app initialization it's normal to probe refresh-token without an authenticated user.
        // Only force-logout if we actually have an authenticated session.
        if (user || isAuthenticated) {
          console.error("Refresh token invalid or expired, logging out");
          useAuthStore.getState().logout();
        }
      }
    }

    // Development error logging
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        message: (error.response?.data as any)?.message || error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;