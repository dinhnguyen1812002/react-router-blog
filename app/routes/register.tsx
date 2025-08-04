import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MainLayout } from "~/components/layout/MainLayout";
import { PageBackground } from "~/components/layout/PageBackground";
import { useAuth } from "~/hooks/useAuth";
import { ThemedCard, ThemedCardContent } from "~/components/ui/ThemedCard";
import { ThemedInput } from "~/components/ui/ThemedInput";
import { ThemedButton } from "~/components/ui/ThemedButton";
import { User, Mail, Lock, UserPlus } from "lucide-react";

const registerSchema = z
  .object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register: registerUser,
    isAuthenticated,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

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

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    clearError();

    const result = await registerUser(registerData);

    if (result.success) {
      if (result.autoLogin) {
        console.log("✅ Registration successful with auto-login");
        // User is automatically logged in and redirected by useAuth hook
        // Could show a toast notification here if needed
      } else {
        console.log("✅ Registration successful, redirecting to login");
        // User will be redirected to login page by useAuth hook
      }
    } else {
      // Error is handled by the useAuth hook
      console.error("Registration failed:", result.error);
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
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tạo tài khoản mới
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Tham gia cộng đồng BlogPlatform ngay hôm nay
              </p>
            </div>

            <ThemedCard variant="elevated" className="backdrop-blur-sm">
              <ThemedCardContent>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {error}
                    </div>
                  )}

                  <ThemedInput
                    type="text"
                    label="Tên đăng nhập"
                    placeholder="Nhập tên đăng nhập"
                    leftIcon={<User className="w-4 h-4" />}
                    error={errors.username?.message}
                    {...registerField("username")}
                    onChange={(e) => {
                      registerField("username").onChange(e);
                      clearError();
                    }}
                  />

                  <ThemedInput
                    type="email"
                    label="Email"
                    placeholder="Nhập địa chỉ email"
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={errors.email?.message}
                    {...registerField("email")}
                    onChange={(e) => {
                      registerField("email").onChange(e);
                      clearError();
                    }}
                  />

                  <ThemedInput
                    type="password"
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={errors.password?.message}
                    helperText="Mật khẩu phải có ít nhất 6 ký tự"
                    {...registerField("password")}
                  />

                  <ThemedInput
                    type="password"
                    label="Xác nhận mật khẩu"
                    placeholder="Nhập lại mật khẩu"
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={errors.confirmPassword?.message}
                    {...registerField("confirmPassword")}
                  />

                  <ThemedButton
                    type="submit"
                    gradient
                    fullWidth
                    size="lg"
                    loading={isLoading}
                    icon={<UserPlus className="w-5 h-5" />}
                    className="mt-8"
                  >
                    {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                  </ThemedButton>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Đã có tài khoản?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </ThemedCardContent>
            </ThemedCard>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Hồ sơ cá nhân
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Viết bài
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Tương tác
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageBackground>
    </MainLayout>
  );
}
