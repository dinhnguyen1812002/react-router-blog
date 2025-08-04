import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '~/store/authStore';
import { authApi, type LoginRequest, type RegisterRequest, type LoginResponse } from '~/api/auth';
import { storage } from '~/lib/storage';

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
    setToken,
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

      // Extract user and token from response
      const { id, username, email, roles, accessToken } = response;
      const user = { id, username, email, roles };

      console.log('✅ Login successful:', {
        user,
        token: accessToken ? accessToken.substring(0, 20) + '...' : 'None',
        fullTokenLength: accessToken ? accessToken.length : 0
      });

      // Update store first (this will trigger Zustand persistence)
      setAuthState(user, accessToken);

      // Then update local storage for compatibility
      storage.setToken(accessToken);
      storage.setUser(user);

      // Verify token was saved in all locations
      const savedToken = storage.getToken();
      const zustandStorage = localStorage.getItem('auth-storage');
      console.log('🔍 Token verification:', {
        tokenSaved: !!savedToken,
        tokensMatch: savedToken === accessToken,
        zustandHasToken: zustandStorage ? JSON.parse(zustandStorage).state?.token?.length > 0 : false
      });

      // Check for return URL or pending comment
      const returnUrl = location.state?.returnUrl;
      const pendingComment = localStorage.getItem('pendingComment');

      if (returnUrl) {
        // Redirect back to the original page
        navigate(returnUrl, { replace: true });
      } else if (pendingComment) {
        // If there's a pending comment, try to redirect to that post
        try {
          const commentData = JSON.parse(pendingComment);
          navigate(`/posts/${commentData.postId}`, { replace: true });
        } catch (error) {
          navigate('/', { replace: true });
        }
      } else {
        // Default redirect
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
  }, [setLoading, setError, setAuthState, navigate]);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response: LoginResponse = await authApi.register(userData);

      // Auto-login after successful registration
      const { id, username, email, roles, accessToken } = response;
      const user = { id, username, email, roles };

      console.log('✅ Registration successful, auto-logging in:', {
        user,
        token: accessToken ? accessToken.substring(0, 20) + '...' : 'None'
      });

      // Update store (this will trigger Zustand persistence)
      setAuthState(user, accessToken);

      // Update local storage for compatibility
      storage.setToken(accessToken);
      storage.setUser(user);

      // Get redirect URL from location state or default to dashboard
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
      console.log('🚪 Logging out...');
      // Call logout API if needed
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage first
      storage.clear();

      // Then clear state
      clearAuthState();

      console.log('✅ Logout complete');

      // Redirect to login
      navigate('/login', { replace: true });
    }
  }, [clearAuthState, navigate]);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authApi.getCurrentUser();

      if (response.success && response.data) {
        setUser(response.data);
        storage.setUser(response.data);
        return response.data;
      }
    } catch (error: any) {
      console.error('Get current user error:', error);
      // If unauthorized, logout
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser, logout]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.forgotPassword({ email });
      
      if (response.success) {
        return { success: true, message: response.message || 'Email đặt lại mật khẩu đã được gửi' };
      } else {
        throw new Error(response.message || 'Gửi email thất bại');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Gửi email thất bại';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.resetPassword({ token, newPassword });
      
      if (response.success) {
        navigate('/login', {
          replace: true,
          state: { message: 'Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập.' }
        });
        return { success: true };
      } else {
        throw new Error(response.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Đặt lại mật khẩu thất bại';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, navigate]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    clearError,
  };
};
