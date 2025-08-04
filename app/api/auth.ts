import axiosInstance from "~/config/axios";
import type {
  User,
  ApiResponse,
  LoginResponse,
  RegisterResponse,
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

export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  // Get current user info
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },

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
  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
  },
};
