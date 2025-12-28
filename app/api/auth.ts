import axiosInstance from "~/config/axios";
import { useAuthStore } from "~/store/authStore";
import type {
  User,
  ApiResponse,
  LoginResponse,
  ProfileUser,
} from "~/types";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  username: string;
  email: string;
  bio: string;
  avatar: string;
}

export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post("/auth/login", credentials);

    const { user, token, refreshToken } = response.data;

    // Save user + access token vào store
    useAuthStore.getState().login(user, token);

    // Lưu refresh token vào sessionStorage (tạm thời cho đến khi backend set cookie)
    if (refreshToken) {
      sessionStorage.setItem('refreshToken', refreshToken);
      console.log("✅ Refresh token saved to sessionStorage");
    }

    // console.log(response.data)
    return response.data;
  },

  //Register
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  //Forgot password
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<any>> {
    const response = await axiosInstance.post("/auth/forgot-password", data);
    return response.data;
  },

  //Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<any>> {
    const response = await axiosInstance.post("/auth/reset-password", data);
    return response.data;
  },

  //Update password
  async updatePassword(
    data: UpdatePasswordRequest
  ): Promise<ApiResponse<any>> {
    const response = await axiosInstance.post("/users/update-password", data);
    return response.data;
  },

  //Logout (server xoá refresh token cookie)
  async logout(): Promise<void> {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Xoá refresh token từ sessionStorage
      sessionStorage.removeItem('refreshToken');
      useAuthStore.getState().logout();
    }
  },

  //Update profile
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    const response = await axiosInstance.put("/user/profile", data);
    return response.data;
  },

  //Get profile
  async profile(): Promise<ApiResponse<ProfileUser>> {
    const response = await axiosInstance.get<ProfileUser>("/user/profile");
    return {
      data: response.data,
      success: true,
      message: "ok",
      slug: response.data.username,
    };
  },

  //Change password
  async changePassword(
    data: UpdatePasswordRequest
  ): Promise<ApiResponse<any>> {
    const response = await axiosInstance.post("/user/change-password", data);
    return response.data;
  },


  // Refresh access token using refresh token cookie
  refreshToken: async () => {
    try {
    
      // Get current token if available (some backends require it)
      const { token } = useAuthStore.getState();

      const response = await axiosInstance.post(
        "/auth/refresh-token",
        {},
        {
          withCredentials: true,
          // If backend requires access token for refresh, include it
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const { accessToken, refreshToken } = response.data || {};

      if (!accessToken) {
        throw new Error("No new access token returned from server");
      }

  
      return { accessToken, refreshToken };
    } catch (error: any) {
      console.error("❌ Refresh token request failed:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
        headers: error.config?.headers,
      });
      throw error;
    }
  },

};
