import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { NotificationItem } from "./NotificationItem";
import type { Notification } from "./NotificationCenter";
interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationList = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}: NotificationListProps) => {
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 pb-4">
        <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={onMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-destructive hover:text-destructive"
              onClick={onClearAll}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
      <Separator />
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
          <p className="text-sm text-muted-foreground">No notifications</p>
          <p className="text-xs text-muted-foreground mt-1">
            You're all caught up!
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
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
