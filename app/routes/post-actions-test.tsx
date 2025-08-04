import { useState } from 'react';
import { MainLayout } from '~/components/layout/MainLayout';
import { LikeButton } from '~/components/post/LikeButton';
import { RatingComponent } from '~/components/post/RatingComponent';
import { PostActions } from '~/components/post/PostActions';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { useAuthStore } from '~/store/authStore';
import type { Post } from '~/types';

export default function PostActionsTestPage() {
  const { user, isAuthenticated } = useAuthStore();
  
  // Mock post data
  const [mockPost] = useState<Post>({
    id: "test-post-123",
    title: "Test Post for Like & Rating",
    slug: "test-post-like-rating",
    content: "This is a test post to demonstrate like and rating functionality.",
    user: {
      id: "author-1",
      username: "testauthor",
      email: "author@example.com",
      roles: ["USER"]
    },
    categories: [],
    tags: [],
    createdAt: "2024-01-01T00:00:00Z",
    featured: false,
    viewCount: 42,
    likeCount: 5,
    commentCount: 3,
    averageRating: 4.2,
    isLikedByCurrentUser: false,
    isSavedByCurrentUser: false,
    userRating: null,
    comments: []
  });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Post Actions Test
          </h1>
          <p className="text-gray-600">
            Test tính năng like và rating cho posts
          </p>
        </div>

        {/* Auth Status */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">Authentication Status</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              {user && (
                <p><strong>User:</strong> {user.username} ({user.email})</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mock Post */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">{mockPost.title}</h2>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-6">
              <p className="text-gray-600">
                {mockPost.content}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
                <span>👁️ {mockPost.viewCount} lượt xem</span>
                <span>💬 {mockPost.commentCount} bình luận</span>
              </div>
            </div>

            {/* Post Actions - New Design */}
            <PostActions post={mockPost} layout="vertical" />
          </CardContent>
        </Card>

        {/* Individual Components Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Like Button Test */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Like Button Test</h3>
            </CardHeader>
            <CardContent>
              <LikeButton
                postId={mockPost.id}
                initialLiked={mockPost.isLikedByCurrentUser}
                initialLikeCount={mockPost.likeCount}
              />
            </CardContent>
          </Card>

          {/* Rating Component Test */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Rating Component Test (Full)</h3>
            </CardHeader>
            <CardContent>
              <RatingComponent
                postId={mockPost.id}
                initialUserRating={mockPost.userRating}
                initialAverageRating={mockPost.averageRating}
                showAverage={true}
                compact={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Compact Components Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Compact Like Button */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Compact Like Button</h3>
            </CardHeader>
            <CardContent>
              <LikeButton
                postId={mockPost.id}
                initialLiked={mockPost.isLikedByCurrentUser}
                initialLikeCount={mockPost.likeCount}
              />
            </CardContent>
          </Card>

          {/* Compact Rating */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Compact Rating</h3>
            </CardHeader>
            <CardContent>
              <RatingComponent
                postId={mockPost.id}
                initialUserRating={mockPost.userRating}
                initialAverageRating={mockPost.averageRating}
                compact={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Test Instructions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900">Test Flow cho User chưa đăng nhập:</h4>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Logout nếu đang đăng nhập</li>
                  <li>Thử bấm nút "Thích" hoặc đánh giá sao</li>
                  <li>Được redirect đến trang login</li>
                  <li>Đăng nhập thành công</li>
                  <li>Được redirect về trang này</li>
                  <li>Thử lại like/rating</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Test Flow cho User đã đăng nhập:</h4>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Bấm nút "Thích" để like/unlike post</li>
                  <li>Bấm vào sao để đánh giá (1-5 sao)</li>
                  <li>Kiểm tra console để xem API calls</li>
                  <li>Verify UI updates ngay lập tức</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">API Endpoints được test:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li><code>POST /post/{'{postId}'}/like</code> - Like/unlike post</li>
                  <li><code>POST /post/{'{postId}'}/rate?score={'{score}'}</code> - Rate post (1-5)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
