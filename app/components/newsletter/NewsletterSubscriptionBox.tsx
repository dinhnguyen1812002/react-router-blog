import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Mail, Send, Check, X, Gift, Star, Users, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { newsletterApi } from '~/api/newsletter';

interface NewsletterSubscriptionBoxProps {
  variant?: 'default' | 'compact' | 'featured' | 'sidebar';
  className?: string;
  showBenefits?: boolean;
  showStats?: boolean;
  title?: string;
  description?: string;
}

export default function NewsletterSubscriptionBox({
  variant = 'default',
  className = '',
  showBenefits = true,
  showStats = true,
  title,
  description,
}: NewsletterSubscriptionBoxProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: (email: string) => newsletterApi.subscribe({ email }),
    onSuccess: () => {
      setIsSubscribed(true);
      setEmail('');
      toast.success('Đăng ký newsletter thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Email không hợp lệ');
      return;
    }
    subscribeMutation.mutate(email);
  };

  const benefits = [
    {
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      text: 'Bài viết chất lượng cao hàng tuần'
    },
    {
      icon: <Gift className="h-4 w-4 text-purple-500" />,
      text: 'Tài liệu và template miễn phí'
    },
    {
      icon: <Sparkles className="h-4 w-4 text-blue-500" />,
      text: 'Tips & tricks độc quyền'
    },
    {
      icon: <Users className="h-4 w-4 text-green-500" />,
      text: 'Cộng đồng developer năng động'
    }
  ];

  const mockStats = {
    subscribers: 12500,
    openRate: 85,
    satisfaction: 4.8
  };

  // Success state
  if (isSubscribed) {
    return (
      <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center ${className}`}>
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
          Đăng ký thành công!
        </h3>
        <p className="text-green-700 dark:text-green-300 text-sm">
          Cảm ơn bạn đã đăng ký newsletter. Hãy kiểm tra email để xác nhận đăng ký.
        </p>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-3 mb-3">
          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            {title || 'Newsletter'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            disabled={subscribeMutation.isPending}
          />
          <button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {subscribeMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`}>
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {title || 'Đăng ký Newsletter'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description || 'Nhận bài viết mới nhất qua email'}
          </p>
        </div>

        {showStats && (
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {(mockStats.subscribers / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Subscribers</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {mockStats.openRate}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Open Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {mockStats.satisfaction}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            disabled={subscribeMutation.isPending}
          />
          <button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {subscribeMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Đăng ký</span>
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          Không spam. Hủy đăng ký bất cứ lúc nào.
        </p>
      </div>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <div className={`bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-xl p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {title || 'Tham gia cộng đồng'}
          </h2>
          <p className="text-blue-100">
            {description || 'Nhận những bài viết chất lượng cao và tips hữu ích mỗi tuần'}
          </p>
        </div>

        {showStats && (
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{(mockStats.subscribers / 1000).toFixed(1)}K+</div>
              <div className="text-sm text-blue-100">Subscribers</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{mockStats.openRate}%</div>
              <div className="text-sm text-blue-100">Open Rate</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{mockStats.satisfaction}★</div>
              <div className="text-sm text-blue-100">Rating</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex space-x-3 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
            disabled={subscribeMutation.isPending}
          />
          <button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {subscribeMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Đăng ký'
            )}
          </button>
        </form>

        <p className="text-xs text-blue-100 text-center">
          Miễn phí. Không spam. Hủy đăng ký bất cứ lúc nào.
        </p>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title || 'Đăng ký Newsletter'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {description || 'Nhận những bài viết chất lượng cao và tips hữu ích mỗi tuần'}
        </p>
      </div>

      {showBenefits && (
        <div className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              {benefit.icon}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {benefit.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {showStats && (
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {(mockStats.subscribers / 1000).toFixed(1)}K+
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Subscribers</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {mockStats.openRate}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Open Rate</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {mockStats.satisfaction}★
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email của bạn"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          disabled={subscribeMutation.isPending}
        />
        <button
          type="submit"
          disabled={subscribeMutation.isPending}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {subscribeMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Đăng ký ngay</span>
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Bằng việc đăng ký, bạn đồng ý với{' '}
        <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
          chính sách bảo mật
        </a>{' '}
        của chúng tôi.
      </p>
    </div>
  );
}
