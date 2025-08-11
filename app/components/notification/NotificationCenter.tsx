import { useState, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  Trash2,
  Wifi,
  WifiOff,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useNotifications } from "~/hooks/useNotifications";

interface NotificationCenterProps {
  className?: string;
}

export default function NotificationCenter({
  className = "",
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shownToasts, setShownToasts] = useState<Set<string>>(new Set());

  const {
    notifications,
    unreadCount,
    isConnected,
    connectionState,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    error,
  } = useNotifications();

  const getConnectionStatusIcon = () => {
    switch (connectionState) {
      case "connected":
        return <Wifi className="w-4 h-4 text-green-500" />;
      case "connecting":
        return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionState) {
      case "connected":
        return "Đã kết nối";
      case "connecting":
        return "Đang kết nối...";
      case "disconnected":
        return "Mất kết nối";
    }
  };

  // Show Sonner toast for new notifications
  useEffect(() => {
    const newNotifications = notifications.filter(
      (notification) => !notification.read && !shownToasts.has(notification.id)
    );

    if (newNotifications.length === 0) return;

    newNotifications.forEach((notification) => {
      const getIcon = () => {
        switch (notification.type) {
          case "comment":
            return "💬";
          case "post":
            return "📝";
          case "like":
            return "❤️";
          case "bookmark":
            return "🔖";
          case "system":
            return "🔔";
          default:
            return "🔔";
        }
      };

      toast(notification.title, {
        description: notification.message,
        icon: getIcon(),
        action: {
          label: "Đánh dấu đã đọc",
          onClick: () => markAsRead(notification.id),
        },
        duration: 5000,
      });
    });

    // Update shown toasts after showing all new notifications
    setShownToasts((prev) => {
      const newSet = new Set(prev);
      newNotifications.forEach(n => newSet.add(n.id));
      return newSet;
    });
  }, [notifications, markAsRead]);

  return (
    <div>
      {/* Notification Bell Button */}
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Thông báo
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full">
                    {unreadCount} mới
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Connection Status */}
                <div
                  className="flex items-center gap-1"
                  title={getConnectionStatusText()}
                >
                  {getConnectionStatusIcon()}
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Connection Error */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  Đánh dấu tất cả đã đọc
                </button>

                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Chưa có thông báo nào
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        !notification.read
                          ? "bg-blue-50/50 dark:bg-blue-900/10"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 ${
                            notification.type === "comment"
                              ? "text-blue-500"
                              : notification.type === "post"
                                ? "text-green-500"
                                : notification.type === "like"
                                  ? "text-pink-500"
                                  : notification.type === "bookmark"
                                    ? "text-purple-500"
                                    : "text-gray-500"
                          }`}
                        >
                          {notification.type === "comment" && (
                            <Bell className="w-5 h-5" />
                          )}
                          {notification.type === "post" && (
                            <Bell className="w-5 h-5" />
                          )}
                          {notification.type === "like" && (
                            <Bell className="w-5 h-5" />
                          )}
                          {notification.type === "bookmark" && (
                            <Bell className="w-5 h-5" />
                          )}
                          {notification.type === "system" && (
                            <Bell className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4
                                className={`text-sm font-medium ${
                                  !notification.read
                                    ? "text-gray-900 dark:text-gray-100"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              <p
                                className={`text-sm mt-1 ${
                                  !notification.read
                                    ? "text-gray-700 dark:text-gray-300"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleString("vi-VN")}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded"
                                  title="Đánh dấu đã đọc"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  removeNotification(notification.id)
                                }
                                className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded"
                                title="Xóa thông báo"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {isConnected ? "Realtime notifications" : "Offline mode"}
                </span>
                <span>{notifications.length} thông báo</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
