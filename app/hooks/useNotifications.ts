import { useState, useCallback, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAuthStore } from '~/store/authStore';
import type { Notification, CommentNotification, PostNotification } from '~/types/notification';

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  connectionState: 'disconnected' | 'connecting' | 'connected';
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
  error: string | null;
}

export function useNotifications(): UseNotificationsReturn {
  const { user, isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscriptionIds, setSubscriptionIds] = useState<string[]>([]);

  const { isConnected, connectionState, subscribe, unsubscribe, error } = useWebSocket({
    autoConnect: isAuthenticated,
  });

  // Helper: thêm notification mới
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // giữ tối đa 50
  }, []);

  // Helper: tạo notification
  const createNotification = useCallback(
    (
      type: Notification['type'],
      title: string,
      message: string,
      data?: any
    ): Notification => ({
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      data,
      timestamp: new Date(),
      read: false,
      userId: user?.id,
    }),
    [user?.id]
  );

  // Xử lý từng loại notification
  const handleGlobalNotification = useCallback(
    (message: string) => {
      const notification = createNotification('system', 'Thông báo', message);
      addNotification(notification);
    },
    [createNotification, addNotification]
  );

  const handleCommentNotification = useCallback(
    (comment: CommentNotification) => {
      const notification = createNotification(
        'comment',
        'Bình luận mới',
        `${comment.authorUsername} đã bình luận: "${comment.content.substring(0, 50)}${
          comment.content.length > 50 ? '...' : ''
        }"`,
        comment
      );
      addNotification(notification);
    },
    [createNotification, addNotification]
  );

  const handlePostNotification = useCallback(
    (post: PostNotification) => {
      let title = 'Bài viết mới';
      let message = '';

      switch (post.action) {
        case 'created':
          title = 'Bài viết mới';
          message = `${post.authorUsername} đã tạo bài viết: "${post.title}"`;
          break;
        case 'updated':
          title = 'Bài viết cập nhật';
          message = `${post.authorUsername} đã cập nhật bài viết: "${post.title}"`;
          break;
        case 'published':
          title = 'Bài viết xuất bản';
          message = `${post.authorUsername} đã xuất bản bài viết: "${post.title}"`;
          break;
      }

      const notification = createNotification('post', title, message, post);
      addNotification(notification);
    },
    [createNotification, addNotification]
  );

  // Đăng ký các subscription
  const setupSubscriptions = useCallback(() => {
    if (!isConnected || !isAuthenticated) return;

    const newIds: string[] = [];

    try {
      // Global
      const globalId = subscribe('/topic/global', handleGlobalNotification);
      newIds.push(globalId);

      // User-specific
      if (user?.id) {
        const userId = subscribe(`/topic/user/${user.id}`, (message: any) => {
          if (typeof message === 'string') {
            handleGlobalNotification(message);
          } else {
            const notification = createNotification(
              message.type || 'system',
              message.title || 'Thông báo',
              message.message || message.content || JSON.stringify(message),
              message
            );
            addNotification(notification);
          }
        });
        newIds.push(userId);
      }

      // Posts
      const postId = subscribe('/topic/posts', (message: any) => {
        if (typeof message === 'string') {
          handleGlobalNotification(message);
        } else {
          handlePostNotification(message);
        }
      });
      newIds.push(postId);

      setSubscriptionIds(prev => {
        // Hủy các sub cũ nếu còn
        prev.forEach(id => {
          try {
            unsubscribe(id);
          } catch (err) {
            console.error('Unsubscribe error:', err);
          }
        });
        return newIds;
      });
    } catch (err) {
      console.error('Failed to setup WebSocket subscriptions:', err);
    }
  }, [
    isConnected,
    isAuthenticated,
    user?.id,
    subscribe,
    unsubscribe,
    handleGlobalNotification,
    handlePostNotification,
    createNotification,
    addNotification,
  ]);

  // Hủy subscription
  const cleanupSubscriptions = useCallback(() => {
    setSubscriptionIds(prev => {
      prev.forEach(id => {
        try {
          unsubscribe(id);
        } catch (err) {
          console.error('Unsubscribe error:', err);
        }
      });
      return [];
    });
  }, [unsubscribe]);

  // Đánh dấu đã đọc
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Điều khiển subscriptions theo trạng thái kết nối
  useEffect(() => {
    if (isConnected && isAuthenticated) {
      setupSubscriptions();
    } else {
      cleanupSubscriptions();
    }

    return () => {
      cleanupSubscriptions();
    };
  }, [isConnected, isAuthenticated, setupSubscriptions, cleanupSubscriptions]);

  return {
    notifications,
    unreadCount,
    isConnected,
    connectionState,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    error,
  };
}
