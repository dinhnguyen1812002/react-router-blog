import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "~/api/user";
import { ProfileHeader } from "~/components/profile/ProfileHeader";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { MainLayout } from "~/components/layout/MainLayout";

import type { ProfileUser } from "~/types";
import type { profile } from "console";

import { PostCard } from "~/components/post";
import { Button } from "~/components/ui";
import { Spinner } from "~/components/ui/Spinner";
import { formatDateSimple } from "~/lib/utils";
import { UserAvatar } from "~/components/ui/boring-avatar";
export default function PublicProfilePage() {
  const { username = "" } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-user", username],
    queryFn: () => userApi.getPublicUserByUsername(username), // call API
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !data) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600 dark:text-gray-300">
            Không tìm thấy người dùng.
          </div>
        </div>
      </MainLayout>
    );
  }

  const profile = data as ProfileUser;

  return (
    <MainLayout>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <div className="relative">
          {/* Cover Image */}
          {/* {profile.coverImageUrl ? (
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
              <img
                src={profile.coverImageUrl}
                alt="Cover"
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg" />
          )} */}

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4 sm:mb-0">
                <UserAvatar
                  src={profile.avatar}
                  name={profile.username}
                  alt={profile.username}
                  size={128}
                  className="border-4 border-white shadow-lg"
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile.username}
                    </h1>
                    {profile.username && (
                      <p className="text-gray-600">@{profile.username}</p>
                    )}
                    {/* {profile.location && (
                      <p className="text-gray-500 text-sm mt-1"> {profile.location}</p>
                    )} */}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    {false ? (
                      <Link to="/settings/profile">
                        <Button variant="secondary"> Chỉnh sửa hồ sơ</Button>
                      </Link>
                    ) : (
                      <>
                        <Button variant="secondary"> Theo dõi</Button>
                        <Button variant="secondary"> Nhắn tin</Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-gray-700 mt-4 max-w-2xl">{profile.bio}</p>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-4 mt-4">
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                    >
                      <span>🌐</span>
                      <span>Website</span>
                    </a>
                  )}
                  {profile.socialMediaLinks.GITHUB && (
                    <a
                      href={profile.socialMediaLinks.GITHUB}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                    >
                      <span>🐙</span>
                      <span>GitHub</span>
                    </a>
                  )}
                </div>

                {/* Join Date */}
              
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {profile.postsCount || 0}
            </div>
            <div className="text-gray-600">Bài viết</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {profile.commentsCount || 0}
            </div>
            <div className="text-gray-600">Bình luận</div>
          </CardContent>
        </Card>
        
        {/* <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {profile.stats?.totalBookmarks || 0}
            </div>
            <div className="text-gray-600">Đã lưu</div>
          </CardContent>
        </Card> */}
      </div>

      {/* User Posts */}
      {/* <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">
            Bài viết của { profile.username}
          </h2>
        </CardHeader>
        <CardContent>
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : userPosts?.content?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có bài viết nào
              </h3>
              <p className="text-gray-600">
                {isOwnProfile 
                  ? 'Bạn chưa viết bài viết nào. Hãy bắt đầu chia sẻ câu chuyện của mình!'
                  : 'Người dùng này chưa có bài viết nào.'
                }
              </p>
              {isOwnProfile && (
                <Link to="/author/posts/new" className="mt-4 inline-block">
                  <Button>Viết bài đầu tiên</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts?.content?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  </MainLayout>
  );
}
