import { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "~/store/authStore";
import { authApi, type LoginRequest, type RegisterRequest } from "~/api/auth";
import type { LoginResponse } from "~/types";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    setLoading,
    setError,
    login: setAuthState,
    logout: clearAuthState,
    clearError,
    checkTokenValidity,
    refreshAccessToken,
  } = useAuthStore();

  // Check token validity periodically and auto-refresh
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const checkAndRefreshToken = async () => {
      if (!checkTokenValidity()) {
    
        try {
          const newToken = await refreshAccessToken();
          if (!newToken) {
         
            navigate("/login", { replace: true });
          } 
        } catch (error) {
          console.error("Token refresh error:", error);
          navigate("/login", { replace: true });
        }
      }
    };

    // Check immediately on mount
    checkAndRefreshToken();

    // Check periodically every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, token, checkTokenValidity, refreshAccessToken, navigate]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authApi.login(credentials);
        const { id, username, email, roles, avatar, token } = response;

        // Create user object from response data
        const usr = {
          id,
          username,
          email,
          roles,
          avatar,
          socialMediaLinks: [],
        };

        // Update store - token stored in memory only
        setAuthState(usr, token);

        // Handle redirection
        const returnUrl = location.state?.returnUrl;
        if (returnUrl) {
          navigate(returnUrl, { replace: true });
        } else {
          navigate("/", { replace: true });
        }

        return { success: true };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Đăng nhập thất bại";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setAuthState, navigate, location]
  );

  const register = useCallback(
    async (userData: RegisterRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response: LoginResponse = await authApi.register(userData);
        const { id, username, email, roles, avatar, token } = response;
        const user = {
          id,
          username,
          email,
          roles,
          avatar,
          socialMediaLinks: [],
        };

        console.log("Registration successful, auto-logging in...");

        // Update store - token stored in memory only
        setAuthState(user, token);

        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });

        return { success: true, autoLogin: true };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || "Đăng ký thất bại";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setAuthState, navigate, location]
  );

  const logout = useCallback(async () => {
    try {
      // Call API to invalidate token on the server
      await authApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear state from Zustand store (memory only)
      clearAuthState();
      // Redirect to login page
      navigate("/login", { replace: true });
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
