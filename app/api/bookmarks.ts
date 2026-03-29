import type { Post } from "~/types";
import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookmarkResponse {
	posts: Post[];
	total: number;
	page: number;
	limit: number;
}

export interface BookmarkActionResponse {
	success: boolean;
	message: string;
	isBookmarked?: boolean;
}

export interface BookmarkNotesRequest {
	notes: string;
}

// ─── Error Handling ───────────────────────────────────────────────────────────

// ✅ js-index-maps: Use a Map for O(1) status-code lookups instead of an
//    if/else chain that grows linearly with each new status code.
const HTTP_ERROR_MESSAGES: Readonly<Map<number, string>> = new Map([
	[401, "Bạn cần đăng nhập để lưu bài viết"],
	[404, "Bài viết không tồn tại"],
	[405, "Chức năng bookmark hiện không khả dụng"],
	[500, "Lỗi server, vui lòng thử lại sau"],
]);

// ✅ js-early-exit: Return the specific message early; fall through to the
//    generic message only when no specific one exists.
const handleBookmarkError = (error: unknown, action: string): never => {
	const status = (error as any)?.response?.status as number | undefined;
	const message =
		(status && HTTP_ERROR_MESSAGES.get(status)) ??
		(error as any)?.response?.data?.message ??
		`Không thể ${action}. Vui lòng thử lại.`;

	throw new Error(message);
};

// ─── API ──────────────────────────────────────────────────────────────────────

export const bookmarksApi = {
	/**
	 * Get paginated bookmarked posts for the current user.
	 */
	getBookmarks: async (page = 0, size = 10): Promise<BookmarkResponse> => {
		try {
			const { data } = await apiClient.get(
				`/post/saved-posts?page=${page}&size=${size}`,
			);
			return {
				posts: data.content.map((item: any) => item.post),
				total: data.totalElements,
				page: data.number,
				limit: data.size,
			};
		} catch (error) {
			handleBookmarkError(error, "lấy danh sách");
			throw error; // Never reached, but satisfies TypeScript
		}
	},

	/**
	 * Toggle bookmark status for a post.
	 *
	 * ✅ async-parallel: The previous implementation made a sequential
	 *    isBookmarked() check THEN a second action call — two round-trips.
	 *    We now attempt the optimistic action (POST) first and, on a 409
	 *    Conflict (already exists), fall back to DELETE. This collapses two
	 *    network waterfalls into one in the happy path.
	 *
	 * If your API doesn't return 409 on duplicate adds, keep the explicit
	 * addBookmark / removeBookmark methods and call them directly instead.
	 */
	toggleBookmark: async (
		postId: string,
		notes?: string,
	): Promise<BookmarkActionResponse> => {
		try {
			const response = await apiClient.post(
				`/post/${postId}/bookmark`,
				notes ? { notes } : undefined,
			);
			return { ...response.data, isBookmarked: true };
		} catch (addError: any) {
			// 409 = already bookmarked → remove it
			if (addError?.response?.status === 409) {
				try {
					const response = await apiClient.delete(
						`/post/${postId}/bookmark/delete`,
					);
					return { ...response.data, isBookmarked: false };
				} catch (removeError) {
					handleBookmarkError(removeError, "xóa bookmark");
					throw removeError; // Never reached
				}
			}
			handleBookmarkError(addError, "thay đổi bookmark");
			throw addError; // Never reached
		}
	},

	/** Explicitly add a bookmark (POST). */
	addBookmark: async (
		postId: string,
		notes?: string,
	): Promise<BookmarkActionResponse> => {
		try {
			const { data } = await apiClient.post(
				`/post/${postId}/bookmark`,
				notes ? { notes } : undefined,
			);
			return { ...data, isBookmarked: true };
		} catch (error) {
			handleBookmarkError(error, "thêm bookmark");
			throw error; // Never reached
		}
	},

	/** Explicitly remove a bookmark (DELETE). */
	removeBookmark: async (postId: string): Promise<BookmarkActionResponse> => {
		try {
			const { data } = await apiClient.delete(
				`/post/${postId}/bookmark/delete`,
			);
			return { ...data, isBookmarked: false };
		} catch (error) {
			handleBookmarkError(error, "xóa bookmark");
			throw error; // Never reached
		}
	},

	/**
	 * Check if a post is bookmarked.
	 *
	 * ✅ The dead-code legacy fallback has been removed — the commented-out
	 *    block was never reachable (the catch silently swallowed 404 and then
	 *    fell through to handleBookmarkError anyway). Uncomment and restore
	 *    the legacyStatus block only if the fallback endpoint is live.
	 */
	isBookmarked: async (postId: string): Promise<{ isBookmarked: boolean }> => {
		try {
			const { data } = await apiClient.get(`/post/check/${postId}`);
			return data;
		} catch (error) {
			handleBookmarkError(error, "kiểm tra trạng thái");
			throw error; // Never reached
		}
	},

	/** Count bookmarks for the current user. */
	countUser: async (): Promise<number> => {
		try {
			const { data } = await apiClient.get("/post/count");
			return data;
		} catch (error) {
			handleBookmarkError(error, "đếm số bookmark của người dùng");
			throw error; // Never reached
		}
	},

	/** Count bookmarks for a specific post. */
	countPost: async (postId: string): Promise<number> => {
		try {
			const { data } = await apiClient.get(`/post/${postId}/count`);
			return data;
		} catch (error) {
			handleBookmarkError(error, "đếm số bookmark của bài viết");
			throw error; // Never reached
		}
	},

	/** Update notes for a saved post. */
	updateNotes: async (
		savedPostId: string,
		notes: string,
	): Promise<BookmarkActionResponse> => {
		try {
			const { data } = await apiClient.put(`/post/notes/${savedPostId}`, {
				notes,
			} satisfies BookmarkNotesRequest);
			return data;
		} catch (error) {
			handleBookmarkError(error, "cập nhật ghi chú");
			throw error; // Never reached
		}
	},

	/**
	 * @deprecated Use getBookmarks(0, size) directly — this always fetches
	 *   page 0 with a hardcoded limit of 10 and returns the raw response
	 *   shape instead of the normalized BookmarkResponse. Kept for backwards
	 *   compatibility; will be removed in the next major version.
	 */
	getAll: async (): Promise<Post[]> => {
		try {
			const { data } = await apiClient.get("/post/saved-posts?page=0&size=10");
			return data;
		} catch (error) {
			handleBookmarkError(error, "lấy tất cả bài đã lưu");
			throw error; // Never reached
		}
	},
} as const;
