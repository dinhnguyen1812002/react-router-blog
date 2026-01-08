import type { promises } from "dns";
import { apiClient } from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  Post,
  ProfileUser,
  UserProfileResponse,
} from "~/types";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  location?: string;
  websiteUrl?: string;
  githubUrl?: string;
  createdAt: string;
  stats?: {
    totalPosts: number;
    totalComments: number;
    totalBookmarks: number;
  };
}

export interface TopUser {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  postCount: number;
  socialMediaLinks?: Record<string, string>; // { "LINKEDIN": "...", "TWITTER": "..." }
}

export const userApi = {
  getProfile: async (username: string): Promise<UserProfileResponse> => {
    const response = await apiClient.get(`/users/profile/${username}`);
    return response.data;
  },

  updateProfile: async (
    profileData: Partial<UserProfile>,
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.put("/user/profile", profileData);
    return response.data;
  },

  // Update custom profile markdown content
  updateCustomProfile: async (
    markdownContent: string,
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.put("/users/profile/custom", {
      markdownContent,
    });
    return response.data;
  },

  getUserPosts: async (
    userId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get(
      `/user/${userId}/posts?page=${page}&size=${size}`,
    );
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.put("/user/change-password", passwordData);
    return response.data;
  },

  getTopUser: async (): Promise<TopUser[]> => {
    const res = await apiClient.get("/users/top-authors");
    return res.data; // vì API trả array trực tiếp
  },

  // NEW: Fetch public user by username
  getPublicUserByUsername: async (username: string): Promise<ProfileUser> => {
    const res = await apiClient.get(`/user/public/${username}`);
    console.log(res.data);
    return res.data;
  },
};
