// services/newsletterService.js
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '~/config/axios';

interface subscribe {
    name?: string
    email: string
}

// TypeScript interfaces
export interface Subscriber {
  id: number;
  email: string;
  name?: string;
  status: 'active' | 'pending' | 'unsubscribed';
  subscribedAt: string;
  confirmedAt?: string;
}

export interface PaginatedSubscribers {
  content: Subscriber[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface NewsletterData {
  subject: string;
  content: string;
  recipientType: 'all' | 'active';
}

export interface UpdateStatusData {
  email: string;
  status: 'active' | 'unsubscribed' | 'pending';
}

// ==================== API Functions ====================

/**
 * Subscribe to newsletter
 * @param {Object} data - Subscription data
 * @param {string} data.email - Email address (required)
 * @param {string} [data.name] - Name (optional)
 */
export const subscribeNewsletter = async (data : subscribe) => {
  const response = await axiosInstance.post('/newsletter/subscribe', data);
  return response.data;
};

/**
 * Confirm newsletter subscription
 * @param {string} token - Confirmation token
 */
export const confirmSubscription = async (token: string) => {
  const response = await axiosInstance.get(`/newsletter/confirm?token=${token}`);
  return response.data;
};

/**
 * Unsubscribe from newsletter
 * @param {string} token - Unsubscribe token
 */
export const unsubscribeNewsletter = async (token: string) => {
  const response = await axiosInstance.get(`/newsletter/unsubscribe?token=${token}`);
  return response.data;
};

// ==================== Admin API Functions ====================

/**
 * Get all subscribers (Admin only)
 * @param {Object} params - Query parameters
 * @param {number} [params.page=0] - Page number
 * @param {number} [params.size=10] - Page size
 */
export const getAllSubscribers = async ({ page = 0, size = 10 } = {}): Promise<PaginatedSubscribers> => {
  const response = await axiosInstance.get('/newsletter/subscribers', {
    params: { page, size }
  });
  return response.data;
};

/**
 * Get active subscribers only (Admin only)
 * @param {Object} params - Query parameters
 * @param {number} [params.page=0] - Page number
 * @param {number} [params.size=10] - Page size
 */
export const getActiveSubscribers = async ({ page = 0, size = 10 } = {}): Promise<PaginatedSubscribers> => {
  const response = await axiosInstance.get('/newsletter/subscribers/active', {
    params: { page, size }
  });
  return response.data;
};

/**
 * Get count of active subscribers (Admin only)
 */
export const getActiveSubscribersCount = async (): Promise<number> => {
  const response = await axiosInstance.get('/newsletter/subscribers/count');
  return response.data;
};

/**
 * Send newsletter to subscribers (Admin only)
 * @param {Object} data - Newsletter data
 * @param {string} data.subject - Email subject
 * @param {string} data.content - Email content (HTML)
 * @param {string} data.recipientType - 'all' or 'active'
 */
export const sendNewsletter = async (data: NewsletterData) => {
  const response = await axiosInstance.post('/newsletter/send', data);
  return response.data;
};

/**
 * Resend confirmation email (Admin only)
 * @param {string} email - Email address to resend confirmation
 */
export const resendConfirmation = async (email: string) => {
  const response = await axiosInstance.post('/newsletter/resend-confirmation', { email });
  return response.data;
};

/**
 * Update subscriber status (Admin only)
 * @param {Object} data - Update data
 * @param {string} data.email - Email address
 * @param {string} data.status - New status ('active', 'unsubscribed', 'pending')
 */
export const updateSubscriberStatus = async (data: UpdateStatusData) => {
  const response = await axiosInstance.put('/newsletter/subscriber/status', data);
  return response.data;
};

// ==================== React Query Hooks ====================

/**
 * Hook for newsletter subscription
 */
export const useSubscribeNewsletter = (options = {}) => {
  return useMutation({
    mutationFn: subscribeNewsletter,
    mutationKey: ['newsletter', 'subscribe'],
    ...options,
  });
};

/**
 * Hook for confirming subscription
 */
export const useConfirmSubscription = (options = {}) => {
  return useMutation({
    mutationFn: confirmSubscription,
    mutationKey: ['newsletter', 'confirm'],
    ...options,
  });
};

/**
 * Hook for unsubscribing
 */
export const useUnsubscribeNewsletter = (options = {}) => {
  return useMutation({
    mutationFn: unsubscribeNewsletter,
    mutationKey: ['newsletter', 'unsubscribe'],
    ...options,
  });
};

// ==================== Admin Hooks ====================

/**
 * Hook for getting all subscribers (Admin)
 */
export const useGetAllSubscribers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['newsletter', 'subscribers', 'all', params],
    queryFn: () => getAllSubscribers(params),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

/**
 * Hook for getting active subscribers (Admin)
 */
export const useGetActiveSubscribers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['newsletter', 'subscribers', 'active', params],
    queryFn: () => getActiveSubscribers(params),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

/**
 * Hook for getting active subscribers count (Admin)
 */
export const useGetActiveSubscribersCount = (options = {}) => {
  return useQuery({
    queryKey: ['newsletter', 'subscribers', 'count'],
    queryFn: getActiveSubscribersCount,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook for sending newsletter (Admin)
 */
export const useSendNewsletter = (options = {}) => {
  return useMutation({
    mutationFn: sendNewsletter,
    mutationKey: ['newsletter', 'send'],
    ...options,
  });
};

/**
 * Hook for resending confirmation (Admin)
 */
export const useResendConfirmation = (options = {}) => {
  return useMutation({
    mutationFn: resendConfirmation,
    mutationKey: ['newsletter', 'resend-confirmation'],
    ...options,
  });
};

/**
 * Hook for updating subscriber status (Admin)
 */
export const useUpdateSubscriberStatus = (options = {}) => {
  return useMutation({
    mutationFn: updateSubscriberStatus,
    mutationKey: ['newsletter', 'update-status'],
    ...options,
  });
};

// ==================== Query Keys ====================
export const newsletterKeys = {
  all: ['newsletter'],
  subscribers: () => [...newsletterKeys.all, 'subscribers'],
  subscribersAll: (params: any) => [...newsletterKeys.subscribers(), 'all', params],
  subscribersActive: (params : any) => [...newsletterKeys.subscribers(), 'active', params],
  subscribersCount: () => [...newsletterKeys.subscribers(), 'count'],
};