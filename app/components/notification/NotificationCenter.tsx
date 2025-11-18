import { Bell } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Badge } from "~/components/ui/badge";
import { NotificationList } from "./NotificationList";
import { useState, useCallback, useEffect, useRef } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

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
  slug: string;
  excerpt: string;
  publicDate: string;
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Welcome!",
    message: "Your notification system is ready to use.",
    timestamp: "Now",
    read: false,
  },
];

export const NotificationCenter = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(sampleNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  // Connect to WebSocket using SockJS
  useEffect(() => {
    const stompClient = new Client({
      // Use SockJS instead of native WebSocket
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log("STOMP Connected");
        setConnected(true);

        // Subscribe to /topic/post/published
        stompClient.subscribe("/topic/post/published", (message: IMessage) => {
          try {
            const postData: PostNotification = JSON.parse(message.body);

            const newNotification: Notification = {
              id: postData.postId,
              type: "info",
              title: "Bài viết mới",
              message: `${postData.title}: ${postData.excerpt}`,
              timestamp: `${postData.publicDate}`,
              read: false,
            };

            setNotifications((prev) => [newNotification, ...prev]);

            // Browser notification
            if (Notification.permission === "granted") {
              new Notification(newNotification.title, {
                body: newNotification.message,
                icon: "/notification-icon.png",
                tag: postData.postId,
              });
            }
            console.log("Notification received", newNotification);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });
      },

      onDisconnect: () => {
        console.log("STOMP Disconnected");
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setConnected(false);
      },

      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
      },

      debug: (str) => {
        if (process.env.NODE_ENV === "development") {
          console.log("STOMP Debug:", str);
        }
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    // Request browser notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Cleanup
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

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
