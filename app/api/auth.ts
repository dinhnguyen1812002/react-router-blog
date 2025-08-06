import { Avatar } from './../components/ui/Avatar';
import axiosInstance from "~/config/axios";
import { useAuthStore } from '~/store/authStore';
import type {
  User,
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  ProfileUser,
} from "~/types";

export interface LoginRequest {
  email: string;
  password: string;
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
    const response = await axiosInstance.post('/auth/login', credentials);
    
    const { user, token, refreshToken } = response.data;
    
    // Save to store
    useAuthStore.getState().login(user, token);
    
    // Save refresh token separately if provided
    if (refreshToken && typeof window !== 'undefined') {
      localStorage.setItem('refresh-token', refreshToken);
    }
    
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  // Get current user info
  // getCurrentUser: async (): Promise<ApiResponse<User>> => {
  //   const response = await axiosInstance.get("/users/me");
  //   return response.data;
  // },

  // Forgot password
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.post("/auth/forgot-password", data);
    return response.data;
  },

  // Reset password
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.post("/auth/reset-password", data);
    return response.data;
  },

  // Update password
  updatePassword: async (
    data: UpdatePasswordRequest
  ): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.post("/users/update-password", data);
    return response.data;
  },

  // Logout (if needed for server-side logout)
 async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      useAuthStore.getState().logout();
    }
  },

  // Update profile
  updateProfile: async (data: any): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post("/user/update-profile", data);
    return response.data;
  },


 profile: async (): Promise<ApiResponse<ProfileUser>> => {
  const response = await axiosInstance.get<ProfileUser>("/user/profile");
  return {
    data: response.data,
    success: true,
    message: "ok",
    slug: response.data.username,
  };
},
changePassword: async (data: UpdatePasswordRequest): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.post("/user/change-password", data);
  return response.data;
},

};

