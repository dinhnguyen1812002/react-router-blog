import { useState } from 'react';
import { useNotifications } from '~/hooks/useNotifications';
import { Button } from '~/components/ui/button';
import { Bell, MessageCircle, FileText, Heart, Bookmark, AlertCircle } from 'lucide-react';

// Component demo chỉ để development - có thể xóa khi production
export default function NotificationDemo() {
  const { isConnected, connectionState, error } = useNotifications();
  const [testCount, setTestCount] = useState(0);

  const createTestNotification = (type: 'comment' | 'post' | 'like' | 'bookmark' | 'system') => {
    const messages = {
      comment: 'Bạn có bình luận mới từ Nguyễn Văn A',
      post: 'Bài viết "React Hooks Guide" đã được xuất bản',
      like: 'Bài viết của bạn được 5 lượt thích mới',
      bookmark: 'Bài viết "TypeScript Tips" đã được lưu',
      system: 'Hệ thống sẽ bảo trì vào 2:00 AM ngày mai'
    };

    // Simulate notification by dispatching a custom event
    const notification = {
      id: `test_${Date.now()}_${Math.random()}`,
      type,
      title: type === 'comment' ? 'Bình luận mới' :
             type === 'post' ? 'Bài viết mới' :
             type === 'like' ? 'Lượt thích mới' :
             type === 'bookmark' ? 'Đã lưu' : 'Thông báo hệ thống',
      message: messages[type],
      timestamp: new Date(),
      read: false
    };

    // This would normally come from WebSocket
    window.dispatchEvent(new CustomEvent('test-notification', { detail: notification }));
    setTestCount(prev => prev + 1);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Notification System Demo</h3>
      
      {/* Connection Status */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">WebSocket Status:</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionState === 'connected' ? 'bg-green-500' :
              connectionState === 'connecting' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}></div>
            <span className="text-sm capitalize">{connectionState}</span>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
        )}
      </div>

      {/* Test Buttons */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Test notifications (đã tạo {testCount} thông báo):
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => createTestNotification('comment')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Comment
          </Button>
          
          <Button
            onClick={() => createTestNotification('post')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Post
          </Button>
          
          <Button
            onClick={() => createTestNotification('like')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Like
          </Button>
          
          <Button
            onClick={() => createTestNotification('bookmark')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4" />
            Bookmark
          </Button>
          
          <Button
            onClick={() => createTestNotification('system')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 col-span-2"
          >
            <AlertCircle className="w-4 h-4" />
            System
          </Button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
        <p className="text-blue-800 dark:text-blue-200">
          💡 Trong production, thông báo sẽ được gửi từ backend qua WebSocket khi có sự kiện thực tế xảy ra.
        </p>
      </div>
    </div>
  );
}