import { Bell } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Badge } from "~/components/ui/badge";
import { NotificationList } from "./NotificationList";
import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify, type Notification as APINotification } from "~/api/notifi";

// Transform API Notification to UI Notification format
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
}

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch notifications with caching and automatic refetching
  const {
    data: notificationsData = [],
    isLoading,
    error,
    refetch: refetchNotifications
  } = useQuery<APINotification[]>({
    queryKey: ['notifications'],
    queryFn: () => notify.getNotify(),
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Transform API notifications to UI format
  const notifications: Notification[] = useMemo(() => {
    return notificationsData
      .map((n) => ({
        id: n.notificationId,
        title: n.title,
        message: n.message,
        type: (n.type?.toLowerCase() || "info") as "info" | "success" | "warning" | "error",
        timestamp: n.createdAt,
        read: n.isRead,
      }))
      .sort((a, b) => {
        // Sắp xếp: unread trước, sau đó mới nhất trước
        if (a.read !== b.read) {
          return a.read ? 1 : -1;
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }, [notificationsData]);

  // Memoize unread count
  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  // Mark notification as read mutation with optimistic updates
  const { mutate: markAsRead } = useMutation({
    mutationFn: notify.markAsRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousNotifications = queryClient.getQueryData<APINotification[]>(['notifications']);

      if (previousNotifications) {
        queryClient.setQueryData<APINotification[]>(
          ['notifications'],
          previousNotifications.map(notification =>
            notification.notificationId === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
      console.error('Failed to mark notification as read:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all notifications as read mutation
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: notify.markAllAsRead,
    onSuccess: () => {
      // Invalidate và refetch để cập nhật UI
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Failed to mark all notifications as read:', error);
    },
  });

  // Handle mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length === 0) return;

    markAllAsRead();
  }, [notifications, markAllAsRead]);

  // Handle clearing all notifications
  const handleClearAll = useCallback(() => {
    // Implement clear all logic if needed
    // For now, just refetch to get latest state
    refetchNotifications();
  }, [refetchNotifications]);

  // Memoize notification list to prevent unnecessary re-renders
  const notificationList = useMemo(() => (
    <NotificationList
      notifications={notifications}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onClearAll={handleClearAll}
    />
  ), [notifications, markAsRead, handleMarkAllAsRead, handleClearAll]);

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
        {notificationList}
      </SheetContent>
    </Sheet>
  );
};
