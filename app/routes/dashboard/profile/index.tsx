import { useQuery } from '@tanstack/react-query';
import { User, FileText, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { authApi } from '~/api/auth';
import { ProfileSkeleton } from '~/components/skeleton/ProfileSkeleton';
import { ProfileHeader } from '~/components/profile/ProfileHeader';
import { ProfileStats } from '~/components/profile/ProfileStats';
import { SocialLinks } from '~/components/profile/SocialLinks';
import { MarkdownRenderer } from '~/components/profile/MarkdownRenderer';
import type { ProfileUser } from '~/types';
import { profileApi } from '~/api/profile';




// Error component
const ErrorMessage = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
    <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Oops! Something went wrong</div>
    <p className="text-red-600 dark:text-red-400 mb-4">{error.message}</p>
    <button
      onClick={onRetry}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

export default function ProfileDisplayPage() {
  const [activeTab, setActiveTab] = useState('about');

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getCurrentProfile,

  });

  if (isLoading) return <ProfileSkeleton />;
  
  if (error) return <ErrorMessage error={error as Error} onRetry={refetch} />;
  
  if (!response) return <div>No profile data found</div>;

  const user = response;

  console.log('Profile data:', response);
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <ProfileHeader user={user} isOwnProfile={true} />

      {/* Stats and Social Links */}
      <div className="bg-white dark:bg-black p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ProfileStats user={user} />
          {/* <SocialLinks socialMediaLinks={user.socialMediaLinks} /> */}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-black">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {[
              { id: 'about', label: 'About', icon: User },
              { id: 'posts', label: 'Posts', icon: FileText },
              { id: 'activity', label: 'Activity', icon: MessageCircle },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === id
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'about' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">About</h2>
              {user.customProfileMarkdown ? (
                <MarkdownRenderer
                  content={user.customProfileMarkdown}
                  userData={user}
                />
              ) : (
                <div className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                  <p>No bio added yet. Tell others about yourself!</p>
                  <button className="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Add Bio
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Posts ({user.postsCount})</h2>
              {user.postsCount > 0 ? (
                <div className="text-gray-600 dark:text-gray-400">Posts will be displayed here...</div>
              ) : (
                <div className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                  <p>No posts yet. Share your first post!</p>
                  <button className="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Create Post
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">Commented on 4 posts</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">Saved {user.savedPostsCount} posts</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
