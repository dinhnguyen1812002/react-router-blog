import { env, buildApiUrl } from "~/config/env";

// API interceptor to handle token expiration
export const createApiRequest = (url: string, options: RequestInit = {}) => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    // Import authStore dynamically to avoid SSR issues
    import('~/store/authStore').then(({ useAuthStore }) => {
      const store = useAuthStore.getState();
      
      // Check token validity before making request
      if (store.token && !store.checkTokenValidity()) {
        // Token is expired, request will fail anyway
        console.log('Token expired before API request');
        return;
      }
    });
  }

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

// API endpoint builders
export const apiEndpoints = {
  // Auth endpoints
  auth: {
    login: () => buildApiUrl("auth/login"),
    register: () => buildApiUrl("auth/register"),
    logout: () => buildApiUrl("auth/logout"),
    forgotPassword: () => buildApiUrl("auth/forgot-password"),
    resetPassword: () => buildApiUrl("auth/reset-password"),
  },

  // User endpoints
  user: {
    profile: () => buildApiUrl("user/profile"),
    updateProfile: () => buildApiUrl("user/update-profile"),
    changePassword: () => buildApiUrl("user/change-password"),
    me: () => buildApiUrl("users/me"),
  },

  // Posts endpoints
  posts: {
    list: (page?: number, size?: number) => {
      const params = new URLSearchParams();
      if (page !== undefined) params.append("page", page.toString());
      if (size !== undefined) params.append("size", size.toString());
      return buildApiUrl(
        `posts${params.toString() ? `?${params.toString()}` : ""}`
      );
    },
    byId: (id: string) => buildApiUrl(`posts/${id}`),
    bySlug: (slug: string) => buildApiUrl(`posts/${slug}`),
    create: () => buildApiUrl("posts"),
    update: (id: string) => buildApiUrl(`posts/${id}`),
    delete: (id: string) => buildApiUrl(`posts/${id}`),
  },

  // Memes endpoints
  memes: {
    list: (page?: number) => {
      const params = new URLSearchParams();
      if (page !== undefined) params.append("page", page.toString());
      return buildApiUrl(
        `memes${params.toString() ? `?${params.toString()}` : ""}`
      );
    },
    bySlug: (slug: string) => buildApiUrl(`memes/${slug}`),
    upload: () => buildApiUrl("memes/upload"),
    uploadMultiple: () => buildApiUrl("memes/upload/multiple"),
    randomStream: () => buildApiUrl("memes/random-stream"),
  },

  // Categories endpoints
  categories: {
    list: () => buildApiUrl("categories"),
    byId: (id: string) => buildApiUrl(`categories/${id}`),
  },

  // Tags endpoints
  tags: {
    list: () => buildApiUrl("tags"),
    byId: (id: string) => buildApiUrl(`tags/${id}`),
  },

  // Comments endpoints
  comments: {
    byPost: (postId: string) => buildApiUrl(`posts/${postId}/comments`),
    create: () => buildApiUrl("comments"),
    update: (id: string) => buildApiUrl(`comments/${id}`),
    delete: (id: string) => buildApiUrl(`comments/${id}`),
  },

  // Upload endpoints
  upload: {
    single: () => buildApiUrl("upload"),
    multiple: () => buildApiUrl("upload/multiple"),
  },

  // Bookmark endpoints (aligned with docs/BOOKMARKS.md)
bookmarks: {
    // Add bookmark (POST)
    add: (postId: string) => buildApiUrl(`post/${postId}/bookmark`),

    // Remove bookmark (DELETE)
    remove: (postId: string) => buildApiUrl(`post/${postId}/bookmark/delete`),

    // Check if post is bookmarked
    status: (postId: string) => buildApiUrl(`post/check/${postId}`),

    // Get paginated saved posts
    list: (page: number, size: number) =>
      buildApiUrl(`post/saved-posts?page=${page}&size=${size}`),


    // Get user's saved posts count
    countUser: () => buildApiUrl(`post/count`),

    // Get a post's saved count
    countPost: (postId: string) => buildApiUrl(`post/${postId}/count`),

    // Update notes for a saved post
    updateNotes: (savedPostId: string) =>
      buildApiUrl(`post/notes/${savedPostId}`),
  },
} as const;

// Helper function to get base API URL
export const getApiBaseUrl = () => env.API_BASE_URL;

// Helper function to check if API is available
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(buildApiUrl("health"), {
      method: "GET",
      timeout: 5000,
    } as RequestInit);
    return response.ok;
  } catch {
    return false;
  }
};

// Development helpers
if (env.DEV) {
  // Log API endpoints in development
  console.log("🔗 API Endpoints:", {
    baseUrl: env.API_BASE_URL,
    timeout: env.API_TIMEOUT,
    sampleEndpoints: {
      posts: apiEndpoints.posts.list(),
      memes: apiEndpoints.memes.list(),
      auth: apiEndpoints.auth.login(),
    },
  });
}
