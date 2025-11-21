import { CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import { type Notification } from "./NotificationCenter";
import { cn } from "~/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const iconMap: Record<Notification["type"], React.ComponentType<any>> = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const colorMap = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  error: "text-destructive",
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
}: NotificationItemProps) => {
  const Icon = iconMap[notification.type] ?? Info;
  const colorClass = colorMap[notification.type];

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
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
          {notification.timestamp}
        </p>
      </div>
    </div>
  );
};
