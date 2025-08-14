import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MainLayout } from "~/components/layout/MainLayout";
import { PageBackground } from "~/components/layout/PageBackground";
import { useAuth } from "~/hooks/useAuth";
import { ThemedCard, ThemedCardContent } from "~/components/ui/ThemedCard";
import { ThemedInput } from "~/components/ui/ThemedInput";
import { ThemedButton } from "~/components/ui/ThemedButton";
import {
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

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
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts or when user starts typing
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginForm) => {
    clearError();
    setSuccessMessage("");

    const result = await login(data);

    if (!result.success) {
      // Error is handled by the useAuth hook
      console.error("Login failed:", result.error);
    }
  };

  return (
    <MainLayout>
      <PageBackground variant="auth">
        <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg w-full space-y-8">
            {/* Animated Header */}
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Chào mừng trở lại!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Đăng nhập để khám phá thế giới nội dung tuyệt vời
                </p>
              </div>
            </div>

            {/* Modern Form Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
              <ThemedCard
                variant="elevated"
                className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/30 shadow-2xl"
              >
                <ThemedCardContent className="p-8">
                  <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {successMessage && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-5 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-medium">{successMessage}</span>
                      </div>
                    )}

                    {error && (
                      <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-5 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="font-medium">{error}</span>
                      </div>
                    )}

                    <div className="space-y-5">
                      <div className="group">
                        <ThemedInput
                          type="email"
                          label="Địa chỉ Email"
                          placeholder="your@email.com"
                        
                          error={errors.email?.message}
                          variant="filled"
                          inputSize="lg"
                          className="transition-all duration-300 group-hover:shadow-md focus-within:shadow-lg focus-within:shadow-blue-500/20"
                          {...register("email")}
                          onChange={() => clearError()}
                        />
                      </div>

                      <div className="group">
                        <ThemedInput
                          type="password"
                          label="Mật khẩu"
                          placeholder="••••••••"
                          
                          error={errors.password?.message}
                          variant="filled"
                          inputSize="lg"
                          className="transition-all duration-300 group-hover:shadow-md focus-within:shadow-lg focus-within:shadow-purple-500/20"
                          {...register("password")}
                          onChange={() => clearError()}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center group cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                          Ghi nhớ đăng nhập
                        </span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>

                    <div className="pt-4 justify-items-center">
                     
                        <Button  variant={"outline"} 
                        type="submit"
                        size={"lg"}
                         className="items-center text-black w-full">
                          Đăng Nhập
                        </Button>
                    </div>
                  </form>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                        Hoặc
                      </span>
                    </div>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Chưa có tài khoản?
                    </p>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group"
                    >
                      <span>Tạo tài khoản mới</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </ThemedCardContent>
              </ThemedCard>
            </div>

            {/* Enhanced Features */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="group space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Siêu nhanh
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Đăng nhập trong 1 giây
                  </p>
                </div>
              </div>

              <div className="group space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Bảo mật
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Mã hóa cấp ngân hàng
                  </p>
                </div>
              </div>

              <div className="group space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Trải nghiệm
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Giao diện hiện đại
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageBackground>
    </MainLayout>
  );
}
