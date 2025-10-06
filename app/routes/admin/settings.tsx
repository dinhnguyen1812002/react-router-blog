import { useState } from "react";
import { Save, Globe, Mail, Shield, Database, Palette, Bell, Users } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "My Blog",
    siteDescription: "A modern blog platform",
    siteUrl: "https://myblog.com",
    adminEmail: "admin@myblog.com",
    timezone: "Asia/Ho_Chi_Minh",
    language: "vi",
    
    // Content Settings
    postsPerPage: 10,
    allowComments: true,
    moderateComments: true,
    allowRegistration: true,
    defaultUserRole: "USER",
    
    // Email Settings
    emailProvider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    
    // Security Settings
    enableTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    
    // Appearance Settings
    theme: "light",
    primaryColor: "#3B82F6",
    logoUrl: "",
    faviconUrl: "",
    
    // Notification Settings
    emailNotifications: true,
    newPostNotifications: true,
    commentNotifications: true,
    systemNotifications: true,
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving settings:", settings);
    alert("Cài đặt đã được lưu thành công!");
  };

  const tabs = [
    { id: "general", name: "Tổng quan", icon: Globe },
    { id: "content", name: "Nội dung", icon: Users },
    { id: "email", name: "Email", icon: Mail },
    { id: "security", name: "Bảo mật", icon: Shield },
    { id: "appearance", name: "Giao diện", icon: Palette },
    { id: "notifications", name: "Thông báo", icon: Bell },
    { id: "system", name: "Hệ thống", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cài đặt hệ thống</h1>
          <p className="text-gray-600 dark:text-gray-400">Quản lý cấu hình và tùy chỉnh hệ thống</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Lưu cài đặt</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cài đặt tổng quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên website</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL website</label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả website</label>
                  <textarea
                    rows={3}
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email quản trị</label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Múi giờ</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">New York (UTC-5)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Content Settings */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cài đặt nội dung</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số bài viết mỗi trang</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={settings.postsPerPage}
                    onChange={(e) => handleSettingChange('postsPerPage', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vai trò mặc định</label>
                  <select
                    value={settings.defaultUserRole}
                    onChange={(e) => handleSettingChange('defaultUserRole', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USER">Người dùng</option>
                    <option value="AUTHOR">Tác giả</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowComments"
                    checked={settings.allowComments}
                    onChange={(e) => handleSettingChange('allowComments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-700 rounded"
                  />
                  <label htmlFor="allowComments" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    Cho phép bình luận
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="moderateComments"
                    checked={settings.moderateComments}
                    onChange={(e) => handleSettingChange('moderateComments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-700 rounded"
                  />
                  <label htmlFor="moderateComments" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    Kiểm duyệt bình luận trước khi hiển thị
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowRegistration"
                    checked={settings.allowRegistration}
                    onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-700 rounded"
                  />
                  <label htmlFor="allowRegistration" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    Cho phép đăng ký tài khoản mới
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cài đặt email</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Host</label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Port</label>
                  <input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Username</label>
                  <input
                    type="text"
                    value={settings.smtpUsername}
                    onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Password</label>
                  <input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cài đặt bảo mật</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thời gian hết hạn phiên (giờ)</label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số lần đăng nhập sai tối đa</label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Độ dài mật khẩu tối thiểu</label>
                  <input
                    type="number"
                    min="6"
                    max="20"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableTwoFactor"
                  checked={settings.enableTwoFactor}
                  onChange={(e) => handleSettingChange('enableTwoFactor', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-700 rounded"
                />
                <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  Bật xác thực hai yếu tố (2FA)
                </label>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cài đặt giao diện</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chủ đề</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="light">Sáng</option>
                    <option value="dark">Tối</option>
                    <option value="auto">Tự động</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Màu chủ đạo</label>
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="mt-1 block w-full h-10 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Logo</label>
                  <input
                    type="url"
                    value={settings.logoUrl}
                    onChange={(e) => handleSettingChange('logoUrl', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Favicon</label>
                  <input
                    type="url"
                    value={settings.faviconUrl}
                    onChange={(e) => handleSettingChange('faviconUrl', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cài đặt thông báo</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-700 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    Bật thông báo email
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newPostNotifications"
                    checked={settings.newPostNotifications}
                    onChange={(e) => handleSettingChange('newPostNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-700 rounded"
                  />
                  <label htmlFor="newPostNotifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    Thông báo bài viết mới
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="commentNotifications"
                    checked={settings.commentNotifications}
                    onChange={(e) => handleSettingChange('commentNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-700 rounded"
                  />
                  <label htmlFor="commentNotifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    Thông báo bình luận mới
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="systemNotifications"
                    checked={settings.systemNotifications}
                    onChange={(e) => handleSettingChange('systemNotifications', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-700 rounded"
                  />
                  <label htmlFor="systemNotifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    Thông báo hệ thống
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Thông tin hệ thống</h2>
              <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Phiên bản:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">v1.0.0</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Database:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">PostgreSQL 14</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Server:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Node.js 18</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Uptime:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">15 ngày 4 giờ</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  Xóa cache
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                  Backup database
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Kiểm tra cập nhật
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}