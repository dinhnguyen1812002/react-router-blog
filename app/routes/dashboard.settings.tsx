import { useState } from 'react';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { useAuthStore } from '~/store/authStore';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    comments: true,
    likes: true,
    follows: false,
    newsletter: true
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showStats: true,
    allowComments: true
  });

  const [preferences, setPreferences] = useState({
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    theme: 'system',
    postsPerPage: 10
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Cài đặt
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý tùy chọn và cài đặt tài khoản của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Thông báo
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Thông báo email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nhận thông báo qua email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Thông báo push</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nhận thông báo trên trình duyệt
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bình luận mới</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thông báo khi có bình luận mới
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.comments}
                  onChange={(e) => setNotifications(prev => ({ ...prev, comments: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lượt thích</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thông báo khi có người thích bài viết
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.likes}
                  onChange={(e) => setNotifications(prev => ({ ...prev, likes: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Quyền riêng tư
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Hồ sơ công khai</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cho phép mọi người xem hồ sơ của bạn
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.profilePublic}
                  onChange={(e) => setPrivacy(prev => ({ ...prev, profilePublic: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Hiển thị email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cho phép hiển thị email trên hồ sơ
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.showEmail}
                  onChange={(e) => setPrivacy(prev => ({ ...prev, showEmail: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Hiển thị thống kê</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cho phép hiển thị số liệu thống kê
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.showStats}
                  onChange={(e) => setPrivacy(prev => ({ ...prev, showStats: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cho phép bình luận</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cho phép người khác bình luận bài viết
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.allowComments}
                  onChange={(e) => setPrivacy(prev => ({ ...prev, allowComments: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Tùy chọn hiển thị
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngôn ngữ
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Múi giờ
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                <option value="UTC">UTC (GMT+0)</option>
                <option value="America/New_York">New York (GMT-5)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giao diện
              </label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="system">Theo hệ thống</option>
                <option value="light">Sáng</option>
                <option value="dark">Tối</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số bài viết mỗi trang
              </label>
              <select
                value={preferences.postsPerPage}
                onChange={(e) => setPreferences(prev => ({ ...prev, postsPerPage: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value={5}>5 bài viết</option>
                <option value={10}>10 bài viết</option>
                <option value={20}>20 bài viết</option>
                <option value={50}>50 bài viết</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Data & Account */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Dữ liệu & Tài khoản
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Xuất dữ liệu</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tải xuống tất cả dữ liệu của bạn
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Xuất
              </Button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Xóa tài khoản</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Xóa vĩnh viễn tài khoản và tất cả dữ liệu
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </Button>
              </div>
              <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Hành động này không thể hoàn tác. Tất cả bài viết, bình luận và dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>Lưu tất cả cài đặt</span>
        </Button>
      </div>
    </div>
  );
}