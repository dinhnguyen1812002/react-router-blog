
import axiosInstance from '~/config/axios';
import type { ApiResponse, PaginatedResponse, Post } from '~/types';

export interface GetPostsParams {
  page?: number;
  size?: number;
  sortBy?: 'newest' | 'views';
  categorySlug?: string;
  tagSlug?: string;
}

export interface RatePostRequest {
  score: number; // 1-5
}

export interface LikeResponse {
  isLiked: boolean;
  likeCount: number;
}

export interface RatingResponse {
  userRating: number;
  averageRating: number;
  totalRatings: number;
}


export const postsApi = {
  /**
   * Get filtered posts with pagination and sorting
   * @param params - Query parameters: page, size, sortBy, categorySlug, tagSlug
   * @returns Paginated response with posts
   */
  getPosts: async (params: GetPostsParams = {}): Promise<PaginatedResponse<Post>> => {
    const {
      page = 0,
      size = 10,
      sortBy = 'newest',
      categorySlug,
      tagSlug
    } = params;

    const queryParams: Record<string, string | number> = { page, size, sortBy };

    if (categorySlug) queryParams.categorySlug = categorySlug;
    if (tagSlug) queryParams.tagSlug = tagSlug;

    const response = await axiosInstance.get<PaginatedResponse<Post>>('/post', {
      params: queryParams
    });

    return response.data;
  },

  getFeaturedPosts: async (): Promise<ApiResponse<Post[]>> => {
    try {
      const response = await axiosInstance.get('/post/featured');

      // Handle both formats
      if (response.data && response.data.data) {
        return response.data; // Already in ApiResponse format
      } else if (response.data) {
        // Direct array, wrap it in ApiResponse format
        return {
          data: response.data,
          message: 'Success',
          success: true,
          slug: response.data.map((post: Post) => post.slug)
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Featured Posts API Error:', error);
      throw error;
    }
  },

  getPostBySlug: async (slug: string): Promise<ApiResponse<Post>> => {
    try {
      const response = await axiosInstance.get(`/post/${slug}`);

      // Handle both formats: { data: post } and direct post object
      if (response.data && response.data.data) {
        return response.data; // Already in ApiResponse format
      } else if (response.data) {
        // Direct post object, wrap it in ApiResponse format
        return {
          data: response.data,
          message: 'Success',
          success: true,
          slug: response.data.slug
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Post API Error:', error);
      throw error;
    }
  },

  createPost: async (data: Partial<Post>): Promise<ApiResponse<Post>> => {
    const response = await axiosInstance.post('/post', data);
    return response.data;
  },

  updatePost: async (id: number, data: Partial<Post>): Promise<ApiResponse<Post>> => {
    const response = await axiosInstance.put(`/post/${id}`, data);
    return response.data;
  },

  deletePost: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(`/post/${id}`);
    return response.data;
  },

  // Like functionality
  likePost: async (postId: string): Promise<LikeResponse> => {
    try {
      const response = await axiosInstance.post(`/post/${postId}/like`);

      // Handle different response formats
      if (response.data && typeof response.data === 'object') {
        // If response has data property, use it
        if (response.data.data) {
          return response.data.data;
        }
        // If response is direct object with expected properties
        if ('isLiked' in response.data || 'likeCount' in response.data) {
          return response.data;
        }
      }

      // Fallback response
      return {
        isLiked: true,
        likeCount: 0
      };
    } catch (error) {
      console.error('❌ Like post error:', error);
      throw error;
    }
  },

  // Rating functionality
  ratePost: async (postId: string, data: RatePostRequest): Promise<RatingResponse> => {
    try {
      const response = await axiosInstance.post(`/post/${postId}/rate?score=${data.score}`);

      // Handle different response formats
      if (response.data && typeof response.data === 'object') {
        // If response has data property, use it
        if (response.data.data) {
          return response.data.data;
        }
        // If response is direct object with expected properties
        if ('userRating' in response.data || 'averageRating' in response.data) {
          return response.data;
        }
      }

      // Fallback response
      return {
        userRating: data.score,
        averageRating: data.score,
        totalRatings: 1
      };
    } catch (error) {
      console.error('❌ Rate post error:', error);
      throw error;
    }
  },

  // Create new post
  // createPost: async (postData: any): Promise<ApiResponse<Post>> => {
  //   try {
  //     const response = await axiosInstance.post('/post', postData);
  //     console.log('✅ Create post success:', response.data);

  //     // Handle different response formats
  //     if (response.data && response.data.data) {
  //       return response.data;
  //     } else if (response.data) {
  //       return {
  //         data: response.data,
  //         message: 'Post created successfully',
  //         success: true
  //       };
  //     }

  //     throw new Error('Invalid response format');
  //   } catch (error) {
  //     console.error('❌ Create post error:', error);
  //     throw error;
  //   }
  // },

  // Update existing post
  // updatePost: async (postId: number, postData: any): Promise<ApiResponse<Post>> => {
  //   try {
  //     const response = await axiosInstance.put(`/post/${postId}`, postData);
  //     console.log('✅ Update post success:', response.data);

  //     // Handle different response formats
  //     if (response.data && response.data.data) {
  //       return response.data;
  //     } else if (response.data) {
  //       return {
  //         data: response.data,
  //         message: 'Post updated successfully',
  //         success: true
  //       };
  //     }

  //     throw new Error('Invalid response format');
  //   } catch (error) {
  //     console.error('❌ Update post error:', error);
  //     throw error;
  //   }
  // },

  // Delete post
  // deletePost: async (postId: string): Promise<ApiResponse<any>> => {
  //   try {
  //     const response = await axiosInstance.delete(`/post/${postId}`);
  //     console.log('✅ Delete post success:', response.data);

  //     return {
  //       data: response.data,
  //       message: 'Post deleted successfully',
  //       success: true
  //     };
  //   } catch (error) {
  //     console.error('❌ Delete post error:', error);
  //     throw error;
  //   }
  // },

  // Get post by ID (for editing)
  // getPostById: async (slug: string): Promise<ApiResponse<Post>> => {
  //   try {
  //     const response = await axiosInstance.get(`/post/${slug}`);
  //     console.log('✅ Get post by ID success:', response.data);

  //     // Handle different response formats
  //     if (response.data && response.data.data) {
  //       return response.data;
  //     } else if (response.data) {
  //       return {
  //         data: response.data,
  //         message: 'Post retrieved successfully',
  //         success: true
  //       };
  //     }

  //     throw new Error('Invalid response format');
  //   } catch (error) {
  //     console.error('❌ Get post by ID error:', error);
  //     throw error;
  //   }
  // },

};