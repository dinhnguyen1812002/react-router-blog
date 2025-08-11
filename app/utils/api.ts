import { env, buildApiUrl } from "~/config/env";

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
    // Paginated saved posts
    list: (page?: number, size?: number) => {
      const params = new URLSearchParams();
      if (page !== undefined) params.append("page", page.toString());
      if (size !== undefined) params.append("size", size.toString());
      return buildApiUrl(
        `post/saved-posts${params.toString() ? `?${params.toString()}` : ""}`
      );
    },
    // Add bookmark (POST)
    add: (postId: string) => buildApiUrl(`post/${postId}/bookmark`),
    // Remove bookmark (DELETE)
    remove: (postId: string) => buildApiUrl(`post/${postId}/bookmark`),
    // Check if post is bookmarked (new path per docs)
    status: (postId: string) => buildApiUrl(`post/check/${postId}`),
    // Legacy status endpoint (for backward compatibility)
    legacyStatus: (postId: string) => buildApiUrl(`post/${postId}/bookmark/status`),
    // Get all bookmarked posts (non-paginated)
    listAll: () => buildApiUrl(`post/list`),
    // Get user's bookmarked posts count
    countUser: () => buildApiUrl(`post/count`),
    // Get a post's bookmark count
    countPost: (postId: string) => buildApiUrl(`post/post/${postId}/count`),
    // Update notes for a saved post
    updateNotes: (savedPostId: string) => buildApiUrl(`post/notes/${savedPostId}`),
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
