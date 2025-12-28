import { apiClient } from './client';
import type { PaginatedResponse } from '~/types';

export interface SubscribeRequest {
  email: string;
  name?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
  isConfirmed: boolean;
  subscribedAt: string;
  confirmedAt?: string | null;
  unsubscribedAt?: string | null;
}

// A relaxed page type to align với response mẫu trong tài liệu
export type SubscriberPage = PaginatedResponse<Subscriber> & Record<string, any>;

export const newsletterApi = {
  /**
   * Đăng ký nhận newsletter, trả về thông báo yêu cầu kiểm tra email.
   */
  subscribe: async (payload: SubscribeRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/newsletter/subscribe', payload);
    return response.data;
  },

  /**
   * Xác nhận đăng ký từ link trong email.
   */
  confirm: async (token: string): Promise<{ message: string }> => {
    const response = await apiClient.get('/newsletter/confirm', { params: { token } });
    return response.data;
  },

  /**
   * Hủy đăng ký bằng token có trong email.
   */
  unsubscribe: async (token: string): Promise<{ message: string }> => {
    const response = await apiClient.get('/newsletter/unsubscribe', { params: { token } });
    return response.data;
  },

  /**
   * Danh sách tất cả subscriber (bao gồm chưa xác nhận), có phân trang.
   */
  getSubscribers: async (page: number = 0, size: number = 10): Promise<SubscriberPage> => {
    const response = await apiClient.get<SubscriberPage>('/newsletter/subscribers', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Danh sách subscriber đã kích hoạt, có phân trang.
   */
  getActiveSubscribers: async (page: number = 0, size: number = 10): Promise<SubscriberPage> => {
    const response = await apiClient.get<SubscriberPage>('/newsletter/subscribers/active', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Tổng số subscriber đang hoạt động.
   */
  getActiveCount: async (): Promise<number> => {
    const response = await apiClient.get<number>('/newsletter/subscribers/count');
    return response.data;
  },
};