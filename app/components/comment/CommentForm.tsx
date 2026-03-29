import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { commentsApi } from "~/api/comments";
import { useAuthStore } from "~/store/authStore";
import type { Comment as CommentType } from "~/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommentFormProps {
	postId: string;
	parentCommentId?: string | null;
	onCancel?: () => void;
	onCommentAdded?: (comment: CommentType) => void;
	placeholder?: string;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

// ✅ js-cache-storage: Wrap localStorage reads/writes in helpers so the
//    JSON parse/stringify and try/catch aren't scattered across the component.
const PENDING_KEY = "pendingComment";

interface PendingPayload {
	content: string;
	postId: string;
	parentCommentId?: string | null;
	timestamp: number;
}

const readPending = (): PendingPayload | null => {
	try {
		const raw = localStorage.getItem(PENDING_KEY);
		return raw ? (JSON.parse(raw) as PendingPayload) : null;
	} catch {
		localStorage.removeItem(PENDING_KEY);
		return null;
	}
};

const writePending = (payload: PendingPayload) => {
	localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
};

const clearPending = () => localStorage.removeItem(PENDING_KEY);

const PENDING_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─── Component ────────────────────────────────────────────────────────────────

export const CommentForm = ({
	postId,
	parentCommentId = null,
	onCancel,
	onCommentAdded,
	placeholder = "Viết bình luận...",
}: CommentFormProps) => {
	const [content, setContent] = useState("");
	const [hasPending, setHasPending] = useState(false);
	const { user, isAuthenticated } = useAuthStore();
	const navigate = useNavigate();

	// Restore pending comment after login
	useEffect(() => {
		if (!isAuthenticated) return;
		const pending = readPending();
		if (
			pending &&
			pending.postId === postId &&
			pending.parentCommentId === parentCommentId &&
			Date.now() - pending.timestamp < PENDING_TTL_MS
		) {
			setContent(pending.content);
			setHasPending(true);
		} else {
			clearPending();
		}
	}, [isAuthenticated, postId, parentCommentId]);

	const mutation = useMutation({
		mutationFn: (text: string) =>
			commentsApi.createComment(postId, { content: text, parentCommentId }),
		onSuccess: (newComment) => {
			setContent("");
			setHasPending(false);
			clearPending();
			onCancel?.();

			onCommentAdded?.(newComment);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = content.trim();
		if (!trimmed) return;

		if (!isAuthenticated) {
			writePending({
				content: trimmed,
				postId,
				parentCommentId,
				timestamp: Date.now(),
			});
			navigate("/login", {
				state: {
					message: "Vui lòng đăng nhập để bình luận",
					returnUrl: window.location.pathname,
				},
			});
			return;
		}

		mutation.mutate(trimmed);
	};

	const charLimit = 2000;
	const charCount = content.length;
	const nearLimit = charCount > charLimit * 0.85;

	return (
		<div className="space-y-2">
			{/* Pending notice */}
			{hasPending && (
				<p className="text-[11px] text-amber-500 dark:text-amber-400 flex items-center gap-1">
					<span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
					Đã khôi phục bình luận đang chờ gửi
				</p>
			)}

			{/* Error */}
			{mutation.error && (
				<p className="text-[11px] text-red-500">{mutation.error.message}</p>
			)}

			<form onSubmit={handleSubmit} className="group">
				<div className="relative rounded-xl border border-border bg-card transition-all duration-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value.slice(0, charLimit))}
						placeholder={
							isAuthenticated
								? placeholder
								: `${placeholder} — bạn sẽ được chuyển sang trang đăng nhập khi gửi`
						}
						rows={3}
						maxLength={charLimit}
						disabled={mutation.isPending}
						className="w-full px-4 pt-3 pb-10 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none disabled:opacity-50 rounded-xl"
					/>

					{/* Footer bar inside textarea wrapper */}
					<div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-3 pb-2">
						<span
							className={`text-[11px] tabular-nums transition-colors ${nearLimit ? "text-amber-500" : "text-muted-foreground/50"}`}
						>
							{charCount}/{charLimit}
						</span>

						<div className="flex items-center gap-2">
							{onCancel && (
								<button
									type="button"
									onClick={onCancel}
									className="px-3 py-1 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
								>
									Hủy
								</button>
							)}
							<button
								type="submit"
								disabled={!content.trim() || mutation.isPending}
								className="px-3 py-1 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
							>
								{mutation.isPending
									? "Đang gửi…"
									: isAuthenticated
										? "Gửi"
										: "Đăng nhập & gửi"}
							</button>
						</div>
					</div>
				</div>

				{/* Auth hint */}
				{isAuthenticated && user && (
					<p className="mt-1.5 text-[11px] text-muted-foreground/60">
						Đang đăng nhập với tư cách{" "}
						<span className="font-medium text-muted-foreground">
							{user.username}
						</span>
					</p>
				)}
			</form>
		</div>
	);
};
