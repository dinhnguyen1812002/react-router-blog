import { apiClient } from './client';
import type { ApiResponse } from '~/types';

// Raw API response interface
export interface AdminStatsResponse {
  totalUsers?: number;
  totalPosts?: number;
  totalTags?: number;
  totalCategories?: number;
  totalSubscribers?: number;
  userGrowth?: number;
  postGrowth?: number;
  subscriberGrowth?: number;
  monthlyTraffic?: number;
  trafficGrowth?: number;
}

// Processed stats interface for UI
export interface AdminStats {
  totalUsers: {
    value: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  totalPosts: {
    value: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  totalCategories: {
    value: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  totalTags: {
    value: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  newsletterSubscribers: {
    value: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  monthlyTraffic: {
    value: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
}

// Helper function to determine change type
const getChangeType = (change: number): 'increase' | 'decrease' | 'neutral' => {
  if (change > 0) return 'increase';
  if (change < 0) return 'decrease';
  return 'neutral';
};

// Helper function to transform raw API response to UI format
const transformStatsResponse = (data: AdminStatsResponse): AdminStats => {
  return {
    totalUsers: {
      value: data.totalUsers || 0,
      change: data.userGrowth || 0,
      changeType: getChangeType(data.userGrowth || 0),
      period: 'so với tháng trước',
    },
    totalPosts: {
      value: data.totalPosts || 0,
      change: data.postGrowth || 0,
      changeType: getChangeType(data.postGrowth || 0),
      period: 'so với tháng trước',
    },
    totalCategories: {
      value: data.totalCategories || 0,
      change: 0, // API doesn't provide category growth
      changeType: 'neutral',
      period: 'so với tháng trước',
    },
    totalTags: {
      value: data.totalTags || 0,
      change: 0, // API doesn't provide tag growth
      changeType: 'neutral',
      period: 'so với tháng trước',
    },
    newsletterSubscribers: {
      value: data.totalSubscribers || 0,
      change: data.subscriberGrowth || 0,
      changeType: getChangeType(data.subscriberGrowth || 0),
      period: 'so với tháng trước',
    },
    monthlyTraffic: {
      value: data.monthlyTraffic || 0,
      change: data.trafficGrowth || 0,
      changeType: getChangeType(data.trafficGrowth || 0),
      period: 'so với tháng trước',
    },
  };
};

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<AdminStatsResponse>(`/admin/analytics`);
    return transformStatsResponse(res.data);
  },

  getUsers: async (page: number = 0, size: number = 10) => {
    const response = await apiClient.get(`/admin/users?page=${page}&size=${size}`);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${userId}`);
  },

  updateUserRole: async (userId: string, roles: string[]): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/admin/users/${userId}/roles`, { roles });
    return response.data;
  },
};