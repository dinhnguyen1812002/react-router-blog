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

export interface OAuthLoginRequest {
  provider: 'google' | 'github' | 'discord';
  code?: string;
  token?: string;
}

export interface OAuthLoginResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  message?: string;
}

export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post("/auth/login", credentials, {
      withCredentials: true, // Để nhận refresh token cookie
    });

    const { user, token, accessToken } = response.data;
    const finalToken = accessToken || token;

   
    // Save user + access token vào store
    useAuthStore.getState().login(user, finalToken);

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
      console.log(" Logout successful, refresh token cookie cleared by server");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Chỉ cần clear Zustand store, cookie sẽ được server xử lý
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
    
      
      const response = await axiosInstance.post(
        "/auth/refresh-token",
        {},
        {
          withCredentials: true, // Gửi refresh token cookie
        }
      );

    
      // Backend mới trả về: { accessToken, refreshToken } trong response.data
      const responseData = response.data;
      const accessToken = responseData.accessToken || responseData.token;
      const refreshToken = responseData.refreshToken;

      if (!accessToken) {
        throw new Error("No new access token returned from server");
      }

  
      return { accessToken, refreshToken };
    } catch (error: any) {
      return ;
    }
  },

  // OAuth Login
  async oauthLogin(provider: 'google' | 'github' | 'discord', codeOrToken: string): Promise<OAuthLoginResponse> {
    try {
      console.log(`🔐 Sending OAuth login request for ${provider}`);
      
      const response = await axiosInstance.post("/auth/oauth/login", {
        provider,
        code: codeOrToken, // Can be either authorization code or access token
        token: codeOrToken // Some providers might use token instead
      }, {
        withCredentials: true, // To receive refresh token cookie
      });

      const { user, accessToken, token } = response.data;
      const finalToken = accessToken || token;

      if (user && finalToken) {
        // Save user + access token to store
        useAuthStore.getState().login(user, finalToken);
        
        return {
          success: true,
          user,
          accessToken: finalToken
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'OAuth login failed'
        };
      }
    } catch (error: any) {
      console.error(`❌ OAuth login error for ${provider}:`, error);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'OAuth login failed'
      };
    }
  },

};
