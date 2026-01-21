import type { AxiosError } from "axios";
import { markIcons } from "~/components/tiptap-ui/mark-button";
import axiosInstance from "~/config/axios";

export interface Notification {
  notificationId: string;
  title: string;
  isRead: boolean;
  message: string;
  type: string;
  createdAt: string;
}

export const notify = {
  /**
   * Get all notifications for the authenticated user
   * Backend endpoint: GET /api/v1/notifications
   */
getNotify: async (): Promise<Notification[]> => {
  try {
    const response = await axiosInstance.get<Notification[]>("/notifications");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;

    if (err.response?.status === 403) {
   
      return []; // hoặc null nếu bạn muốn
    }

    // các lỗi khác vẫn throw
    throw error;
  }
},

  /**
   * Mark a notification as read
   * Backend endpoint: PUT /api/v1/notifications/{id}/read
   * @returns Updated notification object
   */
  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await axiosInstance.put<Notification>(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read for the authenticated user
   * Backend endpoint: PUT /api/v1/notifications/read-all
   */
  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.put("/notifications/read-all");
  },

  markAsUnread: async (notificationId: string): Promise<void> => {
    await axiosInstance.post(`/notifications/${notificationId}/unread`);
  },

  markAsUntransferable: async (notificationId: string): Promise<void> => {
    await axiosInstance.post(`/notifications/${notificationId}/untransferable`);
  },
};
