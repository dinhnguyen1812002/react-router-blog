import { useState } from "react";
import { CalendarDays, FlagOff, CheckCircle, AlertCircle, Loader, Mail, Shield } from "lucide-react";
import { useSubscribeNewsletter } from "~/api/newsletter";

interface SubscribeData {
  name: string;
  email: string;
}

export default function NewLetters() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState("");

  // TanStack Query mutation
  const subscribeMutation = useSubscribeNewsletter({
    onSuccess: () => {
      // Reset form on success
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
      setValidationError("Please enter your email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async (e:any) => {
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

  // Determine current status
  const isLoading = subscribeMutation.isPending;
  const isSuccess = subscribeMutation.isSuccess;
  const isError = subscribeMutation.isError || !!validationError;

  // Get error message
  const errorMessage = validationError || 
                      (subscribeMutation.error as any)?.response?.data?.message || 
                      (subscribeMutation.error as any)?.response?.data?.error ||
                      subscribeMutation.error?.message ||
                      "An error occurred while subscribing. Please try again.";

  // Get success message
  const successMessage = subscribeMutation.data?.message || 
                         "Subscription successful! Please check your email to confirm.";

  return (
    <section className="relative isolate overflow-hidden  py-16 sm:py-24 lg:py-32 rounded-lg mt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="w-full h-full"></div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:items-center">
          {/* Content Section */}
          <div className="max-w-xl lg:max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Newsletter
              </h2>
            </div>
            
            <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 mb-8">
              Đăng ký để nhận những bài viết mới nhất, tin tức công nghệ và insights hữu ích được gửi thẳng đến hộp thư của bạn.
            </p>

            {/* Success Message */}
            {isSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Đăng ký thành công!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Vui lòng kiểm tra email (kể cả thư mục spam) để xác nhận đăng ký.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {isError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Có lỗi xảy ra
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address *
                </label>
                <input
                  id="email-address"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    resetErrors();
                  }}
                  disabled={isLoading}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Họ và tên (tùy chọn)
                </label>
                <input
                  id="full-name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    resetErrors();
                  }}
                  disabled={isLoading}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Đã đăng ký
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Đăng ký Newsletter
                  </>
                )}
              </button>
            </form>

            {/* Privacy note */}
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
            </p>
          </div>
          
          {/* Features Section */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="flex flex-col items-start p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
                <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nội dung chất lượng
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Nhận những bài viết được tuyển chọn kỹ lưỡng về công nghệ, lập trình và xu hướng mới nhất.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Không spam
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Chúng tôi chỉ gửi nội dung có giá trị. Hủy đăng ký dễ dàng chỉ với một cú click.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-4">
                <FlagOff className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Miễn phí hoàn toàn
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Tất cả nội dung đều miễn phí. Không có phí ẩn hay cam kết dài hạn.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl mb-4">
                <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cập nhật thường xuyên
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Nhận thông báo ngay khi có bài viết mới hoặc cập nhật quan trọng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}