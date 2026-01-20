import { FileText, Bookmark, MessageCircle } from 'lucide-react';
import type { ProfileUser, UserProfileResponse } from '~/types';

interface ProfileStatsProps {
  user: UserProfileResponse;
  className?: string;
}

export function ProfileStats({ user, className = "" }: ProfileStatsProps) {
  const stats = [
    {
      icon: FileText,
      value: user.postsCount,
      label: 'Posts',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Bookmark,
      value: user.savedPostsCount,
      label: 'Saved',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: MessageCircle,
      value: user.commentsCount,
      label: 'Comments',
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className={`flex gap-6 ${className}`}>
      {stats.map(({ icon: Icon, value, label, color }) => (
        <div key={label} className="text-center">
          <div className={`flex items-center gap-1 text-gray-900 dark:text-gray-100 font-semibold ${color}`}>
            <Icon className="w-4 h-4" />
            {value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
        </div>
      ))}
    </div>
  );
}
