import { useMutation } from "@tanstack/react-query";
import {
	ChevronDown,
	ChevronUp,
	CornerDownRight,
	Pencil,
	Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { commentsApi } from "~/api/comments";
import { formatDateSimple } from "~/lib/utils";
import { useAuthStore } from "~/store/authStore";
import type { Comment as CommentType } from "~/types";
import { resolveImageUrl } from "~/utils/image";
import UserAvatar from "../ui/boring-avatar";
import { CommentForm } from "./CommentForm";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommentItemProps {
	comment: CommentType;
	postId: string;
	level?: number;
	onCommentUpdated?: (comment: CommentType) => void;
	onCommentDeleted?: (commentId: string) => void;
	onReplyAdded?: (comment: CommentType) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// ✅ advanced-init-once: Max nesting depth defined once at module level
const MAX_DEPTH = 3;
const RECENT_THRESHOLD_MS = 24 * 60 * 60 * 1000;

// ─── Component ────────────────────────────────────────────────────────────────

export const CommentItem = ({
	comment,
	postId,
	level = 0,
	onCommentUpdated,
	onCommentDeleted,
	onReplyAdded,
}: CommentItemProps) => {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(comment.content);
	const [showReplies, setShowReplies] = useState(true);

	const { user, isAuthenticated } = useAuthStore();

	// ✅ rerender-memo-with-default-value: Derive stable booleans from props
	//    at the top so comparisons don't repeat inline.
	const currentDepth = comment.depth ?? level;
	const isOwner = user?.id === comment.user?.id;
	const hasReplies = (comment.replies?.length ?? 0) > 0;
	const canReply = currentDepth < MAX_DEPTH;
	const isRecent =
		Date.now() - new Date(comment.createdAt).getTime() < RECENT_THRESHOLD_MS;

	const updateMutation = useMutation({
		mutationFn: (content: string) =>
			commentsApi.updateComment(comment.id, content),
		onSuccess: (updated) => {
			setIsEditing(false);
			onCommentUpdated?.(updated);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => commentsApi.deleteComment(comment.id),
		onSuccess: () => onCommentDeleted?.(comment.id),
	});

	// ✅ rerender-move-effect-to-event: These handlers contain only interaction
	//    logic — no side-effects that require useEffect.
	const handleEdit = useCallback(() => {
		if (editContent.trim()) updateMutation.mutate(editContent.trim());
	}, [editContent, updateMutation]);

	const handleCancelEdit = useCallback(() => {
		setIsEditing(false);
		setEditContent(comment.content);
	}, [comment.content]);

	const handleDelete = useCallback(() => {
		if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
			deleteMutation.mutate();
		}
	}, [deleteMutation]);

	const handleReplyAdded = useCallback(
		(newComment: CommentType) => {
			onReplyAdded?.(newComment);
			setShowReplyForm(false);
		},
		[onReplyAdded],
	);

	return (
		<div className="relative">
			{/* Thread indent line */}
			{level > 0 && (
				<span
					className="absolute left-0 top-0 bottom-0 w-px bg-border/60"
					style={{ left: -16 }}
					aria-hidden
				/>
			)}

			<div className="flex gap-3 py-2 group/comment">
				{/* Avatar */}
				<div className="shrink-0 mt-0.5">
					<UserAvatar src={resolveImageUrl(comment.user?.avatar) ?? ""} />
				</div>

				<div className="flex-1 min-w-0">
					{/* Header */}
					<div className="flex items-center gap-2 flex-wrap mb-1">
						<span className="text-sm font-semibold text-foreground leading-none">
							{comment.user?.username ?? "Ẩn danh"}
						</span>
						<span className="text-[11px] text-muted-foreground">
							{formatDateSimple(comment.createdAt)}
						</span>
						{comment.isEdited && (
							<span className="text-[10px] text-muted-foreground/60 italic">
								đã sửa
							</span>
						)}
						{isRecent && (
							<span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full">
								Mới
							</span>
						)}
					</div>

					{/* Body */}
					{isEditing ? (
						<div className="space-y-2 mt-1">
							<textarea
								value={editContent}
								onChange={(e) => setEditContent(e.target.value)}
								rows={3}
								className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none text-foreground transition-all"
								placeholder="Chỉnh sửa bình luận…"
							/>
							<div className="flex items-center gap-2">
								<button
									onClick={handleEdit}
									disabled={updateMutation.isPending || !editContent.trim()}
									className="px-3 py-1 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all"
								>
									{updateMutation.isPending ? "Đang lưu…" : "Lưu"}
								</button>
								<button
									onClick={handleCancelEdit}
									className="px-3 py-1 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
								>
									Hủy
								</button>
							</div>
						</div>
					) : (
						<p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
							{comment.content}
						</p>
					)}

					{/* Action bar */}
					{!isEditing && (
						<div className="flex items-center gap-1 mt-2 -ml-1">
							{/* Reply - always visible */}
							{canReply && isAuthenticated && (
								<button
									onClick={() => setShowReplyForm((v) => !v)}
									className="inline-flex items-center gap-1 
                  px-2 py-1 rounded-md text-[11px] font-medium 
                  text-muted-foreground 
                  hover:text-primary hover:bg-primary/5 transition-colors"
								>
									<CornerDownRight className="w-3 h-3" />
									Trả lời
								</button>
							)}

							{/* Owner actions - always visible */}
							{isOwner && (
								<>
									<button
										onClick={() => setIsEditing(true)}
										className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
									>
										<Pencil className="w-3 h-3" />
										Sửa
									</button>
									<button
										onClick={handleDelete}
										disabled={deleteMutation.isPending}
										className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
									>
										<Trash2 className="w-3 h-3" />
										Xóa
									</button>
								</>
							)}

							{/* Other actions - hidden until hover */}
							<div className="flex items-center gap-1 opacity-0 group-hover/comment:opacity-100 transition-opacity">
								{/* Toggle replies */}
								{hasReplies && (
									<button
										onClick={() => setShowReplies((v) => !v)}
										className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
									>
										{showReplies ? (
											<ChevronUp className="w-3 h-3" />
										) : (
											<ChevronDown className="w-3 h-3" />
										)}
										{comment.replies!.length} phản hồi
									</button>
								)}
							</div>
						</div>
					)}

					{/* Reply form */}
					{showReplyForm && (
						<div className="mt-3 pl-1">
							<CommentForm
								postId={postId}
								parentCommentId={comment.id}
								onCancel={() => setShowReplyForm(false)}
								onCommentAdded={handleReplyAdded}
								placeholder={`Trả lời ${comment.user?.username ?? "Ẩn danh"}…`}
							/>
						</div>
					)}

					{/* Nested replies */}
					{hasReplies && showReplies && (
						<div className="relative mt-3 pl-4 space-y-0 border-l border-border/50">
							{comment.replies!.map((reply) => (
								<CommentItem
									key={reply.id}
									comment={reply}
									postId={postId}
									level={currentDepth + 1}
									onCommentUpdated={onCommentUpdated}
									onCommentDeleted={onCommentDeleted}
									onReplyAdded={onReplyAdded}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
