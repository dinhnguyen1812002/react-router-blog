import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "~/components/layout/MainLayout";
import { PostList } from "~/components/post/PostList";
import { postsApi } from "~/api/posts";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
import { Link } from "react-router";
import { useAuthStore } from "~/store/authStore";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import HeroSection from "~/components/layout/Hero";
import NewLetters from "~/components/NewLetters";
import GlobalSearch from "~/components/search/GlobalSearch";
import { formatNumber } from "~/lib/utils";

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
} from "lucide-react";
import type { Category, Tag } from "~/types";

import { userApi } from "~/api/user";
import Avatar from "boring-avatars";
import UserAvatar from "~/components/ui/boring-avatar";
import type { Route } from "../+types/root";



export function meta({ }: Route.MetaArgs) {
  return [
    // Basic SEO Metadata
    { title: "Blog App - Discover Inspiring Stories & Insights" },
    {
      name: "description",
      content:
        "Explore a vibrant community of writers sharing knowledge, tutorials, and insights. Discover trending articles, popular categories, and connect with creators on our blog platform.",
    },
    {
      name: "keywords",
      content:
        "blog, articles, tutorials, writing community, trending topics, categories, insights, knowledge sharing",
    },

    // Open Graph (OG) Metadata for Social Media (e.g., Facebook, LinkedIn)
    { property: "og:title", content: "Blog App - Your Source for Inspiring Content" },
    {
      property: "og:description",
      content:
        "Join our blog platform to read, write, and connect with a global community of writers and readers. Explore trending articles and diverse topics.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://your-blog-app.com" }, // Replace with your actual domain
    { property: "og:image", content: "https://your-blog-app.com/og-image.jpg" }, // Replace with a relevant image URL
    { property: "og:site_name", content: "Blog App" },

    // Twitter Card Metadata
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Blog App - Discover Inspiring Stories" },
    {
      name: "twitter:description",
      content:
        "Read and share inspiring articles on our blog platform. Join a community of writers and explore trending topics today!",
    },
    { name: "twitter:image", content: "https://your-blog-app.com/twitter-image.jpg" }, // Replace with a relevant image URL
    { name: "twitter:site", content: "@YourBlogHandle" }, // Replace with your Twitter handle

    // Additional Metadata
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { charset: "UTF-8" },
  ];
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();

  // Fetch featured posts
  const { data: featuredPosts, isLoading: featuredLoading } = useQuery({
    queryKey: ["posts", "featured"],
    queryFn: () => postsApi.getFeaturedPosts(),
  });

  // Fetch latest posts
  const { data: latestPosts, isLoading: latestLoading } = useQuery({
    queryKey: ["posts", "latest"],
    queryFn: () => postsApi.getPosts(0, 4),
  });

  // Fetch popular posts
  const { data: popularPosts, isLoading: popularLoading } = useQuery({
    queryKey: ["posts", "popular"],
    queryFn: () => postsApi.getPosts(0, 4), // TODO: Add popular sorting
  });

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  // Fetch trending tags
  const { data: tagsData, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => tagsApi.getAll(),
  });

  const { data: topuserData, isLoading: topuserLoading } = useQuery({
    queryKey: ["top-user"],
    queryFn: () => userApi.getTopUser(),
  });

  // const categories = categoriesData?.?.slice(0, 8) || [];
  // const trendingTags = tagsData?.data?.slice(0, 12) || [];
  const categories = categoriesData;

  const trendingTags = tagsData;
  console.log( categories);
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
                <span className="text-gray-600 dark:text-gray-400">View All</span>
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
                <span className="text-gray-600 dark:text-gray-400">All Categories</span>
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
              {categories?.map((category: Category) => (
                <Link
                  key={category.id}
                  to={`/posts?category=${category.slug}`}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Folder className="h-5 w-5 text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold  
                      dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate"
                        style={{
                          border: category.backgroundColor || "#6B7280",
                        }}
                      >
                        {category.category}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {category.description ||
                      "Explore articles in this category"}
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
                <span className="text-gray-600 dark:text-gray-400">View All</span>
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
                <span className="text-gray-600 dark:text-gray-400">All Tags</span>
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
                <span className="text-gray-600 dark:text-gray-400">View Trending</span>
              </Button>
            </Link>
          </div>

          <PostList
            posts={popularPosts?.content || []}
            loading={popularLoading}
          />
        </section>

        {/* Author Spotlight */}
        <section className="">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Author Spotlight
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Meet our featured writers and content creators
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topuserData?.map((author) => (
              <div
                key={author.id}
                className=" rounded-lg p-6 text-center shadow-sm"
              >
              
                <UserAvatar
                  src={author.avatar ?? "/avatar/avatar.jpg"}
                  alt={author.username}
                  name={author.username}
                  size={80}
                  variant="beam"
                  colors={['#FF5733', '#FFC300', '#DAF7A6']}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />

                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {author.username}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {author.email}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {author.bio}
                </p>
                <div className="flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>{author.postCount} posts</span>
                  {author.socialMediaLinks && (
                    <>
                      <span>•</span>
                      <span>
                        {Object.keys(author.socialMediaLinks).length} socials
                      </span>
                    </>
                  )}
                </div>
                {/* <Button size="sm" variant="outline" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Follow
                </Button> */}
              </div>
            ))}
          </div>
        </section>

        <NewLetters />
      </div>
    </MainLayout>
  );
}
