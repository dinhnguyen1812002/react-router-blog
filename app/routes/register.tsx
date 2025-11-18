import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "~/hooks/useAuth";

import {
  User,
  Mail,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronsRight,
} from "lucide-react";

const registerSchema = z
  .object({
    username: z.string().min(5, "Tên đăng nhập phải có ít nhất 5 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?!.*\s).{6,}$/,
        "Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@#$%^&+=), không khoảng trắng",
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản và chính sách",
    }),
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
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Real-time validation state
  const passwordValue = watch("password") || "";
  const confirmValue = watch("confirmPassword") || "";

  const hasLower = /[a-z]/.test(passwordValue);
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasDigit = /[0-9]/.test(passwordValue);
  const hasSpecial = /[@#$%^&+=]/.test(passwordValue);
  const noSpace = !/\s/.test(passwordValue);
  const minLen = passwordValue.length >= 6;

  // Password strength calculation
  const passwordStrength = {
    strength: Math.round(
      (((hasLower ? 1 : 0) +
        (hasUpper ? 1 : 0) +
        (hasDigit ? 1 : 0) +
        (hasSpecial ? 1 : 0) +
        (noSpace ? 1 : 0) +
        (minLen ? 1 : 0)) *
        100) /
        6,
    ),
    label:
      passwordValue.length === 0
        ? ""
        : passwordValue.length < 6
          ? "Weak"
          : (hasLower ? 1 : 0) +
                (hasUpper ? 1 : 0) +
                (hasDigit ? 1 : 0) +
                (hasSpecial ? 1 : 0) +
                (noSpace ? 1 : 0) >=
              4
            ? "Strong"
            : "Medium",
    color:
      passwordValue.length === 0
        ? "bg-gray-300"
        : passwordValue.length < 6
          ? "bg-red-500"
          : (hasLower ? 1 : 0) +
                (hasUpper ? 1 : 0) +
                (hasDigit ? 1 : 0) +
                (hasSpecial ? 1 : 0) +
                (noSpace ? 1 : 0) >=
              4
            ? "bg-green-500"
            : "bg-yellow-500",
  };

  // Ensure confirm password validation re-runs when either field changes
  useEffect(() => {
    trigger(["password", "confirmPassword"]);
  }, [passwordValue, confirmValue, trigger]);

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword, agreeToTerms, ...registerData } = data;
    clearError();

    const result = await registerUser(registerData);

    if (result.success) {
      if (result.autoLogin) {
        console.log(" Registration successful with auto-login");
        // User is automatically logged in and redirected by useAuth hook
        // Could show a toast notification here if needed
      } else {
        console.log("Registration successful, redirecting to login");
        // User will be redirected to login page by useAuth hook
      }
    } else {
      // Error is handled by the useAuth hook
      console.error("Registration failed:", result.error);
    }
  };

  const onSwitchToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 z-10"></div>
        <img
          src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Team collaboration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            {/* <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <UserPlus className="w-8 h-8" />
            </div>
          </div> */}
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Start your journey with us
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Join thousands of professionals who trust our platform to
              streamline their workflow and boost productivity.
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Create your account
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Quick and easy registration process
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Set up your workspace
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Customize your dashboard to fit your needs
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm
              flex items-center justify-center"
                >
                  <span className="text-xl font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Start collaborating
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Invite your team and begin working together
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-xl mb-4">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Create Account
            </h1>
            <p className="text-slate-600">Join us today and get started</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                {/* <div className="flex-shrink-0">
               <Link to="/">
                <ChevronsRight className="h-5 w-5 text-red-400" />
               </Link>

              </div> */}
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  {...registerField("username")}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                  } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="johndoe123"
                  aria-label="Username"
                  aria-invalid={errors.username ? "true" : "false"}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                />
              </div>
              {errors.username && (
                <p
                  id="username-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  {...registerField("email")}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                  } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="you@example.com"
                  aria-label="Email Address"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...registerField("password")}
                  className={`block w-full pl-10 pr-12 py-3 border ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                  } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="••••••••"
                  aria-label="Password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password
                      ? "password-error password-strength"
                      : "password-strength"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {passwordValue && (
                <div id="password-strength" className="mt-2" aria-live="polite">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600">Password strength:</span>
                    <span
                      className={`font-semibold ${
                        passwordStrength.strength === 100
                          ? "text-green-600"
                          : passwordStrength.strength === 66
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}

              {errors.password && (
                <p
                  id="password-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...registerField("confirmPassword")}
                  className={`block w-full pl-10 pr-12 py-3 border ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                  } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="••••••••"
                  aria-label="Confirm Password"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={
                    errors.confirmPassword ? "confirmPassword-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-start">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    {...registerField("agreeToTerms")}
                    className={`h-4 w-4 ${
                      errors.agreeToTerms
                        ? "border-red-300 text-red-600 focus:ring-red-500"
                        : "border-slate-300 text-slate-700 focus:ring-slate-500"
                    } rounded focus:ring-2 transition-colors cursor-pointer`}
                    aria-label="Agree to terms and conditions"
                    aria-invalid={errors.agreeToTerms ? "true" : "false"}
                    aria-describedby={
                      errors.agreeToTerms ? "agreeToTerms-error" : undefined
                    }
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      className="font-semibold text-slate-900 hover:underline"
                    >
                      Terms and Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="font-semibold text-slate-900 hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </label>
                  {errors.agreeToTerms && (
                    <p
                      id="agreeToTerms-error"
                      className="mt-1 text-sm text-red-600"
                      role="alert"
                    >
                      {errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold py-3 px-4 rounded-lg hover:from-slate-800 hover:to-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label={
                isSubmitting ? "Creating account..." : "Create account"
              }
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-50 lg:bg-white text-slate-500">
                  Already have an account?
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="mt-4 w-full bg-white text-slate-700 font-semibold py-3 px-4 rounded-lg border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
            >
              Sign in instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
