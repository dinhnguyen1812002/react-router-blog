export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface PostNotification {
  postId: string;
  title: string;
  slug: string;
  excerpt: string;
  publicDate: string;
}

import { apiClient } from './client';
import { useAuthStore } from '~/store/authStore';
import type { ApiResponse, Tag } from '~/types';

/**
 * Get authentication token and ensure user is authenticated
 * Throws error if not authenticated
 */
const getAuthToken = (): string => {
  const { token, isAuthenticated } = useAuthStore.getState();
  if (!token || !isAuthenticated) {
    throw new Error('Authentication required. Please login first.');
  }
  return token;
};

export const notification = {
  
  /**
   * Get all notifications for the authenticated user
   * Requires authentication - Authorization header is explicitly added
   */
  getNotify: async (): Promise<Notification[]> => {
    const token = getAuthToken();
    const response = await apiClient.get<Notification[]>('/notifications', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Mark a specific notification as read
   * Requires authentication - Authorization header is explicitly added
   */
  markAsRead: async (id: string): Promise<Notification> => {
    const token = getAuthToken();
    const response = await apiClient.put<Notification>(`/notifications/${id}/read`, undefined, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Mark all notifications as read
   * Requires authentication - Authorization header is explicitly added
   */
  markAllAsRead: async (): Promise<void> => {
    const token = getAuthToken();
    await apiClient.put<void>(`/notifications/read-all`, undefined, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
 
};