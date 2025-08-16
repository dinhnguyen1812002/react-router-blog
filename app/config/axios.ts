import axios from 'axios';
import { useAuthStore } from '~/store/authStore';
import { handleAuthError } from '~/lib/auth-utils';
import { env } from './env';

const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!config.headers.Authorization,
        tokenLength: token?.length || 0,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Handle authentication errors (401 Unauthorized, 403 Forbidden)
    if (error.response?.status === 401 ) {
      console.log(`🔒 Authentication failed (${error.response.status}), clearing session...`);

      // Use centralized auth error handler
      handleAuthError(error);

      // Also clear auth store
      const { logout } = useAuthStore.getState();
      logout();
    }

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;