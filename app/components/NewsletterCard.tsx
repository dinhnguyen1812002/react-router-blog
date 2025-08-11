import { useState } from "react";
import { Mail, CheckCircle, AlertCircle, Loader, ArrowRight } from "lucide-react";
import { useSubscribeNewsletter } from "~/api/newsletter";

interface NewsletterCardProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
  title?: string;
  description?: string;
}

export default function NewsletterCard({ 
  variant = 'default',
  className = '',
  title = "Đăng ký Newsletter",
  description = "Nhận những bài viết mới nhất về công nghệ và lập trình."
}: NewsletterCardProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState("");

  const subscribeMutation = useSubscribeNewsletter({
    onSuccess: () => {
      setEmail("");
      setName("");
      setValidationError("");
    },
    onError: (error: any) => {
      console.error("Newsletter subscription error:", error);
    }
  });

  const validateForm = () => {
    if (!email.trim()) {
      setValidationError("Vui lòng nhập địa chỉ email.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Vui lòng nhập địa chỉ email hợp lệ.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const payload = {
      email: email.trim(),
      ...(name.trim() && { name: name.trim() })
    };

    subscribeMutation.mutate(payload);
  };

  const resetErrors = () => {
    setValidationError("");
    subscribeMutation.reset();
  };

  const isLoading = subscribeMutation.isPending;
  const isSuccess = subscribeMutation.isSuccess;
  const isError = subscribeMutation.isError || !!validationError;

  const errorMessage = validationError || 
                      (subscribeMutation.error as any)?.response?.data?.message || 
                      (subscribeMutation.error as any)?.response?.data?.error ||
                      subscribeMutation.error?.message ||
                      "Có lỗi xảy ra. Vui lòng thử lại.";

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Đăng ký thành công!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                resetErrors();
              }}
              disabled={isLoading}
              placeholder="Email của bạn"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </form>
        )}

        {isError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
          </div>
          
          {isSuccess ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Thành công!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  resetErrors();
                }}
                disabled={isLoading}
                placeholder="Email"
                className="w-48 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Đăng ký"
                )}
              </button>
            </form>
          )}
        </div>
        
        {isError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      {isSuccess ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">Đăng ký thành công!</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vui lòng kiểm tra email để xác nhận đăng ký.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                resetErrors();
              }}
              disabled={isLoading}
              placeholder="Địa chỉ email của bạn"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                resetErrors();
              }}
              disabled={isLoading}
              placeholder="Họ và tên (tùy chọn)"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Đang đăng ký...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Đăng ký Newsletter
              </>
            )}
          </button>
        </form>
      )}

      {isError && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất cứ lúc nào.
      </p>
    </div>
  );
}