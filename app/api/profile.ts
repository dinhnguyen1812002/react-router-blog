import { apiClient } from "./client";
import type {
    UserProfileResponse,
    UpdateProfileRequest,
    AvatarUploadResponse
} from "~/types";

export const profileApi = {
    // Update custom profile markdown
    updateProfileMarkdown: async (markdownContent: string) => {
        const response = await apiClient.put<UserProfileResponse>('/profile', {
            markdownContent
        });
        return response.data;
    },

    // Get profile by username (public)
    getProfileByUsername: async (username: string) => {
        const response = await apiClient.get<UserProfileResponse>(`/profile/${username}`);
        return response.data;
    },

    // Update full profile
    updateProfile: async (data: UpdateProfileRequest) => {
        const response = await apiClient.put<UserProfileResponse>('/profile/profile', data);
        return response.data;
    },

    // Patch profile (partial update)
    patchProfile: async (data: Partial<UpdateProfileRequest>) => {
        const response = await apiClient.patch<UserProfileResponse>('/profile/profile', data);
        return response.data;
    },

    // Upload avatar
    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<AvatarUploadResponse>('/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get current user profile
    getCurrentProfile: async () => {
        const response = await apiClient.get<UserProfileResponse>('/profile/profile');
        return response.data;
    },

    // Get profile by ID (public)
    getProfileById: async (userId: string) => {
        const response = await apiClient.get<UserProfileResponse>(`/profile/profile/${userId}`);
        return response.data;
    },
};
