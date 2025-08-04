import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MainLayout } from '~/components/layout/MainLayout';
import { useAuth } from '~/hooks/useAuth';

import { Input } from '~/components/ui/Input';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    setToken(tokenFromUrl);
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      return;
    }

    clearError();
    
    const result = await resetPassword(token, data.newPassword);
    
    if (!result.success) {
      console.error('Reset password failed:', result.error);
    }
  };

  if (!token) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Token không hợp lệ
                </h2>
                <p className="text-gray-600 mb-4">
                  Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
                </p>
                <Link to="/forgot-password">
                  <Button>Yêu cầu liên kết mới</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Nhập mật khẩu mới của bạn
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...register('newPassword')}
                    placeholder="Nhập mật khẩu mới"
                    onChange={() => clearError()}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="Nhập lại mật khẩu mới"
                    onChange={() => clearError()}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                </Button>

                <div className="text-center">
                  <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
                    Quay lại đăng nhập
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
