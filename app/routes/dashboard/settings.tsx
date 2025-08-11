import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/Input';
import { useAuthStore } from '~/store/authStore';
import { authApi } from '~/api/auth';

import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  AlertTriangle,
  User,
  Mail,
  Camera,
  Save,
  Eye,
  EyeOff,
  Check,
  X,
  Moon,
  Sun,
  Monitor,
  LogOut
} from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser, logout } = useAuthStore();

  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'appearance' | 'data'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState<string>('blue'); // Thêm state cho màu sắc chủ đề
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    // bio: user?.bio || '',
    // avatar: user?.avatar || '',
    // socialMediaLinks: user?.socialMediaLinks || {},
   
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    commentNotifications: true,
    likeNotifications: true,
    followNotifications: true,
    newsletterSubscription: false,
    weeklyDigest: true,
    mentionNotifications: true
  });
  const handleColorChange = (color: string) => {
    setThemeColor(color);
    // Lưu màu sắc vào localStorage
    localStorage.setItem('theme-color', color);
    // Áp dụng màu sắc cho ứng dụng
    applyThemeColor(color);
  };

  // Hàm áp dụng màu sắc cho ứng dụng
  const applyThemeColor = (color: string) => {
    const root = document.documentElement;
    
    // Xóa tất cả các class màu sắc hiện tại
    root.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-red', 'theme-orange', 'theme-pink', 'theme-indigo', 'theme-yellow');
    
    // Thêm class màu sắc mới
    root.classList.add(`theme-${color}`);
  };
