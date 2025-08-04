import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/Input';
import { useAuthStore } from '~/store/authStore';
import { authApi } from '~/api/auth';
import {
  User,
  Mail,
  Camera,
  Save,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    website: user?.website || '',
    location: user?.location || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => authApi.updateProfile(data),
    onSuccess: (response) => {
      setUser(response.user);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => authApi.changePassword(data),
    onSuccess: () => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Hồ sơ cá nhân
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý thông tin và cài đặt tài khoản của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2" />
                Thông tin cơ bản
              </h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tên đăng nhập
                    </label>
                    <Input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Nhập tên đăng nhập"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Nhập email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Viết vài dòng giới thiệu về bản thân..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <Input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Địa điểm
                    </label>
                    <Input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Thành phố, Quốc gia"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </span>
                  </Button>
                </div>

                {updateProfileMutation.error && (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    Lỗi: {(updateProfileMutation.error as any)?.message || 'Không thể cập nhật hồ sơ'}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Đổi mật khẩu
              </h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mật khẩu mới
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending || !passwordData.currentPassword || !passwordData.newPassword}
                    className="flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>
                      {changePasswordMutation.isPending ? 'Đang đổi...' : 'Đổi mật khẩu'}
                    </span>
                  </Button>
                </div>

                {changePasswordMutation.error && (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    Lỗi: {(changePasswordMutation.error as any)?.message || 'Không thể đổi mật khẩu'}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Avatar & Stats */}
        <div className="space-y-6">
          {/* Avatar */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Ảnh đại diện</h3>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-2xl">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full p-2"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Thay đổi ảnh
              </Button>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Thống kê tài khoản</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ngày tham gia</span>
                  <span className="text-sm font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Vai trò</span>
                  <span className="text-sm font-medium capitalize">
                    {user?.roles?.[0] || 'User'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Hoạt động
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}