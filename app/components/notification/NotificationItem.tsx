import { AlertTriangle, CheckCircle, Heart, Info, MessageCircle, UserPlus, XCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import type { UINotification } from "~/types/notification";

interface NotificationItemProps {
	notification: UINotification;
	onMarkAsRead: (id: string) => void;
	onClick?: (notification: UINotification) => void;
}

const iconMap: Record<UINotification["type"], React.ComponentType<{ className?: string }>> = {
	success: Heart,
	info: MessageCircle,
	warning: AlertTriangle,
	error: XCircle,
};

const colorMap: Record<UINotification["type"], string> = {
	success: "text-success",
	info: "text-info",
	warning: "text-warning",
	error: "text-destructive",
};

export const NotificationItem = ({
	notification,
	onMarkAsRead,
	onClick,
}: NotificationItemProps) => {
	const Icon = iconMap[notification.type] ?? Info;
	const colorClass = colorMap[notification.type];

	const handleClick = () => {
		// Mark as read if unread
		if (!notification.read) {
			onMarkAsRead(notification.id);
		}
		// Trigger navigation handler if provided
		onClick?.(notification);
	};

	return (
		<div
			className={cn(
				"flex gap-3 p-4 cursor-pointer transition-colors hover:bg-accent border-b last:border-b-0",
				!notification.read && "bg-notification-unread",
			)}
			onClick={handleClick}
		>
			<div className={cn("flex-shrink-0 mt-0.5", colorClass)}>
				<Icon className="h-5 w-5" />
			</div>
			<div className="flex-1 space-y-1 min-w-0">
				<div className="flex items-start justify-between gap-2">
					<p className="font-medium text-sm text-foreground leading-tight">
						{notification.title}
					</p>
					{!notification.read && (
						<div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
					)}
				</div>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{notification.message}
				</p>
				<p className="text-xs text-muted-foreground">
				{new Date(notification.timestamp).toLocaleString("vi-VN", {
					day: "2-digit",
					month: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				})}
			</p>
			</div>
		</div>
	);
};
