import { useEffect, useState } from 'react';
import { X, Bell, MessageCircle, FileText, Heart, Bookmark, AlertCircle, CheckCircle, Info } from 'lucide-react';
import type { Notification } from '~/types/notification';

interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function NotificationToast({
  notification,
  onClose,
  onMarkAsRead,
  autoClose = true,
  autoCloseDelay = 5000
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Show animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto close
    let closeTimer: NodeJS.Timeout;
    if (autoClose) {
      closeTimer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
    }

    // Mark as read after a short delay
    const readTimer = setTimeout(() => {
      if (!notification.read) {
        onMarkAsRead(notification.id);
      }
    }, 1000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
      clearTimeout(readTimer);
    };
  }, [notification.id, notification.read, autoClose, autoCloseDelay, onMarkAsRead]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'comment':
        return <MessageCircle className="w-5 h-5" />;
      case 'post':
        return <FileText className="w-5 h-5" />;
      case 'like':
        return <Heart className="w-5 h-5" />;
      case 'bookmark':
        return <Bookmark className="w-5 h-5" />;
      case 'system':
        return <Info className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (notification.type) {
      case 'comment':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
      case 'post':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'like':
        return 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200';
      case 'bookmark':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200';
      case 'system':
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
    }
  };

  const getIconColorClasses = () => {
    switch (notification.type) {
      case 'comment':
        return 'text-blue-600 dark:text-blue-400';
      case 'post':
        return 'text-green-600 dark:text-green-400';
      case 'like':
        return 'text-pink-600 dark:text-pink-400';
      case 'bookmark':
        return 'text-purple-600 dark:text-purple-400';
      case 'system':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        rounded-lg border shadow-lg backdrop-blur-sm p-4
        ${getColorClasses()}
      `}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${getIconColorClasses()}`}>
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold mb-1">
              {notification.title}
            </h4>
            <p className="text-sm opacity-90 leading-relaxed">
              {notification.message}
            </p>
            <p className="text-xs opacity-70 mt-2">
              {new Date(notification.timestamp).toLocaleTimeString('vi-VN')}
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationToast;