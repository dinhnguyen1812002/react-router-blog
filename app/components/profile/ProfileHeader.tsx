import { Edit3, Settings, Share2 } from 'lucide-react';
import Avatar from "boring-avatars";
import { Link } from "react-router";
import type { ProfileUser, UserProfileResponse } from '~/types';
import { resolveAvatarUrl, resolveImageUrl } from '~/utils/image';
import UserAvatar from '../ui/boring-avatar';

interface ProfileHeaderProps {
  user: UserProfileResponse;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
  showEditButton?: boolean;
}

export function ProfileHeader({ 
  user, 
  isOwnProfile = false, 
  onEditClick, 
  showEditButton = true 
}: ProfileHeaderProps) {
  return (
    <div className="bg-white dark:bg-black overflow-hidden">
      {/* Cover Photo */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          {isOwnProfile && (
            <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-start gap-6 -mt-16">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
            <UserAvatar 
            src={resolveAvatarUrl(user.avatar)}
            alt={user.username}
            size={128}
            
            
            /> 
            </div>
            {isOwnProfile && showEditButton && (
              <button 
                onClick={onEditClick}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 mt-16">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{user.username}</h1>
              {user.roles?.includes('ROLE_ADMIN') && (
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
                  Admin
                </span>
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
            
            {user.bio && (
              <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-16 flex gap-2">
            {isOwnProfile ? (
              <>
                <Link 
                  to="/dashboard/profile/edit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </Link>
                <Link 
                  to={`/profile/${user.slug}`}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                > 
                  View Public Profile
                </Link>
              </>
            ) : (
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Follow
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
