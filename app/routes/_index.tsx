import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '~/components/layout/MainLayout';
import { PostList } from '~/components/post/PostList';

import { postsApi } from '~/api/posts';
import { Link } from 'react-router';
import { useAuthStore } from '~/store/authStore';
import { Button } from '~/components/ui/button';
import HeroSection from '~/components/layout/Hero';
import NewLetters from '~/components/NewLetters';

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();

  const {
    data: featuredPosts,
    isLoading: featuredLoading,
  } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => postsApi.getFeaturedPosts(),
  });

  const {
    data: latestPosts,
    isLoading: latestLoading,
  } = useQuery({
    queryKey: ['posts', 'latest'],
    queryFn: () => postsApi.getPosts(0, 6),
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {isAuthenticated && user ? (
            <>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Chào mừng trở lại, {user.username}! 👋
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100 dark:text-blue-200">
                Sẵn sàng chia sẻ những ý tưởng mới và khám phá nội dung thú vị?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/author/posts/new">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-gray-200">
                    Viết bài mới
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white hover:text-blue-600 dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-blue-700">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Chào mừng đến với BlogPlatform
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100 dark:text-blue-200">
                Nơi chia sẻ kiến thức, trải nghiệm và những khoảnh khắc thú vị qua blog và memes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/posts">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-gray-200">
                    Khám phá bài viết
                  </Button>
                </Link>
                <Link to="/memes">
                  <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white hover:text-blue-600 dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-blue-700">
                    Xem memes
                  </Button>
                </Link>
              </div>
            </>
          )}


        </div>
      </section> */}
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Bài viết nổi bật</h2>
            <Link to="/posts">
              <Button variant="secondary">Xem tất cả</Button>
            </Link>
          </div>
          
          <PostList
            posts={featuredPosts?.data || []}
            loading={featuredLoading}
          />
        </section>

        {/* Latest Posts */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Bài viết mới nhất</h2>
            <Link to="/posts">
              <Button variant="secondary">Xem tất cả</Button>
            </Link>
          </div>
          
          <PostList
            posts={latestPosts?.content || []}
            loading={latestLoading}
          />
        </section>

        {/* Call to Action */}
        {!isAuthenticated && (
          <section className="bg-gray-50 rounded-lg p-8 mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Bạn có câu chuyện để chia sẻ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Tham gia cộng đồng của chúng tôi và chia sẻ những kiến thức, trải nghiệm của bạn với mọi người.
            </p>
            <Link to="/register">
              <Button size="lg">Tham gia ngay</Button>
            </Link>
          </section>
        )}

        {/* new letter */}
        <div className="space-x-3 mb-6">
        <NewLetters />
        </div>
       
      </div>
    </MainLayout>
  );
}