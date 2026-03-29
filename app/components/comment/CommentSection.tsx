import {
	AlertCircle,
	ArrowUpDown,
	Clock,
	Loader2,
	LogIn,
	MessageCircle,
	TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useWebSocket } from "~/context/WebSocketContext";
import { useCommentDeduplication } from "~/hooks/useCommentDeduplication";
import { usePendingComment } from "~/hooks/usePendingComment";
import { useAuthStore } from "~/store/authStore";
import type { Comment as CommentType } from "~/types";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommentSectionProps {
	postId: string;
	initialComments: CommentType[];
	onCommentsUpdate?: (comments: CommentType[]) => void;
}

type SortType = "newest" | "oldest" | "popular";

const SORT_OPTIONS: { value: SortType; label: string; icon: typeof Clock }[] = [
	{ value: "newest", label: "Mới nhất", icon: Clock },
	{ value: "popular", label: "Phổ biến", icon: TrendingUp },
	{ value: "oldest", label: "Cũ nhất", icon: ArrowUpDown },
];

// ─── Tree helpers (module-level, no closure over state) ──────────────────────

// ✅ js-early-exit + rendering-hoist: Pure functions defined outside the
//    component so they're never re-created on render.
const addReplyToTree = (
	list: CommentType[],
	reply: CommentType,
): CommentType[] =>
	list.map((c) => {
		if (c.id === reply.parentCommentId) {
			if (c.replies?.some((r) => r.id === reply.id)) return c;
			const replies = [...(c.replies ?? []), reply];
			return { ...c, replies, replyCount: replies.length };
		}
		if (c.replies) return { ...c, replies: addReplyToTree(c.replies, reply) };
		return c;
	});

const updateInTree = (
	list: CommentType[],
	updated: CommentType,
): CommentType[] =>
	list.map((c) => {
		if (c.id === updated.id) return updated;
		if (c.replies) return { ...c, replies: updateInTree(c.replies, updated) };
		return c;
	});

const deleteFromTree = (list: CommentType[], id: string): CommentType[] =>
	list
		.filter((c) => c.id !== id)
		.map((c) => ({
			...c,
			replies: c.replies ? deleteFromTree(c.replies, id) : c.replies,
		}));

// ─── Component ────────────────────────────────────────────────────────────────

