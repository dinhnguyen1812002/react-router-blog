import axiosInstance from "~/config/axios";
import type { ApiResponse, PaginatedResponse, Post } from "~/types";
import { apiClient } from "./client";

/** Visibility status for posts. Defaults to DRAFT. */
export type PostVisibility = "PUBLISHED" | "SCHEDULED" | "PRIVATE" | "DRAFT";

/** API schema for create post - POST /api/v1/author/write */
export interface CreateAuthorPostRequest {
	title: string;
	content: string;
	excerpt: string;
	thumbnail?: string;

	categories?: number[];

	tags?: string[];
	featured?: boolean;

	visibility?: PostVisibility;

	scheduledPublishAt?: string;
	publishedAt?: string;
}

/** Same shape as create - PUT accepts full or partial payload */
export type UpdateAuthorPostRequest = Partial<CreateAuthorPostRequest> &
	Pick<CreateAuthorPostRequest, "title" | "content">;

export interface GetMyPostsParams {
	page?: number;
	size?: number;
	keyword?: string;
	categoryName?: string;
	tagName?: string;
	sortDirection?: "asc" | "desc";
}

export interface MyPostsResponse {
	posts: Post[];
	page: {
		size: number;
		number: number;
		totalElements: number;
		totalPages: number;
	};
}

export const authorApi = {
	getMyPosts: async (
		page: number = 0,
		size: number = 10,
		keyword?: string,
		categoryName?: string,
		tagName?: string,
		sortDirection: "asc" | "desc" = "desc",
	): Promise<MyPostsResponse> => {
		// Build query params
		const params = new URLSearchParams({
			page: page.toString(),
			size: size.toString(),
		});

		if (keyword) params.append("keyword", keyword);
		if (categoryName) params.append("categoryName", categoryName);
		if (tagName) params.append("tagName", tagName);
		if (sortDirection) params.append("sortDirection", sortDirection);

		const response = await apiClient.get(`/author/posts?${params.toString()}`);
		const data = response.data;

		// Extract posts from content array and pagination info
		return {
			posts: data.content || [],
			page: data.page || {
				size: size,
				number: page,
				totalElements: 0,
				totalPages: 0,
			},
		};
	},

	createPost: async (
		data: CreateAuthorPostRequest,
	): Promise<ApiResponse<Post>> => {
		const response = await axiosInstance.post("/author/write", data);
		return response.data;
	},

	updatePost: async (
		postId: string,
		postData: CreateAuthorPostRequest,
	): Promise<ApiResponse<Post>> => {
		const response = await apiClient.put(`/author/${postId}`, postData);
		return response.data;
	},

	deletePost: async (postId: string): Promise<void> => {
		await apiClient.delete(`/author/${postId}`);
	},

	getPostById: async (postId: string): Promise<Post> => {
		const response = await apiClient.get(`/author/${postId}`);
		const data = response.data as Post | { data: Post };
		return "data" in data && data.data ? data.data : (data as Post);
	},
};
