import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MainLayout } from '~/components/layout/MainLayout';
import { useAuth } from '~/hooks/useAuth';

import { Input } from '~/components/ui/Input';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    clearError();
    setSuccessMessage('');
    
    const result = await forgotPassword(data.email);
    
    if (result.success) {
      setSuccessMessage(result.message || 'Email đặt lại mật khẩu đã được gửi');
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Quên mật khẩu</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                    {successMessage}
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Nhập email của bạn"
                    onChange={() => clearError()}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
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
