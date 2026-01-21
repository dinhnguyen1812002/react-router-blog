import { useEffect, useState } from "react";
import { ProfileHeader } from "~/components/public/ProfileHeader";
import { BlogPostCard } from "~/components/public/BlogPostCard";
import { TabNavigation } from "~/components/public/TabNavigation";
import { MainLayout } from "~/components/layout/MainLayout";

import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "~/api/user";
import { useThemeStore } from "~/store/themeStore";
import MarkdownPreview from "@uiw/react-markdown-preview";
const tabs = [
  { id: "posts", label: "Bài viết", count: 47 },
  { id: "about", label: "Giới thiệu" },
  { id: "series", label: "Series", count: 5 },
  { id: "bookmarks", label: "Đã lưu", count: 23 },
];



const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { slug = "" } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-user", slug],
    queryFn: () => userApi.getProfile(slug),
    enabled: !!slug,
  });

  const profile = data;
  const theme = useThemeStore((state) => state.theme);

  console.log("Theme from store:", theme);

  // State để force re-render MarkdownPreview khi theme thay đổi
  const [markdownKey, setMarkdownKey] = useState(0);


  // Force re-render MarkdownPreview khi theme thay đổi
  useEffect(() => {
    setMarkdownKey((prev) => prev + 1);
  }, [theme]);
  return (
    <MainLayout>


      <div className="min-h-screen bg-background">
        {profile && <ProfileHeader {...profile} />}

        <main className="container max-w-4xl mx-auto px-4 py-8">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === "posts" && (
            <section className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile?.featuredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="animate-slide-up"
                    // style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <BlogPostCard {...post} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "about" && (
            <section className="mt-8 animate-fade-in">
              {profile?.customInformation ? (
                <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
                  <MarkdownPreview
                    key={markdownKey}
                    source={profile.customInformation}
                    style={{ padding: 0 }}
                    wrapperElement={{
                      "data-color-mode": theme as "light" | "dark",
                    }}
                  />
                </div>
              ) : (
                <div className="bg-card rounded-xl p-6 md:p-8 shadow-soft">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                    Về tôi
                  </h2>
                  <div className="prose prose-lg text-muted-foreground space-y-4">
                    <p>
                      Xin chào! Tôi là Minh, một Software Engineer với hơn 8 năm kinh nghiệm
                      trong lĩnh vực phát triển web và mobile applications.
                    </p>
                    <p>
                      Hiện tại tôi đang làm việc tại một công ty công nghệ hàng đầu,
                      chịu trách nhiệm xây dựng và tối ưu hóa các hệ thống phục vụ
                      hàng triệu người dùng mỗi ngày.
                    </p>
                    <p>
                      Ngoài công việc chính, tôi dành thời gian viết blog chia sẻ
                      kiến thức và kinh nghiệm về công nghệ, hy vọng giúp ích cho
                      cộng đồng developer Việt Nam.
                    </p>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                    Kỹ năng
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS", "System Design"].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === "series" && (
            <section className="mt-8 animate-fade-in">
              <div className="text-center py-12 text-muted-foreground">
                <p>Danh sách series sẽ hiển thị ở đây</p>
              </div>
            </section>
          )}

          {activeTab === "bookmarks" && (
            <section className="mt-8 animate-fade-in">
              <div className="text-center py-12 text-muted-foreground">
                <p>Danh sách bài viết đã lưu sẽ hiển thị ở đây</p>
              </div>
            </section>
          )}
        </main>


      </div>

    </MainLayout>

  );
};

export default UserProfile;
