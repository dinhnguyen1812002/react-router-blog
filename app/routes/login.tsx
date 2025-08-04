
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MainLayout } from '~/components/layout/MainLayout';
import { PageBackground } from '~/components/layout/PageBackground';
import { useAuth } from '~/hooks/useAuth';
import { ThemedCard, ThemedCardContent } from '~/components/ui/ThemedCard';
import { ThemedInput } from '~/components/ui/ThemedInput';
import { ThemedButton } from '~/components/ui/ThemedButton';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Check for success message from registration or password reset
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts or when user starts typing
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginForm) => {
    clearError();
    setSuccessMessage('');

    const result = await login(data);

    if (!result.success) {
      // Error is handled by the useAuth hook
      console.error('Login failed:', result.error);
    }
  };

  return (
    <MainLayout>
      <PageBackground variant="auth">
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="theme-gradient-bg w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chào mừng trở lại
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Đăng nhập để tiếp tục với BlogPlatform
              </p>
            </div>

            <ThemedCard variant="elevated" className="backdrop-blur-sm">
              <ThemedCardContent>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {successMessage && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {successMessage}
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <ThemedInput
                    type="email"
                    label="Email"
                    placeholder="Nhập địa chỉ email"
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={errors.email?.message}
                    {...register('email')}
                    onChange={() => clearError()}
                  />

                  <ThemedInput
                    type="password"
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={errors.password?.message}
                    {...register('password')}
                    onChange={() => clearError()}
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Ghi nhớ đăng nhập
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <ThemedButton 
                    type="submit" 
                    gradient
                    fullWidth
                    size="lg"
                    loading={isLoading}
                    icon={<LogIn className="w-5 h-5" />}
                    className="mt-8"
                  >
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </ThemedButton>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chưa có tài khoản?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                    >
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </ThemedCardContent>
            </ThemedCard>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Đăng nhập nhanh</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Bảo mật</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Hỗ trợ 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </PageBackground>
    </MainLayout>
  );
}