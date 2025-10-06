import { useQuery } from '@tanstack/react-query';
import { User, Globe, MapPin, Calendar, Settings, Edit3, Share2, Users, MessageCircle, Bookmark, FileText, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';
import { authApi } from '~/api/auth';
import { ProfileSkeleton } from '~/components/skeleton/ProfileSkeleton';
 import Avatar from "boring-avatars";
import type { ProfileUser } from '~/types';
import { Link } from 'react-router';
// Types
interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  roles: string[];
  socialMediaLinks: {
    LINKEDIN?: string;
    TWITTER?: string;
    INSTAGRAM?: string;
    FACEBOOK?: string;
    GITHUB?: string;
  };
  postsCount: number;
  savedPostsCount: number;
  commentsCount: number;
  customProfileMarkdown: string | null;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API service (replace with your actual API)
const apiService = {
  profile: async (): Promise<ApiResponse<ProfileUser>> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await authApi.profile();
    return response;
  }
};

// Social media icon mapping
const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case 'twitter':
      return (
       <Twitter className="w-5 h-5" />
      );
    case 'instagram':
      return (
       <Instagram className="w-5 h-5" />
      );
    default:
      return <Globe className="w-5 h-5" />;
  }
};

// Loading skeleton component


// Error component
const ErrorMessage = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <div className="text-red-600 text-lg font-semibold mb-2">Oops! Something went wrong</div>
    <p className="text-red-600 mb-4">{error.message}</p>
    <button
      onClick={onRetry}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Markdown renderer (simple implementation)
const MarkdownRenderer = ({ content }: { content: string }) => {
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState('about');

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile'],
    queryFn: apiService.profile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <ProfileSkeleton />;
  
  if (error) return <ErrorMessage error={error as Error} onRetry={refetch} />;
  
  if (!response?.data) return <div>No profile data found</div>;

  const user = response.data;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover Photo */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-start gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">

                 <div className="w-32 h-32 rounded-full  border-3 border-transition-colors shadow-lg flex items-center justify-center">
                    <Avatar name={user.username} 
                    variant="geometric" 
                    size={128} 
                    colors={['#FF5733', '#FFC300', '#DAF7A6']} 
               />
                </div>
                {/* im gonna do this shit later */}
              {/* {user.avatar ? (
                <img
                  src={user.avatar }
                  alt={user.username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <Avatar name={user.username} 
                    variant="beam" 
                    size={128} 
                    colors={['#FF5733', '#FFC300', '#DAF7A6']} 
               />
                </div>
              )} */}

              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* User Details */}
            <div className="flex-1 mt-16">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
                {user.roles.includes('ROLE_ADMIN') && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{user.email}</p>

              {/* Stats */}
              <div className="flex gap-6 mb-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-gray-900 font-semibold">
                    <FileText className="w-4 h-4" />
                    {user.postsCount}
                  </div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-gray-900 font-semibold">
                    <Bookmark className="w-4 h-4" />
                    {user.savedPostsCount}
                  </div>
                  <div className="text-sm text-gray-600">Saved</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-gray-900 font-semibold">
                    <MessageCircle className="w-4 h-4" />
                    {user.commentsCount}
                  </div>
                  <div className="text-sm text-gray-600">Comments</div>
                </div>
              </div>

              {/* Social Links */}
              {Object.keys(user.socialMediaLinks).length > 0 && (
                <div className="flex gap-3">
                  {Object.entries(user.socialMediaLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                    >
                      {getSocialIcon(platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-16 flex gap-2">
              {/* <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Edit Profile
              </button> */}
                 <Link 
                  to="/dashboard/profile/edit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </Link>
              <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                View Public Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
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
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
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
              <h2 className="text-xl font-semibold mb-4">About</h2>
              {user.customProfileMarkdown ? (
                <MarkdownRenderer content={user.customProfileMarkdown} />
              ) : (
                <div className="text-gray-600 bg-gray-50 p-6 rounded-lg text-center">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No bio added yet. Tell others about yourself!</p>
                  <button className="mt-3 text-blue-600 hover:text-blue-700">
                    Add Bio
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Posts ({user.postsCount})</h2>
              {user.postsCount > 0 ? (
                <div className="text-gray-600">Posts will be displayed here...</div>
              ) : (
                <div className="text-gray-600 bg-gray-50 p-6 rounded-lg text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No posts yet. Share your first post!</p>
                  <button className="mt-3 text-blue-600 hover:text-blue-700">
                    Create Post
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Commented on 4 posts</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Bookmark className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Saved {user.savedPostsCount} posts</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}