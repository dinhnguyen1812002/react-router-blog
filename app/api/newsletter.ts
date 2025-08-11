
// services/newsletterService.js
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '~/config/axios';
interface subscribe {
    name?: string
    email: string
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
export const getAllSubscribers = async ({ page = 0, size = 10 } = {}) => {
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
export const getActiveSubscribers = async ({ page = 0, size = 10 } = {}) => {
  const response = await axiosInstance.get('/newsletter/subscribers/active', {
    params: { page, size }
  });
  return response.data;
};

/**
 * Get count of active subscribers (Admin only)
 */
export const getActiveSubscribersCount = async () => {
  const response = await axiosInstance.get('/newsletter/subscribers/count');
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
// export const useGetAllSubscribers = (params = {}, options = {}) => {
//   return useQuery({
//     queryKey: ['newsletter', 'subscribers', 'all', params],
//     queryFn: () => getAllSubscribers(params),
//     enabled: !!options.enabled, // Only run if explicitly enabled (for admin)
//     ...options,
//   });
// };

/**
 * Hook for getting active subscribers (Admin)
 */
// export const useGetActiveSubscribers = (params = {}, options = {}) => {
//   return useQuery({
//     queryKey: ['newsletter', 'subscribers', 'active', params],
//     queryFn: () => getActiveSubscribers(params),
//     enabled: !!options.enabled, // Only run if explicitly enabled (for admin)
//     ...options,
//   });
// };

/**
 * Hook for getting active subscribers count (Admin)
 */
// export const useGetActiveSubscribersCount = (options = {}) => {
//   return useQuery({
//     queryKey: ['newsletter', 'subscribers', 'count'],
//     queryFn: getActiveSubscribersCount,
//     enabled: !!options.enabled, // Only run if explicitly enabled (for admin)
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     cacheTime: 10 * 60 * 1000, // 10 minutes
//     ...options,
//   });
// };

// ==================== Query Keys ====================
// export const newsletterKeys = {
//   all: ['newsletter'],
//   subscribers: () => [...newsletterKeys.all, 'subscribers'],
//   subscribersAll: (params) => [...newsletterKeys.subscribers(), 'all', params],
//   subscribersActive: (params) => [...newsletterKeys.subscribers(), 'active', params],
//   subscribersCount: () => [...newsletterKeys.subscribers(), 'count'],
// };