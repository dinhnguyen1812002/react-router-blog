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
import { useState, useCallback, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { notification as notificationApi } from "~/api/notifi";
import { useWebSocket } from "~/context/WebSocketContext";
import type { Client } from "@stomp/stompjs";


export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface PostNotification {
  postId: string;
  title: string;
  excerpt: string;
  slug: string;
  public_date: string;
}

interface PublicArticleNotification {
  postId: string;
  title: string;
  slug: string;
  public_date: string;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch existing notifications via TanStack Query
  const { data: fetchedNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.getNotify(),
  });

  // Initialize local state from fetched notifications (once),
  // but keep any real-time updates already in state
  useEffect(() => {
    if (fetchedNotifications && fetchedNotifications.length) {
      const normalize = (n: Notification): Notification => {
        const allowed = new Set([
          "info",
          "success",
          "warning",
          "error",
        ] as const);
        const rawType = (n.type as string | undefined)?.toLowerCase() as
          | Notification["type"]
          | undefined;
        const type: Notification["type"] = allowed.has(rawType as any)
          ? (rawType as any)
          : "info";
        return { ...n, type };
      };
      const normalized = fetchedNotifications.map(normalize);
      setNotifications((prev) => (prev.length ? prev : normalized));
    }
  }, [fetchedNotifications]);

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: (updated) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === updated.id ? { ...n, read: true } : n)),
      );
      // keep cache fresh if used elsewhere
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Connect to WebSocket using Context
  const { subscribe, connected } = useWebSocket();

  useEffect(() => {
    if (!connected) return;

    // Subscribe to user-specific queue for post published notifications
    const postSub = subscribe("/user/queue/post/published", (postData: PostNotification) => {
      const newNotification: Notification = {
        id: postData.postId,
        type: "info",
        title: "Bài viết mới",
        message: `${postData.title}: ${postData.excerpt}`,
        timestamp: `${postData.public_date}`,
        read: false,
      };
      addNotification(newNotification, postData.postId);
    });

    // Subscribe to global article published notifications
    const articleSub = subscribe("/topic/articles/published", (notify: PublicArticleNotification) => {
      const newNotification: Notification = {
        id: notify.postId,
        type: "info",
        title: "Bài viết mới",
        message: `Một bài viết mới đã được xuất bản: ${notify.title}`,
        timestamp: `${notify.public_date}`,
        read: false,
      };
      addNotification(newNotification, notify.postId);
    });

    // Subscribe to general user notifications
    const userSub = subscribe("/user/queue/notifications", (saved: any) => {
      const newNotification: Notification = {
        id: saved.id,
        type: saved.type || "info",
        title: saved.title,
        message: saved.message,
        timestamp: saved.createdAt,
        read: false,
      };
      // Avoid duplicate if ID exists? 
      // For now just add
      setNotifications((prev) => [newNotification, ...prev]);
    });


    return () => {
      if (postSub) postSub.unsubscribe();
      if (articleSub) articleSub.unsubscribe();
      if (userSub) userSub.unsubscribe();
    };
  }, [connected, subscribe]);

  const addNotification = (newNotification: Notification, tag: string) => {
    setNotifications((prev) => [newNotification, ...prev]);
    // Browser notification
    if (Notification.permission === "granted") {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: "/notification-icon.png",
        tag: tag,
      });
    }
  };

  useEffect(() => {
    // Request browser notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = useCallback(
    (id: string) => {
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation],
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const handleClearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent"
          title={connected ? "Đã kết nối" : "Mất kết nối"}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-5 w-5 flex
              items-center justify-center p-0
              bg-notification-badge animate-in zoom-in-50
              hover:text-red-500"
            >
              {unreadCount}
            </Badge>
          )}
          {/*<span
            className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500"
            }`
          }
          />*/}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
        />
      </SheetContent>
    </Sheet>
  );
};
