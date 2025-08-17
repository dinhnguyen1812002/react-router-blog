import type { s } from 'node_modules/react-router/dist/development/components-CjQijYga.mjs';
import axiosInstance from '~/config/axios';
import type {ApiResponse, PaginatedResponse, Post} from '~/types';

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
  getPosts: async (page = 0, size = 10): Promise<PaginatedResponse<Post>> => {
    try {
      const response = await axiosInstance.get(`/post?page=${page}&size=${size}`);
      console.log('Posts API Response:', response.data);
      
      // Handle both formats
      if (response.data && response.data.content) {
        return response.data; // Already in PaginatedResponse format
      } else if (response.data) {
        // Direct array, wrap it in PaginatedResponse format
        return {
          content: response.data,
          totalElements: response.data.length,
          totalPages: 1,
          size: response.data.length,
          number: 0
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Posts API Error:', error);
      throw error;
    }
  },

  getFeaturedPosts: async (): Promise<ApiResponse<Post[]>> => {
    try {
      const response = await axiosInstance.get('/post/featured');
      console.log('Featured Posts API Response:', response.data);
      
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
      console.log('Post API Response:', response.data);
      
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
      console.log('🔄 Liking post:', postId);
      const response = await axiosInstance.post(`/post/${postId}/like`);
      console.log('✅ Like post response:', response.data);

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
      console.log('🔄 Rating post:', { postId, score: data.score });
      const response = await axiosInstance.post(`/post/${postId}/rate?score=${data.score}`);
      console.log('✅ Rate post response:', response.data);

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
  getPostById: async (slug: string): Promise<ApiResponse<Post>> => {
    try {
      const response = await axiosInstance.get(`/post/${slug}`);
      console.log('✅ Get post by ID success:', response.data);

      // Handle different response formats
      if (response.data && response.data.data) {
        return response.data;
      } else if (response.data) {
        return {
          data: response.data,
          message: 'Post retrieved successfully',
          success: true
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('❌ Get post by ID error:', error);
      throw error;
    }
  },

};