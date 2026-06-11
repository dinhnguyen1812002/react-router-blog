import { Bell } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import type { UINotification } from "~/types/notification";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
	notifications: UINotification[];
	onMarkAsRead: (id: string) => void;
	onMarkAllAsRead: () => void;
	onClearAll: () => void;
	onNotificationClick?: (notification: UINotification) => void;
}

export const NotificationList = ({
	notifications,
	onMarkAsRead,
	onMarkAllAsRead,
	onClearAll,
	onNotificationClick,
}: NotificationListProps) => {
	const hasUnread = notifications.some((n) => !n.read);

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between p-6 pb-4">
				<h3 className="text-lg font-semibold text-foreground">Thông báo</h3>
				{notifications.length > 0 && (
					<div className="flex gap-2">
						{hasUnread && (
							<Button
								variant="ghost"
								size="sm"
								className="h-8 text-xs"
								onClick={onMarkAllAsRead}
							>
								Đánh dấu tất cả đã đọc
							</Button>
						)}
						<Button
							variant="ghost"
							size="sm"
							className="h-8 text-xs text-destructive hover:text-destructive"
							onClick={onClearAll}
						>
							Làm mới
						</Button>
					</div>
				)}
			</div>
			<Separator />
			{notifications.length === 0 ? (
				<div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
					<Bell className="w-8 h-8 text-muted-foreground/30 mb-3" strokeWidth={1.5} />
					<p className="text-sm text-muted-foreground">Không có thông báo</p>
					<p className="text-xs text-muted-foreground mt-1">
						Bạn đã đọc tất cả thông báo!
					</p>
				</div>
			) : (
				<ScrollArea className="flex-1">
					<div className="flex flex-col">
						{notifications.map((notification, index) => (
							<NotificationItem
								key={notification.id || `notification-${index}`}
								notification={notification}
								onMarkAsRead={onMarkAsRead}
								onClick={onNotificationClick}
							/>
						))}
					</div>
				</ScrollArea>
			)}
		</div>
	);
};