useEffect(() => {
    const savedColor = localStorage.getItem('theme-color') || 'blue';
    setThemeColor(savedColor);
    applyThemeColor(savedColor);
  }, []);

  // Update profile mutation
  // const updateProfileMutation = useMutation({
  //   mutationFn: (data: any) => authApi.updateProfile(data),
  //   onSuccess: (response) => {
  //     setUser(response.user);
  //     queryClient.invalidateQueries({ queryKey: ['user-profile'] });
  //     showSuccessMessage();
  //   },
  //   onError: (error: any) => {
  //     setSaveError(error.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
  //     setTimeout(() => setSaveError(null), 5000);
  //   }
  // });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => authApi.changePassword(data),
    onSuccess: () => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      showSuccessMessage();
    },
    onError: (error: any) => {
      setSaveError(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      setTimeout(() => setSaveError(null), 5000);
    }
  });

  const showSuccessMessage = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // const handleProfileSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   updateProfileMutation.mutate(profileData);
  // };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      setTimeout(() => setSaveError(null), 5000);
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to update notification settings
    showSuccessMessage();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
      // API call to delete account
      logout();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Cài đặt
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:px-0 sm:mx-0 space-x-2">
        <Button
          variant={activeTab === 'profile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('profile')}
          className="flex items-center whitespace-nowrap"
        >
          <User className="w-4 h-4 mr-2" />
          Hồ sơ cá nhân
        </Button>
        <Button
          variant={activeTab === 'account' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('account')}
          className="flex items-center whitespace-nowrap"
        >
          <Shield className="w-4 h-4 mr-2" />
          Bảo mật
        </Button>
        <Button
          variant={activeTab === 'notifications' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('notifications')}
          className="flex items-center whitespace-nowrap"
        >
          <Bell className="w-4 h-4 mr-2" />
          Thông báo
        </Button>
        <Button
          variant={activeTab === 'appearance' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('appearance')}
          className="flex items-center whitespace-nowrap"
        >
          <Palette className="w-4 h-4 mr-2" />
          Giao diện
        </Button>
        <Button
          variant={activeTab === 'data' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('data')}
          className="flex items-center whitespace-nowrap"
        >
          <Download className="w-4 h-4 mr-2" />
          Dữ liệu
        </Button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-md p-4 flex items-center">
          <Check className="w-5 h-5 mr-2" />
          <span>Lưu thành công!</span>
        </div>
      )}

      {/* Error Message */}
      {saveError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-md p-4 flex items-center">
          <X className="w-5 h-5 mr-2" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Profile Settings */}
      {/* {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit}>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Thông tin cá nhân
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
             
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative group">
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt={profileData.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Thay đổi ảnh đại diện
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Khuyến nghị: 400x400px, tối đa 2MB
                  </p>
                </div>
              </div>

          
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tên người dùng
                </label>
                <Input
                  id="username"
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  className="w-full"
                  placeholder="username"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  URL của bạn: blogplatform.com/profile/{profileData.username}
                </p>
              </div>

              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full"
                  placeholder="email@example.com"
                />
              </div>

              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giới thiệu
                </label>
                <textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  rows={4}
                  placeholder="Viết một vài điều về bản thân..."
                />
              </div>

            
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <Input
                  id="link"
                  type="url"
                  value={profileData.link}
                  onChange={(e) => setProfileData({...profileData, link: e.target.value})}
                  className="w-full"
                  placeholder="https://example.com"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang lưu...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thay đổi
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )} */}

      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Change Password */}
          <form onSubmit={handlePasswordSubmit}>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Đổi mật khẩu
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mật khẩu mới
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={changePasswordMutation.isPending}>
                    {changePasswordMutation.isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang lưu...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="w-4 h-4 mr-2" />
                        Cập nhật mật khẩu
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Vùng nguy hiểm
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Xóa tài khoản
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Khi xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
                  </p>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa tài khoản
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleNotificationSubmit}>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Cài đặt thông báo
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Thông báo qua email
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nhận thông báo qua email
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      className="absolute w-0 h-0 opacity-0"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                    />
                    <label
                      htmlFor="emailNotifications"
                      className={`absolute inset-0 cursor-pointer rounded-full ${notificationSettings.emailNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </label>
                  </div>
                </div>

                {/* Comment Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Thông báo bình luận
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nhận thông báo khi có người bình luận bài viết của bạn
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="commentNotifications"
                      className="absolute w-0 h-0 opacity-0"
                      checked={notificationSettings.commentNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, commentNotifications: e.target.checked})}
                    />
                    <label
                      htmlFor="commentNotifications"
                      className={`absolute inset-0 cursor-pointer rounded-full ${notificationSettings.commentNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${notificationSettings.commentNotifications ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </label>
                  </div>
                </div>

                {/* Like Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Thông báo lượt thích
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nhận thông báo khi có người thích bài viết của bạn
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="likeNotifications"
                      className="absolute w-0 h-0 opacity-0"
                      checked={notificationSettings.likeNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, likeNotifications: e.target.checked})}
                    />
                    <label
                      htmlFor="likeNotifications"
                      className={`absolute inset-0 cursor-pointer rounded-full ${notificationSettings.likeNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${notificationSettings.likeNotifications ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </label>
                  </div>
                </div>

                {/* Follow Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Thông báo theo dõi
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nhận thông báo khi có người theo dõi bạn
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="followNotifications"
                      className="absolute w-0 h-0 opacity-0"
                      checked={notificationSettings.followNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, followNotifications: e.target.checked})}
                    />
                    <label
                      htmlFor="followNotifications"
                      className={`absolute inset-0 cursor-pointer rounded-full ${notificationSettings.followNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${notificationSettings.followNotifications ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </label>
                  </div>
                </div>

                {/* Mention Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Thông báo nhắc đến
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nhận thông báo khi có người nhắc đến bạn trong bình luận
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="mentionNotifications"
                      className="absolute w-0 h-0 opacity-0"
                      checked={notificationSettings.mentionNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, mentionNotifications: e.target.checked})}
                    />
                    <label
                      htmlFor="mentionNotifications"
                      className={`absolute inset-0 cursor-pointer rounded-full ${notificationSettings.mentionNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${notificationSettings.mentionNotifications ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </label>
                  </div>
                </div>

                {/* Weekly Digest */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Tóm tắt hàng tuần
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nhận email tóm tắt hoạt động hàng tuần
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="weeklyDigest"
                      className="absolute w-0 h-0 opacity-0"
                      checked={notificationSettings.weeklyDigest}
                      onChange={(e) => setNotificationSettings({...notificationSettings, weeklyDigest: e.target.checked})}
                    />
                    <label
                      htmlFor="weeklyDigest"
                      className={`absolute inset-0 cursor-pointer rounded-full ${notificationSettings.weeklyDigest ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${notificationSettings.weeklyDigest ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </label>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Bản tin
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Đăng ký nhận bản tin từ BlogPlatform
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="newsletterSubscription"
                      className="absolute w-0 h-0 opacity-0"
                      checked={notificationSettings.newsletterSubscription}
                      onChange={(e) => setNotificationSettings({...notificationSettings, newsletterSubscription: e.target.checked})}
                    />
                    <label
                      htmlFor="newsletterSubscription"
                      className={`absolute inset-0 cursor-pointer rounded-full ${notificationSettings.newsletterSubscription ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${notificationSettings.newsletterSubscription ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* Appearance Settings */}
      {/* {activeTab === 'appearance' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Cài đặt giao diện
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
                Chủ đề
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  className={`p-4 rounded-lg border ${theme === 'light' ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200 dark:border-gray-700'} bg-white text-gray-900 flex flex-col items-center space-y-2`}
                  onClick={() => setTheme('light')}
                >
                  <Sun className="w-6 h-6" />
                  <span>Sáng</span>
                </button>
                <button
                  className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200 dark:border-gray-700'} bg-gray-900 text-white flex flex-col items-center space-y-2`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="w-6 h-6" />
                  <span>Tối</span>
                </button>
                <button
                  className={`p-4 rounded-lg border ${theme === 'system' ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200 dark:border-gray-700'} bg-gradient-to-r from-white to-gray-900 text-gray-900 dark:text-white flex flex-col items-center space-y-2`}
                  onClick={() => setTheme('system')}
                >
                  <Monitor className="w-6 h-6" />
                  <span>Hệ thống</span>
                </button>
              </div>
            </div>
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
              Màu sắc chủ đề
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center space-y-2"
            onClick={() => handleColorChange('blue')}
          >
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white"></div>
            <span>Xanh dương</span>
          </button>
          <button
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-purple-500 hover:bg-purple-600 text-white flex flex-col items-center space-y-2"
            onClick={() => handleColorChange('purple')}
          >
            <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white"></div>
            <span>Tím</span>
          </button>
          <button
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-green-500 hover:bg-green-600 text-white flex flex-col items-center space-y-2"
            onClick={() => handleColorChange('green')}
          >
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white"></div>
            <span>Xanh lá</span>
          </button>
          <button
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-red-500 hover:bg-red-600 text-white flex flex-col items-center space-y-2"
            onClick={() => handleColorChange('red')}
          >
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white"></div>
            <span>Đỏ</span>
          </button>
          <button
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-orange-500 hover:bg-orange-600 text-white flex flex-col items-center space-y-2"
            onClick={() => handleColorChange('orange')}
          >
            <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white"></div>
            <span>Cam</span>
          </button>
          <button
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-pink-500 hover:bg-pink-600 text-white flex flex-col items-center space-y-2"
            onClick={() => handleColorChange('pink')}
          >
            <div className="w-6 h-6 rounded-full bg-pink-500 border-2 border-white"></div>
            <span>Hồng</span>
          </button>
          <button
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-indigo-500 hover:bg-indigo-600 text-white flex flex-col items-center space-y-2"
            onClick={() => handleColorChange('indigo')}
          >
            <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white"></div>
            <span>Chàm</span>
          </button>
          <button
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-yellow-500 hover:bg-yellow-600 text-white flex flex-col items-center space-y-2"
            onClick={() => handleColorChange('yellow')}
          >
            <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white"></div>
            <span>Vàng</span>
          </button>
        </div>
      </div>
            </div>

            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
                Ngôn ngữ
              </h3>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                defaultValue="vi"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
                Cỡ chữ
              </h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm">A</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  defaultValue="3"
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-lg">A</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Data Settings */}
      {activeTab === 'data' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý dữ liệu
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                Xuất dữ liệu
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Tải xuống tất cả dữ liệu của bạn dưới dạng file JSON
              </p>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Xuất dữ liệu
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                Lịch sử hoạt động
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Xem lịch sử hoạt động của tài khoản
              </p>
              <Button variant="outline" size="sm">
                Xem lịch sử hoạt động
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
                Xóa dữ liệu
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Xóa tất cả dữ liệu cá nhân của bạn khỏi hệ thống
              </p>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa dữ liệu
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}