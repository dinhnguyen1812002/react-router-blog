/**
 * Notification types matching the backend API and WebSocket specification
 * @see docs/notification-flow.md
 */

// ─── API Response Types ───────────────────────────────────────────────────────

/**
 * Base notification record from database/API
 * GET /api/notifications/{userId}
 */
export interface Notification {
	notificationId: string;
	type: NotificationType;
	title: string;
	message: string;
	isRead: boolean;
	createdAt: string;
	// Optional fields based on notification type
	postId?: string;
	postTitle?: string;
	commenterUsername?: string;
}

/**
 * Paginated notification list response
 */
export interface NotificationListResponse {
	content: Notification[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

// ─── WebSocket Message Types ──────────────────────────────────────────────────

/**
 * Real-time WebSocket notification message
 * Received on: /user/{username}/queue/notifications
 */
export interface WebSocketNotification {
	notificationId: string;
	type: NotificationType;
	title: string;
	message: string;
	isRead: boolean;
	createdAt: string;
	// Additional context for NEW_COMMENT notifications
	postTitle: string;
	commenterUsername: string;
	postId: string;
}

// ─── Enums ────────────────────────────────────────────────────────────────────

export type NotificationType =
	| "NEW_COMMENT"
	| "NEW_LIKE"
	| "NEW_FOLLOWER"
	| "POST_PUBLISHED"
	| "MENTION"
	| "SYSTEM";

/**
 * Maps notification types to UI display configurations
 */
export const NotificationTypeConfig: Record<
	NotificationType,
	{ label: string; color: string; icon: string }
> = {
	NEW_COMMENT: { label: "Bình luận mới", color: "info", icon: "MessageCircle" },
	NEW_LIKE: { label: "Lượt thích", color: "success", icon: "Heart" },
	NEW_FOLLOWER: { label: "Người theo dõi", color: "success", icon: "UserPlus" },
	POST_PUBLISHED: { label: "Bài viết mới", color: "info", icon: "FileText" },
	MENTION: { label: "Nhắc đến bạn", color: "warning", icon: "AtSign" },
	SYSTEM: { label: "Thông báo hệ thống", color: "default", icon: "Bell" },
};

// ─── UI Types ───────────────────────────────────────────────────────────────────

/**
 * UI-friendly notification format for components
 */
export interface UINotification {
	id: string;
	title: string;
	message: string;
	type: "info" | "success" | "warning" | "error";
	timestamp: string;
	read: boolean;
	postId?: string;
	postTitle?: string;
}

/**
 * Props for notification item component
 */
export interface NotificationItemProps {
	notification: UINotification;
	onMarkAsRead: (id: string) => void;
	onClick?: (notification: UINotification) => void;
}

/**
 * Props for notification list component
 */
export interface NotificationListProps {
	notifications: UINotification[];
	onMarkAsRead: (id: string) => void;
	onMarkAllAsRead: () => void;
	onClearAll: () => void;
	onNotificationClick?: (notification: UINotification) => void;
}

// ─── API Request/Response Types ────────────────────────────────────────────────

/**
 * Mark notification as read response
 * PUT /api/notifications/{id}/read
 */
export interface MarkAsReadResponse {
	notificationId: string;
	isRead: true;
}

/**
 * Create comment request (triggers notification on backend)
 * POST /api/comments/{postId}
 */
export interface CreateCommentRequest {
	content: string;
	parentCommentId?: string | null;
}

/**
 * Create comment response
 */
export interface CreateCommentResponse {
	id: string;
	content: string;
	createdAt: string;
	user: {
		id: string;
		username: string;
		avatar: string;
	};
	postId: string;
}
