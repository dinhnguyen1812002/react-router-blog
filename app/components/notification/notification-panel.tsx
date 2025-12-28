

import { X } from 'lucide-react';
import { Notification } from './notification';
import { Button } from '~/components/ui/button';

interface NotificationItem {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onRemoveNotification: (id: string) => void;
}

export function NotificationPanel({
  isOpen,
  notifications,
  onClose,
  onRemoveNotification,
}: NotificationPanelProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-background shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close notifications"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="space-y-2">
                  <p className="text-muted-foreground">No notifications yet</p>
                  <p className="text-sm text-muted-foreground">
                    Stay tuned for updates
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {notifications.map((notification) => (
                  <div key={notification.id}>
                    <Notification
                      variant={notification.variant}
                      title={notification.title}
                      description={notification.description}
                      onClose={() => onRemoveNotification(notification.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
