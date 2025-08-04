import axios from 'axios';
import { storage } from '~/lib/storage';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8888/api/v1', // Sử dụng port 8888 theo docs
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    console.log('🔍 Checking for token...' + token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No token found for request');
    }

    // Debug logging
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      hasAuthHeader: !!config.headers.Authorization,
    });

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Debug logging
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message,
      headers: error.response?.headers
    });

    // Log specific error details for 403
    if (error.response?.status === 403) {
      console.error('🚫 403 Forbidden - Possible causes:');
      console.error('- Token is missing or invalid');
      console.error('- User does not have required permissions');
      console.error('- CORS configuration issue');
      console.error('- Backend security configuration issue');
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      storage.clear();

      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;