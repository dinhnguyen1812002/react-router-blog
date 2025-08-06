import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '~/store/authStore';
import { authApi, type LoginRequest, type RegisterRequest } from '~/api/auth';
import type { LoginResponse } from '~/types';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    login: setAuthState,
    logout: clearAuthState,
    clearError,
  } = useAuthStore();

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.login(credentials);
      const { id, username, email, roles, accessToken } = response;
      const usr = { id, username, email, roles };

      console.log('✅ Login successful:', {
        user: usr.username,
        token: accessToken ? accessToken.substring(0, 20) + '...' : 'None',
      });

      // Update store - Zustand's persist middleware handles localStorage
      setAuthState(usr, accessToken);

      // Handle redirection
      const returnUrl = location.state?.returnUrl;
      if (returnUrl) {
        navigate(returnUrl, { replace: true });
      } else {
        navigate('/', { replace: true });
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setAuthState, navigate, location]);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response: LoginResponse = await authApi.register(userData);
      const { id, username, email, roles, accessToken } = response;
      const user = { id, username, email, roles };

      console.log('✅ Registration successful, auto-logging in...');

      // Update store - Zustand's persist middleware handles localStorage
      setAuthState(user, accessToken);

      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });

      return { success: true, autoLogin: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setAuthState, navigate, location]);

  const logout = useCallback(async () => {
    try {
      // Call API to invalidate token on the server
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear state from Zustand store (which also clears localStorage via persist)
      clearAuthState();
      // Redirect to login page
      navigate('/login', { replace: true });
    }
  }, [clearAuthState, navigate]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
