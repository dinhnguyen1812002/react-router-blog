// Enhanced Newsletter API with CRUD operations following author.ts patterns
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '~/config/axios';

interface SubscribeData {
    name?: string
    email: string
}

// TypeScript interfaces
export interface Subscriber {
  id: string;
  email: string;
  name?: string | null;
  status: 'active' | 'pending' | 'unsubscribed';
  subscribedAt: string;
  confirmedAt?: string | null;
  unsubscribedAt?: string | null;
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

// Enhanced interfaces for newsletter management following author.ts patterns
export interface NewsletterTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterCampaign {
  id: number;
  subject: string;
  content: string;
  recipientType: 'all' | 'active';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsletterTemplateRequest {
  name: string;
  subject: string;
  content: string;
  isDefault?: boolean;
}

export interface UpdateNewsletterTemplateRequest {
  name?: string;
  subject?: string;
  content?: string;
  isDefault?: boolean;
}

export interface CreateNewsletterCampaignRequest {
  subject: string;
  content: string;
  recipientType: 'all' | 'active';
  scheduledAt?: string;
  templateId?: number;
}

export interface UpdateNewsletterCampaignRequest {
  subject?: string;
  content?: string;
  recipientType?: 'all' | 'active';
  scheduledAt?: string;
  status?: 'draft' | 'scheduled' | 'sent' | 'failed';
}

export interface NewsletterAnalytics {
  totalSubscribers: number;
  activeSubscribers: number;
  pendingSubscribers: number;
  unsubscribedCount: number;
  campaignsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  subscriberGrowth: {
    period: string;
    count: number;
  }[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiSubscriber {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
  isConfirmed: boolean;
  subscribedAt: string;
  confirmedAt?: string | null;
  unsubscribedAt?: string | null;
}

export interface ApiPaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  numberOfElements: number;
  empty: boolean;
}

// ==================== API Functions ====================

/**
 * Subscribe to newsletter
 * @param {Object} data - Subscription data
 * @param {string} data.email - Email address (required)
 * @param {string} [data.name] - Name (optional)
 */
export const subscribeNewsletter = async (data: SubscribeData) => {
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
  const data: ApiPaginatedResponse<ApiSubscriber> = response.data;
  return {
    content: data.content.map((s) => ({
      id: s.id,
      email: s.email,
      name: s.name ?? null,
      status: s.unsubscribedAt ? 'unsubscribed' : (s.isConfirmed && s.isActive ? 'active' : 'pending'),
      subscribedAt: s.subscribedAt,
      confirmedAt: s.confirmedAt ?? null,
      unsubscribedAt: s.unsubscribedAt ?? null,
    })),
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    size: data.size,
    number: data.number,
    first: data.first,
    last: data.last,
  };
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
  const data: ApiPaginatedResponse<ApiSubscriber> = response.data;
  return {
    content: data.content.map((s) => ({
      id: s.id,
      email: s.email,
      name: s.name ?? null,
      status: s.unsubscribedAt ? 'unsubscribed' : (s.isConfirmed && s.isActive ? 'active' : 'pending'),
      subscribedAt: s.subscribedAt,
      confirmedAt: s.confirmedAt ?? null,
      unsubscribedAt: s.unsubscribedAt ?? null,
    })),
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    size: data.size,
    number: data.number,
    first: data.first,
    last: data.last,
  };
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

// ==================== Enhanced CRUD Operations (Following author.ts patterns) ====================

/**
 * Create newsletter template (Admin only)
 * Following the pattern from authorApi.createPost
 */
export const createNewsletterTemplate = async (data: CreateNewsletterTemplateRequest): Promise<ApiResponse<NewsletterTemplate>> => {
  try {
    const response = await axiosInstance.post('/newsletter/templates', data);
    console.log('✅ Create template success:', response.data);

    if (response.data && response.data.data) {
      return response.data;
    } else if (response.data) {
      return {
        data: response.data,
        message: 'Template created successfully',
        success: true
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('❌ Create template error:', error);
    throw error;
  }
};

/**
 * Update newsletter template (Admin only)
 * Following the pattern from authorApi.updatePost
 */
export const updateNewsletterTemplate = async (templateId: number, data: UpdateNewsletterTemplateRequest): Promise<ApiResponse<NewsletterTemplate>> => {
  try {
    const response = await axiosInstance.put(`/newsletter/templates/${templateId}`, data);
    console.log('✅ Update template success:', response.data);

    if (response.data && response.data.data) {
      return response.data;
    } else if (response.data) {
      return {
        data: response.data,
        message: 'Template updated successfully',
        success: true
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('❌ Update template error:', error);
    throw error;
  }
};

/**
 * Delete newsletter template (Admin only)
 * Following the pattern from authorApi.deletePost
 */
export const deleteNewsletterTemplate = async (templateId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/newsletter/templates/${templateId}`);
    console.log('✅ Delete template success:', templateId);
  } catch (error) {
    console.error('❌ Delete template error:', error);
    throw error;
  }
};

/**
 * Get newsletter template by ID (Admin only)
 * Following the pattern from authorApi.getPostById
 */
export const getNewsletterTemplateById = async (templateId: number): Promise<ApiResponse<NewsletterTemplate>> => {
  try {
    const response = await axiosInstance.get(`/newsletter/templates/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Get template error:', error);
    throw error;
  }
};

/**
 * Get all newsletter templates (Admin only)
 */
export const getNewsletterTemplates = async (page: number = 0, size: number = 10): Promise<PaginatedResponse<NewsletterTemplate>> => {
  try {
    const response = await axiosInstance.get('/newsletter/templates', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get templates error:', error);
    throw error;
  }
};

/**
 * Create newsletter campaign (Admin only)
 */
export const createNewsletterCampaign = async (data: CreateNewsletterCampaignRequest): Promise<ApiResponse<NewsletterCampaign>> => {
  try {
    const response = await axiosInstance.post('/newsletter/campaigns', data);
    console.log('✅ Create campaign success:', response.data);

    if (response.data && response.data.data) {
      return response.data;
    } else if (response.data) {
      return {
        data: response.data,
        message: 'Campaign created successfully',
        success: true
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('❌ Create campaign error:', error);
    throw error;
  }
};

/**
 * Update newsletter campaign (Admin only)
 */
export const updateNewsletterCampaign = async (campaignId: number, data: UpdateNewsletterCampaignRequest): Promise<ApiResponse<NewsletterCampaign>> => {
  try {
    const response = await axiosInstance.put(`/newsletter/campaigns/${campaignId}`, data);
    console.log('✅ Update campaign success:', response.data);

    if (response.data && response.data.data) {
      return response.data;
    } else if (response.data) {
      return {
        data: response.data,
        message: 'Campaign updated successfully',
        success: true
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('❌ Update campaign error:', error);
    throw error;
  }
};

/**
 * Delete newsletter campaign (Admin only)
 */
export const deleteNewsletterCampaign = async (campaignId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/newsletter/campaigns/${campaignId}`);
    console.log('✅ Delete campaign success:', campaignId);
  } catch (error) {
    console.error('❌ Delete campaign error:', error);
    throw error;
  }
};

/**
 * Get newsletter campaign by ID (Admin only)
 */
export const getNewsletterCampaignById = async (campaignId: number): Promise<ApiResponse<NewsletterCampaign>> => {
  try {
    const response = await axiosInstance.get(`/newsletter/campaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Get campaign error:', error);
    throw error;
  }
};

/**
 * Get all newsletter campaigns (Admin only)
 */
export const getNewsletterCampaigns = async (page: number = 0, size: number = 10): Promise<PaginatedResponse<NewsletterCampaign>> => {
  try {
    const response = await axiosInstance.get('/newsletter/campaigns', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get campaigns error:', error);
    throw error;
  }
};

/**
 * Send newsletter campaign (Admin only)
 */
export const sendNewsletterCampaign = async (campaignId: number): Promise<ApiResponse<NewsletterCampaign>> => {
  try {
    const response = await axiosInstance.post(`/newsletter/campaigns/${campaignId}/send`);
    console.log('✅ Send campaign success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Send campaign error:', error);
    throw error;
  }
};

/**
 * Get newsletter analytics (Admin only)
 */
export const getNewsletterAnalytics = async (): Promise<ApiResponse<NewsletterAnalytics>> => {
  try {
    const response = await axiosInstance.get('/newsletter/analytics');
    return response.data;
  } catch (error) {
    console.error('❌ Get analytics error:', error);
    throw error;
  }
};

/**
 * Delete subscriber (Admin only)
 */
export const deleteSubscriber = async (subscriberId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/newsletter/subscribers/${subscriberId}`);
    console.log('✅ Delete subscriber success:', subscriberId);
  } catch (error) {
    console.error('❌ Delete subscriber error:', error);
    throw error;
  }
};

/**
 * Bulk delete subscribers (Admin only)
 */
export const bulkDeleteSubscribers = async (subscriberIds: string[]): Promise<void> => {
  try {
    await axiosInstance.delete('/newsletter/subscribers/bulk', {
      data: { subscriberIds }
    });
    console.log('✅ Bulk delete subscribers success:', subscriberIds);
  } catch (error) {
    console.error('❌ Bulk delete subscribers error:', error);
    throw error;
  }
};

/**
 * Export subscribers (Admin only)
 */
export const exportSubscribers = async (format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(`/newsletter/subscribers/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('❌ Export subscribers error:', error);
    throw error;
  }
};

// ==================== Query Keys ====================

export const newsletterKeys = {
  all: ['newsletter'] as const,
  subscribers: () => [...newsletterKeys.all, 'subscribers'] as const,
  subscribersCount: () => [...newsletterKeys.all, 'subscribers', 'count'] as const,
  templates: () => [...newsletterKeys.all, 'templates'] as const,
  campaigns: () => [...newsletterKeys.all, 'campaigns'] as const,
  analytics: () => [...newsletterKeys.all, 'analytics'] as const,
};

// ==================== React Query Hooks ====================

/**
 * Hook to subscribe to newsletter
 */
export const useSubscribeNewsletter = (options?: any) => {
  return useMutation({
    mutationFn: subscribeNewsletter,
    ...options,
  });
};

/**
 * Hook to resend confirmation email (Admin only)
 */
export const useResendConfirmation = (options?: any) => {
  return useMutation({
    mutationFn: resendConfirmation,
    ...options,
  });
};

/**
 * Hook to confirm subscription
 */
export const useConfirmSubscription = (options?: any) => {
  return useMutation({
    mutationFn: confirmSubscription,
    ...options,
  });
};

/**
 * Hook to unsubscribe from newsletter
 */
export const useUnsubscribeNewsletter = (options?: any) => {
  return useMutation({
    mutationFn: unsubscribeNewsletter,
    ...options,
  });
};

/**
 * Hook to get all subscribers (Admin only)
 */
export const useGetAllSubscribers = (params: { page: number; size: number }, options?: any) => {
  return useQuery<PaginatedSubscribers>({
    queryKey: ['newsletter', 'subscribers', params.page, params.size],
    queryFn: () => getAllSubscribers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to get active subscribers only (Admin only)
 */
export const useGetActiveSubscribers = (params: { page: number; size: number }, options?: any) => {
  return useQuery<PaginatedSubscribers>({
    queryKey: ['newsletter', 'subscribers', 'active', params.page, params.size],
    queryFn: () => getActiveSubscribers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to get active subscribers count (Admin only)
 */
export const useGetActiveSubscribersCount = (options?: any) => {
  return useQuery({
    queryKey: ['newsletter', 'subscribers', 'count'],
    queryFn: getActiveSubscribersCount,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to send newsletter (Admin only)
 */
export const useSendNewsletter = (options?: any) => {
  return useMutation({
    mutationFn: sendNewsletter,
    ...options,
  });
};

/**
 * Hook to update subscriber status (Admin only)
 */
export const useUpdateSubscriberStatus = (options?: any) => {
  return useMutation({
    mutationFn: updateSubscriberStatus,
    ...options,
  });
};

/**
 * Hook to create newsletter template (Admin only)
 */
export const useCreateNewsletterTemplate = () => {
  return useMutation({
    mutationFn: createNewsletterTemplate,
    onSuccess: (data) => {
      console.log('Newsletter template created successfully:', data);
    },
    onError: (error) => {
      console.error('Newsletter template creation failed:', error);
    },
  });
};

/**
 * Hook to update newsletter template (Admin only)
 */
export const useUpdateNewsletterTemplate = () => {
  return useMutation({
    mutationFn: ({ templateId, data }: { templateId: number; data: UpdateNewsletterTemplateRequest }) =>
      updateNewsletterTemplate(templateId, data),
    onSuccess: (data) => {
      console.log('Newsletter template updated successfully:', data);
    },
    onError: (error) => {
      console.error('Newsletter template update failed:', error);
    },
  });
};

/**
 * Hook to delete newsletter template (Admin only)
 */
export const useDeleteNewsletterTemplate = () => {
  return useMutation({
    mutationFn: deleteNewsletterTemplate,
    onSuccess: (data) => {
      console.log('Newsletter template deleted successfully:', data);
    },
    onError: (error) => {
      console.error('Newsletter template deletion failed:', error);
    },
  });
};

/**
 * Hook to get newsletter templates (Admin only)
 */
export const useGetNewsletterTemplates = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['newsletter', 'templates', page, size],
    queryFn: () => getNewsletterTemplates(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get newsletter template by ID (Admin only)
 */
export const useGetNewsletterTemplateById = (templateId: number) => {
  return useQuery({
    queryKey: ['newsletter', 'templates', templateId],
    queryFn: () => getNewsletterTemplateById(templateId),
    enabled: !!templateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create newsletter campaign (Admin only)
 */
export const useCreateNewsletterCampaign = () => {
  return useMutation({
    mutationFn: createNewsletterCampaign,
    onSuccess: (data) => {
      console.log('Newsletter campaign created successfully:', data);
    },
    onError: (error) => {
      console.error('Newsletter campaign creation failed:', error);
    },
  });
};

/**
 * Hook to update newsletter campaign (Admin only)
 */
export const useUpdateNewsletterCampaign = () => {
  return useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: number; data: UpdateNewsletterCampaignRequest }) =>
      updateNewsletterCampaign(campaignId, data),
    onSuccess: (data) => {
      console.log('Newsletter campaign updated successfully:', data);
    },
    onError: (error) => {
      console.error('Newsletter campaign update failed:', error);
    },
  });
};

/**
 * Hook to delete newsletter campaign (Admin only)
 */
export const useDeleteNewsletterCampaign = () => {
  return useMutation({
    mutationFn: deleteNewsletterCampaign,
    onSuccess: (data) => {
      console.log('Newsletter campaign deleted successfully:', data);
    },
    onError: (error) => {
      console.error('Newsletter campaign deletion failed:', error);
    },
  });
};

/**
 * Hook to get newsletter campaigns (Admin only)
 */
export const useGetNewsletterCampaigns = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['newsletter', 'campaigns', page, size],
    queryFn: () => getNewsletterCampaigns(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get newsletter campaign by ID (Admin only)
 */
export const useGetNewsletterCampaignById = (campaignId: number) => {
  return useQuery({
    queryKey: ['newsletter', 'campaigns', campaignId],
    queryFn: () => getNewsletterCampaignById(campaignId),
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to send newsletter campaign (Admin only)
 */
export const useSendNewsletterCampaign = () => {
  return useMutation({
    mutationFn: sendNewsletterCampaign,
    onSuccess: (data) => {
      console.log('Newsletter campaign sent successfully:', data);
    },
    onError: (error) => {
      console.error('Newsletter campaign sending failed:', error);
    },
  });
};

/**
 * Hook to get newsletter analytics (Admin only)
 */
export const useGetNewsletterAnalytics = () => {
  return useQuery({
    queryKey: ['newsletter', 'analytics'],
    queryFn: getNewsletterAnalytics,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to delete subscriber (Admin only)
 */
export const useDeleteSubscriber = () => {
  return useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: (data) => {
      console.log('Subscriber deleted successfully:', data);
    },
    onError: (error) => {
      console.error('Subscriber deletion failed:', error);
    },
  });
};

/**
 * Hook to bulk delete subscribers (Admin only)
 */
export const useBulkDeleteSubscribers = () => {
  return useMutation({
    mutationFn: bulkDeleteSubscribers,
    onSuccess: (data) => {
      console.log('Subscribers bulk deleted successfully:', data);
    },
    onError: (error) => {
      console.error('Subscribers bulk deletion failed:', error);
    },
  });
};

/**
 * Hook to export subscribers (Admin only)
 */
export const useExportSubscribers = () => {
  return useMutation({
    mutationFn: exportSubscribers,
    onSuccess: (data) => {
      console.log('Subscribers exported successfully:', data);
    },
    onError: (error) => {
      console.error('Subscribers export failed:', error);
    },
  });
};