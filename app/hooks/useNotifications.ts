import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { notify } from "~/api/notifi";
import { useWebSocket } from "~/context/WebSocketContext";
import { useAuthStore } from "~/store/authStore";
import type {
	Notification,
	NotificationType,
	UINotification,
	WebSocketNotification,
} from "~/types/notification";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseNotificationsReturn {
	notifications: UINotification[];
	unreadCount: number;
	isLoading: boolean;
	error: Error | null;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	refetch: () => void;
}

// ─── Helper Functions ───────────────────────────────────────────────────────────

/**
 * Maps notification type from API to UI color scheme
 */
const mapNotificationType = (type: NotificationType): UINotification["type"] => {
	switch (type) {
		case "NEW_LIKE":
		case "NEW_FOLLOWER":
			return "success";
		case "NEW_COMMENT":
		case "POST_PUBLISHED":
			return "info";
		case "MENTION":
			return "warning";
		case "SYSTEM":
		default:
			return "info";
	}
};

/**
 * Transforms API/WebSocket notification to UI format
 */
const transformToUINotification = (
	notification: Notification | WebSocketNotification,
): UINotification => ({
	id: notification.notificationId,
	title: notification.title,
	message: notification.message,
	type: mapNotificationType(notification.type),
	timestamp: notification.createdAt,
	read: notification.isRead,
	postId: notification.postId,
	postTitle: notification.postTitle,
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotifications(): UseNotificationsReturn {
	const queryClient = useQueryClient();
	const { user, isAuthenticated } = useAuthStore();
	const { subscribe, connected } = useWebSocket();

	// ✅ rerender-use-ref-transient-values: Track processed WebSocket notifications
	//    to prevent duplicates without triggering re-renders
	const processedIdsRef = useRef<Set<string>>(new Set());

	// ✅ rerender-derived-state: Local state for real-time notifications from WebSocket
	const [realtimeNotifications, setRealtimeNotifications] = useState<
		WebSocketNotification[]
	>([]);

	// ─── Query: Fetch notifications from API ──────────────────────────────────────

	const {
		data: apiNotifications = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["notifications"],
		queryFn: async (): Promise<Notification[]> => {
			const data = await notify.getNotify();
			return data ?? [];
		},
		refetchOnWindowFocus: true,
		refetchInterval: 30 * 1000, // Refetch every 30 seconds
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		enabled: isAuthenticated, // Only fetch when authenticated
	});

	// ─── WebSocket: Subscribe to real-time notifications ──────────────────────

	useEffect(() => {
		// ✅ js-early-exit: Only subscribe when connected and authenticated
		if (!connected || !isAuthenticated || !user?.username) return;

		// Subscribe to user-specific notification queue
		// Backend sends notifications to: /user/{username}/queue/notifications
		const subscription = subscribe(
			`/user/${user.username}/queue/notifications`,
			(message: unknown) => {
				const wsNotification = message as WebSocketNotification;

				// ✅ js-early-exit: Skip if already processed
				if (processedIdsRef.current.has(wsNotification.notificationId)) {
					return;
				}

				// Mark as processed
				processedIdsRef.current.add(wsNotification.notificationId);

				// Add to real-time notifications
				setRealtimeNotifications((prev) => {
					// ✅ js-set-map-lookups: Check for duplicates efficiently
					const exists = prev.some(
						(n) => n.notificationId === wsNotification.notificationId,
					);
					if (exists) return prev;
					return [wsNotification, ...prev];
				});
			},
		);

		return () => {
			subscription?.unsubscribe();
		};
	}, [connected, isAuthenticated, user?.username, subscribe]);

	// ─── Memo: Merge API and real-time notifications ───────────────────────────

	const notifications: UINotification[] = useMemo(() => {
		// ✅ js-combine-iterations: Transform and merge in one pass
		const apiList = apiNotifications.map(transformToUINotification);
		const wsList = realtimeNotifications.map(transformToUINotification);

		// Merge and deduplicate (WebSocket notifications take precedence)
		const mergedMap = new Map<string, UINotification>();

		// Add API notifications first
		for (const n of apiList) {
			mergedMap.set(n.id, n);
		}

		// Override with real-time notifications (newer)
		for (const n of wsList) {
			mergedMap.set(n.id, n);
		}

		// Convert to array and sort: unread first, then newest
		return Array.from(mergedMap.values()).sort((a, b) => {
			// Unread notifications first
			if (a.read !== b.read) {
				return a.read ? 1 : -1;
			}
			// Then by timestamp (newest first)
			return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
		});
	}, [apiNotifications, realtimeNotifications]);

	// ─── Memo: Calculate unread count ───────────────────────────────────────────

	const unreadCount = useMemo(
		() => notifications.filter((n) => !n.read).length,
		[notifications],
	);

	// ─── Mutation: Mark single notification as read ─────────────────────────────

	const markAsReadMutation = useMutation({
		mutationFn: notify.markAsRead,
		onMutate: async (notificationId: string) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["notifications"] });

			// Snapshot previous state
			const previousData = queryClient.getQueryData<Notification[]>([
				"notifications",
			]);

			// Optimistically update API cache
			queryClient.setQueryData<Notification[]>(["notifications"], (old) => {
				if (!old) return old;
				return old.map((n) =>
					n.notificationId === notificationId ? { ...n, isRead: true } : n,
				);
			});

			// Update real-time state
			setRealtimeNotifications((prev) =>
				prev.map((n) =>
					n.notificationId === notificationId ? { ...n, isRead: true } : n,
				),
			);

			return { previousData };
		},
		onError: (err, notificationId, context) => {
			// Rollback on error
			if (context?.previousData) {
				queryClient.setQueryData(["notifications"], context.previousData);
			}
			console.error("[useNotifications] Failed to mark as read:", err);
		},
		onSettled: () => {
			// Invalidate to ensure consistency
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	// ─── Mutation: Mark all notifications as read ───────────────────────────────

	const markAllAsReadMutation = useMutation({
		mutationFn: notify.markAllAsRead,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["notifications"] });
			const previousData = queryClient.getQueryData<Notification[]>([
				"notifications",
			]);

			// Optimistically mark all as read
			queryClient.setQueryData<Notification[]>(["notifications"], (old) => {
				if (!old) return old;
				return old.map((n) => ({ ...n, isRead: true }));
			});

			// Clear real-time notifications
			setRealtimeNotifications([]);
			processedIdsRef.current.clear();

			return { previousData };
		},
		onError: (err, _variables, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(["notifications"], context.previousData);
			}
			console.error("[useNotifications] Failed to mark all as read:", err);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	// ─── Callbacks ────────────────────────────────────────────────────────────────

	const markAsRead = useCallback(
		(notificationId: string) => {
			markAsReadMutation.mutate(notificationId);
		},
		[markAsReadMutation],
	);

	const markAllAsRead = useCallback(() => {
		markAllAsReadMutation.mutate();
	}, [markAllAsReadMutation]);

	// ─── Cleanup: Reset state on logout ─────────────────────────────────────────

	useEffect(() => {
		if (!isAuthenticated) {
			setRealtimeNotifications([]);
			processedIdsRef.current.clear();
		}
	}, [isAuthenticated]);

	return {
		notifications,
		unreadCount,
		isLoading,
		error,
		markAsRead,
		markAllAsRead,
		refetch,
	};
}
