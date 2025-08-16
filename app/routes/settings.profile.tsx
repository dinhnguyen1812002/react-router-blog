import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '~/components/layout/MainLayout';

import { Input } from '~/components/ui/Input';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Avatar } from '~/components/ui/Avatar';
import { userApi } from '~/api/user';
import {Button} from "~/components/ui/button";
import { useAuthStore } from '~/store/authStore';

const profileSchema = z.object({
  displayName: z.string().max(100, 'Tên hiển thị không được quá 100 ký tự').optional(),
  bio: z.string().max(500, 'Tiểu sử không được quá 500 ký tự').optional(),
  location: z.string().max(100, 'Địa điểm không được quá 100 ký tự').optional(),
  websiteUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  githubUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfileSettingsPage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const { data: profileData } = useQuery({
    queryKey: ['user', 'profile', user?.id],
    queryFn: () => userApi.getProfile(user!.id),
    enabled: !!user?.id,
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profileData?.data?.displayName || '',
      bio: profileData?.data?.bio || '',
      location: profileData?.data?.location || '',
      websiteUrl: profileData?.data?.websiteUrl || '',
      githubUrl: profileData?.data?.githubUrl || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (response) => {
      if (response.success) {
        setUser({ ...user!, ...response.data });
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      }
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      resetPassword();
      alert('Đổi mật khẩu thành công!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    },
  });

  const onSubmitProfile = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const onSubmitPassword = (data: PasswordForm) => {
    const { confirmPassword, ...passwordData } = data;
    changePasswordMutation.mutate(passwordData);
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h1>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt tài khoản</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Đổi mật khẩu
            </button>
          </nav>
        </div>

        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <Avatar
                    src={profileData?.data?.avatarUrl || ''}
                    fallback={user.username.charAt(0)}
                    alt={user.username}
                    // size="xl"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Ảnh đại diện</h3>
                    <p className="text-sm text-gray-600">Tải lên ảnh đại diện mới</p>
                    <Button variant="secondary" size="sm" className="mt-2">
                      Thay đổi ảnh
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    // label="Tên người dùng"
                    value={user.username}
                    disabled
                    className="bg-gray-50"
                  />

                  <Input
                    // label="Email"
                    value={user.email}
                    disabled
                    className="bg-gray-50"
                  />

                  <Input
                    // label="Tên hiển thị"
                    {...registerProfile('displayName')}
                    // error={profileErrors.displayName?.message}
                    placeholder="Nhập tên hiển thị"
                  />

                  <Input
                    // label="Địa điểm"
                    {...registerProfile('location')}
                    // error={profileErrors.location?.message}
                    placeholder="Thành phố, Quốc gia"
                  />

                  <Input
                    // label="Website"
                    {...registerProfile('websiteUrl')}
                    // error={profileErrors.websiteUrl?.message}
                    placeholder="https://yourwebsite.com"
                  />

                  <Input
                    // label="GitHub"
                    {...registerProfile('githubUrl')}
                    // error={profileErrors.githubUrl?.message}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiểu sử
                  </label>
                  <textarea
                    {...registerProfile('bio')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Viết vài dòng về bản thân..."
                  />
                  {profileErrors.bio && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.bio.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'password' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                <Input
                  // label="Mật khẩu hiện tại"
                  type="password"
                  {...registerPassword('currentPassword')}
                  // error={passwordErrors.currentPassword?.message}
                  placeholder="Nhập mật khẩu hiện tại"
                />

                <Input
                  // label="Mật khẩu mới"
                  type="password"
                  {...registerPassword('newPassword')}
                  // error={passwordErrors.newPassword?.message}
                  placeholder="Nhập mật khẩu mới"
                />

                <Input
                  // label="Xác nhận mật khẩu mới"
                  type="password"
                  {...registerPassword('confirmPassword')}
                  // error={passwordErrors.confirmPassword?.message}
                  placeholder="Nhập lại mật khẩu mới"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}