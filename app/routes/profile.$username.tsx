import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "~/api/user";
import { Card, CardContent } from "~/components/ui/Card";
import { MainLayout } from "~/components/layout/MainLayout";
import { UserAvatar } from "~/components/ui/boring-avatar";
import { resolveImageUrl } from "~/utils/image";
import { ProfileSEO } from "~/components/profile/ProfileSEO";
import { useThemeStore } from "~/store/themeStore";
import type { Route } from "../+types/root";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Eye,
  Heart,
} from "lucide-react";

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

  // Sử dụng zustand store để lấy theme và tự động re-render khi theme thay đổi
  const theme = useThemeStore((state) => state.theme);

  console.log("Theme from store:", theme);

  // State để force re-render MarkdownPreview khi theme thay đổi
  const [markdownKey, setMarkdownKey] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-user", username],
    queryFn: () => userApi.getProfile(username),
    enabled: !!username,
  });

  // Force re-render MarkdownPreview khi theme thay đổi
  useEffect(() => {
    setMarkdownKey((prev) => prev + 1);
  }, [theme]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !data) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Không tìm thấy người dùng.
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Người dùng này không tồn tại hoặc đã bị xóa.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline dark:hover:text-blue-300"
            >
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const profile = data;

  return (
    <MainLayout>
      <ProfileSEO profile={profile} />
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 overflow-hidden ">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Identity & Info (Sticky) */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Profile Header */}
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:shadow-gray-900 transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {profile.avatar ? (
                      <img
                        src={resolveImageUrl(profile.avatar)}
                        alt={profile.username}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                      />
                    ) : (
                      <UserAvatar
                        name={profile.username}
                        size={96}
                        className="border-4 border-white shadow-lg"
                      />
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {profile.username}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    @{profile.slug}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {profile.postCount}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Posts
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bio / Links */}
              <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2">
                      Bio
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {profile.bio || "Chưa có bio"}
                    </p>
                  </div>

                  {profile.website && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2">
                        Website
                      </h3>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline dark:hover:text-blue-300 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        {profile.website.replace(/(^\w+:|^)\/\//, "")}
                      </a>
                    </div>
                  )}

                  {/* Socials */}
                  {Object.values(profile.socialMediaLinks).some(
                    (link) => link,
                  ) && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2">
                        Social Media
                      </h3>
                      <div className="flex gap-3">
                        {profile.socialMediaLinks.GITHUB && (
                          <a
                            href={profile.socialMediaLinks.GITHUB}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            title="GitHub"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </a>
                        )}
                        {profile.socialMediaLinks.LINKEDIN && (
                          <a
                            href={profile.socialMediaLinks.LINKEDIN}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                            title="LinkedIn"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        )}
                        {profile.socialMediaLinks.TWITTER && (
                          <a
                            href={profile.socialMediaLinks.TWITTER}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Twitter"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                          </a>
                        )}
                        {profile.socialMediaLinks.FACEBOOK && (
                          <a
                            href={profile.socialMediaLinks.FACEBOOK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Facebook"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                        )}
                        {profile.socialMediaLinks.INSTAGRAM && (
                          <a
                            href={profile.socialMediaLinks.INSTAGRAM}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                            title="Instagram"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="text-center text-xs text-gray-400 dark:text-gray-600">
                © {new Date().getFullYear()} Profile Studio
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Content Canvas */}
          <main className="lg:col-span-2 space-y-8">
            {/* Custom Info Section */}
            {profile.customInformation && (
              <div className="bg-white dark:bg-gray-900">
                <MarkdownPreview
                  key={markdownKey} // Force re-render khi theme thay đổi
                  source={profile.customInformation}
                  style={{ padding: 16 }}
                  wrapperElement={{
                    "data-color-mode": theme as "light" | "dark",
                  }}
                />
              </div>
            )}

            {/* Featured Posts */}
            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-xl">
                    <BookOpen className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">
                    Insights & Writing
                  </h2>
                </div>
                <Link
                  to="/articles"
                  className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                >
                  All Articles <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {profile.featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/articles/${post.slug}`}
                    className="group h-full "
                  >
                    <div className="h-full flex flex-col noPadding bg-white/5 border-white/5 
                    group-hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                      <div className="relative h-48 overflow-hidden border border-white/5 rounded-lg">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* <div className="absolute top-4 left-4 flex gap-2">
                          {post.tags?.slice(0, 1).map(tag => (
                            <GlassBadge key={tag} className="bg-black/60 text-white border-white/20">#{tag}</GlassBadge>
                          ))}
                        </div> */}
                      </div>
                      <div className="p-1 flex flex-col flex-1">
                        <h3 className="text-xl font-black group-hover:text-blue-500 transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto pt-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />
                              {post.likes}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                              <Eye className="w-3.5 h-3.5 text-blue-500" />
                              {post.views}
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase text-gray-600">
                            {new Date(post.createdAt).toLocaleDateString(
                              "vi-VN",
                              { month: "short", day: "numeric" },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
