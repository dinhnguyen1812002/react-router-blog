import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '~/components/layout/MainLayout';
import { PostList } from '~/components/post/PostList';
import { postsApi } from '~/api/posts';
import { categoriesApi } from '~/api/categories';
import { tagsApi } from '~/api/tags';
import { Link } from 'react-router';
import { useAuthStore } from '~/store/authStore';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import HeroSection from '~/components/layout/Hero';
import NewLetters from '~/components/NewLetters';
import GlobalSearch from '~/components/search/GlobalSearch';
import { formatNumber } from '~/lib/utils';
import {
  TrendingUp,
  Users,
  BookOpen,
  Star,
  ArrowRight,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Hash,
  Folder,
  Award,
  Zap,
  Target,
  Globe,
  PenTool,
  Coffee,
  Lightbulb,
  Rocket,
} from 'lucide-react';
import type { Category, Tag } from '~/types';

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();

  // Fetch featured posts
  const {
    data: featuredPosts,
    isLoading: featuredLoading,
  } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => postsApi.getFeaturedPosts(),
  });

  // Fetch latest posts
  const {
    data: latestPosts,
    isLoading: latestLoading,
  } = useQuery({
    queryKey: ['posts', 'latest'],
    queryFn: () => postsApi.getPosts(0, 8),
  });

  // Fetch popular posts
  const {
    data: popularPosts,
    isLoading: popularLoading,
  } = useQuery({
    queryKey: ['posts', 'popular'],
    queryFn: () => postsApi.getPosts(0, 6), // TODO: Add popular sorting
  });

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  // Fetch trending tags
  const {
    data: tagsData,
    isLoading: tagsLoading,
  } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getAll(),
  });

  // const categories = categoriesData?.?.slice(0, 8) || [];
  // const trendingTags = tagsData?.data?.slice(0, 12) || [];
  const categories  = categoriesData
  const trendingTags = tagsData

  return (
    <MainLayout>
      {/* Enhanced Hero Section */}
      <HeroSection />

      {/* Quick Search Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What are you looking for?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Search through thousands of articles, tutorials, and insights
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <GlobalSearch
              variant="standalone"
              placeholder="Search posts, topics, authors..."
              showSuggestions={true}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Platform Statistics */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatNumber(1250)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Articles Published
              </div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatNumber(5420)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Writers
              </div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatNumber(125000)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Monthly Readers
              </div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-4">
                <Heart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatNumber(45000)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Likes Given
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Articles
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Hand-picked content from our community
              </p>
            </div>
            <Link to="/posts?featured=true">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <PostList
            posts={featuredPosts?.data || []}
            loading={featuredLoading}
          />
        </section>

        {/* Popular Categories */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Popular Categories
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore content by topic
              </p>
            </div>
            <Link to="/categories">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>All Categories</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-24"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.map((category :Category) => (
                <Link
                  key={category.id}
                  to={`/posts?category=${category.slug}`}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.backgroundColor || '#6B7280' }}
                    >
                      <Folder className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {category.category}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {category.description || 'Explore articles in this category'}
                  </p>
                 
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Latest Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Latest Articles
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Fresh content from our writers
              </p>
            </div>
            <Link to="/posts">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <PostList
            posts={latestPosts?.content || []}
            loading={latestLoading}
          />
        </section>

        {/* Trending Tags */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Trending Topics
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Popular tags and topics this week
              </p>
            </div>
            <Link to="/tags">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>All Tags</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {tagsLoading ? (
            <div className="flex flex-wrap gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-8 w-20"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {trendingTags?.map((tag: Tag) => (
                <Link
                  key={tag.uuid}
                  to={`/posts?tag=${tag.slug}`}
                  className="group inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700"
                  style={{ borderColor: tag.color }}
                >
                  <Hash className="h-4 w-4" style={{ color: tag.color }} />
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tag.name}
                  </span>
                  {/* {tag.postCount && (
                    <Badge variant="secondary" className="text-xs">
                      {tag.postCount}
                    </Badge>
                  )} */}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Popular Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Most Popular
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Reader favorites and trending content
              </p>
            </div>
            <Link to="/posts?sort=popular">
              <Button variant="outline" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>View Trending</span>
              </Button>
            </Link>
          </div>

          <PostList
            posts={popularPosts?.content || []}
            loading={popularLoading}
          />
        </section>

        {/* Author Spotlight */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Author Spotlight
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Meet our featured writers and content creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Tech Writer",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                posts: 45,
                followers: 1200,
                bio: "Passionate about web development and sharing knowledge with the community."
              },
              {
                name: "Mike Chen",
                role: "Full Stack Developer",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                posts: 32,
                followers: 890,
                bio: "Building scalable applications and writing about modern development practices."
              },
              {
                name: "Emily Rodriguez",
                role: "UX Designer",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                posts: 28,
                followers: 756,
                bio: "Designing user experiences and sharing insights about design thinking."
              }
            ].map((author, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {author.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                  {author.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {author.bio}
                </p>
                <div className="flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>{author.posts} posts</span>
                  <span>•</span>
                  <span>{author.followers} followers</span>
                </div>
                <Button size="sm" variant="outline">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Features Showcase */}
        {/* <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the features that make our blogging platform the perfect place to share your ideas and connect with readers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: PenTool,
                title: "Rich Editor",
                description: "Write with our powerful editor supporting markdown, rich text, and media embeds.",
                color: "blue"
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Connect with like-minded writers and readers in our vibrant community.",
                color: "green"
              },
              {
                icon: Zap,
                title: "Fast & Responsive",
                description: "Lightning-fast loading times and mobile-optimized reading experience.",
                color: "yellow"
              },
              {
                icon: Target,
                title: "SEO Optimized",
                description: "Built-in SEO tools to help your content reach a wider audience.",
                color: "purple"
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Share your content with readers from around the world.",
                color: "indigo"
              },
              {
                icon: Award,
                title: "Recognition System",
                description: "Earn badges and recognition for your contributions to the community.",
                color: "orange"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-lg mb-4`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section> */}

        {/* Call to Action for Writers */}
        {/* <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <Rocket className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl mb-8 text-blue-100 dark:text-blue-200">
              Join thousands of writers who are already sharing their knowledge and building their audience on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard/posts/new">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      <PenTool className="h-5 w-5 mr-2" />
                      Write Your First Post
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      <Users className="h-5 w-5 mr-2" />
                      Join Our Community
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section> */}

        {/* Newsletter Signup */}
        <section>
          <NewLetters />
        </section>

        {/* Quick Tips */}
        {/* <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Writing Tips & Tricks
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Quick tips to improve your writing and engage your audience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                tip: "Start with a compelling headline that grabs attention",
                category: "Headlines"
              },
              {
                tip: "Use short paragraphs and bullet points for better readability",
                category: "Formatting"
              },
              {
                tip: "Include relevant images and media to break up text",
                category: "Visuals"
              },
              {
                tip: "End with a call-to-action to encourage engagement",
                category: "Engagement"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                  {item.category}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {item.tip}
                </p>
              </div>
            ))}
          </div>
        </section> */}

        {/* Community Stats */}
        {/* <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Join Our Growing Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                10K+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Active Writers
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                50K+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Published Articles
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                1M+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Monthly Readers
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </MainLayout>
  );
}