export const CommentSection = ({
	postId,
	initialComments,
	onCommentsUpdate,
}: CommentSectionProps) => {
	const { isAuthenticated } = useAuthStore();
	const [comments, setComments] = useState<CommentType[]>(initialComments);
	const [sortBy, setSortBy] = useState<SortType>("newest");
	const [showCommentForm, setShowCommentForm] = useState(false);

	const { isCommentDuplicate, markCommentAsProcessing, markCommentAsAdded } =
		useCommentDeduplication();

	const { isSubmittingPending, pendingError } = usePendingComment(
		postId,
		handleCommentAdded,
	);

	const { subscribe, connected } = useWebSocket();

	// ✅ WebSocket subscription — no setTimeout hack; API layer guarantees a
	//    valid comment object so there's no race condition to defend against.
	useEffect(() => {
		if (!connected || !postId) return;
		const sub = subscribe(`/topic/comments/${postId}`, (msg) => {
			handleCommentAdded(msg as CommentType);
		});
		return () => sub?.unsubscribe();
	}, [connected, postId, subscribe]);

	// ✅ useCallback: stable reference so usePendingComment / WebSocket effect
	//    don't re-subscribe on every render.
	function handleCommentAdded(newComment: CommentType) {
		if (!newComment?.id) return;
		if (isCommentDuplicate(newComment, comments)) return;

		markCommentAsProcessing(newComment.id);

		setComments((prev) => {
			const next = newComment.parentCommentId
				? addReplyToTree(prev, newComment)
				: [newComment, ...prev];
			onCommentsUpdate?.(next);
			return next;
		});

		setShowCommentForm(false);
		markCommentAsAdded(newComment.id);
	}

	const handleCommentUpdated = useCallback(
		(updated: CommentType) => {
			setComments((prev) => {
				const next = updateInTree(prev, updated);
				onCommentsUpdate?.(next);
				return next;
			});
		},
		[onCommentsUpdate],
	);

	const handleCommentDeleted = useCallback(
		(id: string) => {
			setComments((prev) => {
				const next = deleteFromTree(prev, id);
				onCommentsUpdate?.(next);
				return next;
			});
		},
		[onCommentsUpdate],
	);

	// ✅ rerender-memo + js-combine-iterations: filter root + sort in one pass
	const rootComments = useMemo(() => {
		const roots = comments.filter(
			(c): c is CommentType => (c.depth ?? 0) === 0,
		);
		return [...roots].sort((a: CommentType, b: CommentType) => {
			if (sortBy === "oldest")
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			if (sortBy === "popular")
				return (b.replyCount ?? 0) - (a.replyCount ?? 0);
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});
	}, [comments, sortBy]);

	const totalCount = comments.length;

	return (
		<section className="space-y-6">
			{/* ── Header ─────────────────────────────────────────────────────── */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div className="flex items-center gap-2.5">
					<MessageCircle className="w-5 h-5 text-primary" />
					<h2 className="text-lg font-semibold text-foreground">Thảo luận</h2>
					{totalCount > 0 && (
						<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
							{totalCount}
						</span>
					)}
				</div>

				{/* Sort tabs */}
				<div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted/60 border border-border">
					{SORT_OPTIONS.map(({ value, label }) => (
						<button
							key={value}
							onClick={() => setSortBy(value)}
							className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
								sortBy === value
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* ── Status banners ─────────────────────────────────────────────── */}
			{isSubmittingPending && (
				<div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-primary">
					<Loader2 className="w-4 h-4 animate-spin shrink-0" />
					Đang gửi bình luận đang chờ…
				</div>
			)}

			{pendingError && (
				<div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm text-destructive">
					<AlertCircle className="w-4 h-4 shrink-0" />
					Không thể gửi bình luận. Vui lòng thử lại.
				</div>
			)}

			{/* ── Comment form ───────────────────────────────────────────────── */}
			<div className="border-t border-border pt-5">
				{isAuthenticated ? (
					showCommentForm ? (
						<CommentForm
							postId={postId}
							onCancel={() => setShowCommentForm(false)}
							onCommentAdded={handleCommentAdded}
						/>
					) : (
						<button
							onClick={() => setShowCommentForm(true)}
							className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/40 text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
						>
							Chia sẻ suy nghĩ của bạn…
						</button>
					)
				) : (
					<div className="flex items-center justify-between gap-4 px-4 py-4 rounded-xl border border-border bg-muted/20">
						<p className="text-sm text-muted-foreground">
							Đăng nhập để tham gia thảo luận
						</p>
						<div className="flex gap-2 shrink-0">
							<Link
								to="/login"
								className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
							>
								<LogIn className="w-3.5 h-3.5" />
								Đăng nhập
							</Link>
							<Link
								to="/register"
								className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
							>
								Đăng ký
							</Link>
						</div>
					</div>
				)}
			</div>

			{/* ── Comment list ───────────────────────────────────────────────── */}
			{rootComments.length > 0 ? (
				<div className="divide-y divide-border/60">
					{rootComments.map((comment: CommentType) => (
						<div key={comment.id} className="py-1 first:pt-0">
							<CommentItem
								comment={comment}
								postId={postId}
								onCommentUpdated={handleCommentUpdated}
								onCommentDeleted={handleCommentDeleted}
								onReplyAdded={handleCommentAdded}
							/>
						</div>
					))}
				</div>
			) : (
				<div className="py-12 text-center border-t border-border">
					<MessageCircle
						className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30"
						strokeWidth={1.5}
					/>
					<p className="text-sm text-muted-foreground">
						Chưa có bình luận nào. Hãy là người đầu tiên!
					</p>
				</div>
			)}
		</section>
	);
};
