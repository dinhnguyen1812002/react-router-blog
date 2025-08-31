import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "~/store/authStore";
import { env } from "./env";

const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ====== Request interceptor: attach access token ======
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("🚀 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!config.headers.Authorization,
        tokenLength: token?.length || 0,
      });
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ====== Response interceptor: handle 401 ======
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log("✅ API Response:", response.status, response.config.url);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const { logout, refreshToken } = useAuthStore.getState();

    // Nếu là 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh → đưa request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers["Authorization"] = "Bearer " + newToken;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken(); // gọi store
        if (!newToken) throw new Error("Refresh failed");

        processQueue(null, newToken);

        // Gắn token mới và retry
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout(); // Refresh fail → logout
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Log error trong dev
    if (process.env.NODE_ENV === "development") {
      console.error("❌ API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        message: (error.response?.data as any)?.message || error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
