import type { Comment as CommentType } from "~/types";
import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateCommentRequest {
	content: string;
	parentCommentId?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ✅ js-early-exit: Unwrap API envelope once in a single helper rather than
//    repeating the `response.data.data || response.data` pattern in every method.
const unwrap = <T>(data: unknown): T => {
	if (
		data &&
		typeof data === "object" &&
		"data" in data &&
		(data as any).data
	) {
		return (data as any).data as T;
	}
	return data as T;
};

// ─── API ──────────────────────────────────────────────────────────────────────

export const commentsApi = {
	createComment: async (
		postId: string,
		payload: CreateCommentRequest,
	): Promise<CommentType> => {
		const { data } = await apiClient.post(`/posts/${postId}/comments`, payload);
		const comment = unwrap<CommentType>(data);

		// ✅ js-early-exit: Validate once; throw a typed error instead of
		//    logging + reloading the page (window.location.reload in UI layer is a code smell).
		if (!comment?.id) throw new Error("Invalid comment response from server");
		return comment;
	},

	updateComment: async (
		commentId: string,
		content: string,
	): Promise<CommentType> => {
		const { data } = await apiClient.put(`/comments/${commentId}`, { content });
		return unwrap<CommentType>(data);
	},

	deleteComment: async (commentId: string): Promise<void> => {
		await apiClient.delete(`/comments/${commentId}`);
	},
} as const;
