import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "~/api/user";
import { Card, CardContent } from "~/components/ui/Card";
import { MainLayout } from "~/components/layout/MainLayout";
import { UserAvatar } from "~/components/ui/boring-avatar";
import { resolveImageUrl } from "~/utils/image";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User profile" },
    {
      name: "description",
      content:
        "Tổng hợp các bài viết hay nhất về công nghệ, lập trình, chia sẻ kinh nghiệm và xu hướng mới từ cộng đồng. Tìm kiếm, lọc và khám phá nội dung phù hợp với bạn.",
    },
    {
      name: "keywords",
      content:
        "blog, bài viết, lập trình, công nghệ, chia sẻ, kinh nghiệm, xu hướng",
    },
    { property: "og:title", content: "Blog cộng đồng - Bài viết mới nhất" },
    {
      property: "og:description",
      content:
        "Khám phá các bài viết nổi bật và xu hướng. Tìm kiếm theo chủ đề bạn yêu thích.",
    },
    { property: "og:type", content: "website" },
  ];
}

export default function PublicProfilePage() {
  const { username = "" } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-user", username],
    queryFn: () => userApi.getProfile(username), // call API
    enabled: !!username,
  });
  const profile = data;
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

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <div className="relative">
            {/* Profile Info */}
            <div className="relative px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                {/* Avatar */}
                <div className="relative -mt-16 mb-4 sm:mb-0">
                  <UserAvatar
                    src={resolveImageUrl(profile?.avatar)}
                    name={profile?.username}
                    alt={profile?.username}
                    size={128}
                    className="border-4 border-white shadow-lg"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {profile?.username}
                      </h1>
                      {profile?.username && (
                        <p className="text-gray-600">@{profile?.username}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {profile?.bio && (
                    <p className="text-gray-700 mt-4 max-w-2xl">
                      {profile?.bio}
                    </p>
                  )}

                  {/* Links */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    {profile?.website && (
                      <a
                        href={profile?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                      >
                        <span>🌐</span>
                        <span>Website</span>
                      </a>
                    )}
                    {profile?.socialMediaLinks?.GITHUB && (
                      <a
                        href={profile?.socialMediaLinks.GITHUB}
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
                {profile?.postsCount || 0}
              </div>
              <div className="text-gray-600">Bài viết</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {profile?.commentsCount || 0}
              </div>
              <div className="text-gray-600">Bình luận</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
