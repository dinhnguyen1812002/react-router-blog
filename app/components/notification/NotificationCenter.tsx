import { Bell } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { useNotifications } from "~/hooks/useNotifications";
import type { UINotification } from "~/types/notification";
import { NotificationList } from "./NotificationList";

// Re-export for backward compatibility
export type { UINotification as Notification } from "~/types/notification";

/**
 * NotificationCenter Component
 *
 * Displays notification bell with unread count badge.
 * Opens a sheet with notification list on click.
 * Uses WebSocket for real-time notifications.
 */
export const NotificationCenter = () => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	// Use the custom hook for notifications (includes WebSocket real-time)
	const {
		notifications,
		unreadCount,
		isLoading,
		markAsRead,
		markAllAsRead,
		refetch,
	} = useNotifications();

	/**
	 * Handle notification click - navigate to post and mark as read
	 */
	const handleNotificationClick = useCallback(
		(notification: UINotification) => {
			// Mark as read if unread
			if (!notification.read) {
				markAsRead(notification.id);
			}

			// Navigate to post if postId is available
			if (notification.postId) {
				setIsOpen(false);
				navigate(`/posts/${notification.postId}`);
			}
		},
		[markAsRead, navigate],
	);

	/**
	 * Handle clear all - refetch to get latest state
	 */
	const handleClearAll = useCallback(() => {
		refetch();
	}, [refetch]);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative hover:bg-accent"
					title="Thông báo"
					aria-label="Xem thông báo"
				>
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge
							variant="secondary"
							className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-notification-badge animate-in zoom-in-50 hover:text-red-500"
							aria-live="polite"
							aria-atomic="true"
						>
							{unreadCount}
						</Badge>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:w-[400px] p-0">
				<SheetHeader className="hidden">
					<SheetTitle>Thông báo</SheetTitle>
				</SheetHeader>
				<NotificationList
					notifications={notifications}
					onMarkAsRead={markAsRead}
					onMarkAllAsRead={markAllAsRead}
					onClearAll={handleClearAll}
					onNotificationClick={handleNotificationClick}
				/>
			</SheetContent>
		</Sheet>
	);
};
