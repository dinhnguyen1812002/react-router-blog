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
    useAuthStore.getState().login(user, token, refreshToken );
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

  //Refresh access token by sending refreshToken in body
  async refreshToken(refreshToken: string): Promise<string> {
    const res = await axiosInstance.post(
      "/auth/refresh-token",
      { refreshToken },
      { withCredentials: true }
    );

    const { token } = res.data; // backend trả về access token mới
    return token;
  },
};
