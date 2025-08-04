import { useState } from 'react';
import { MainLayout } from '~/components/layout/MainLayout';
import { CommentSection } from '~/components/comment/CommentSection';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { useAuthStore } from '~/store/authStore';
import type { Comment as CommentType } from '~/types';

export default function CommentTestPage() {
  const { user, isAuthenticated } = useAuthStore();

  // Mock post ID for testing
  const mockPostId = "test-post-123";

  // Mock initial comments
  const [mockComments, setMockComments] = useState<CommentType[]>([
    {
      id: "comment-1",
      content: "Đây là bình luận mẫu đầu tiên",
      user: {
        id: "user-1",
        username: "testuser1",
        email: "test1@example.com",
        roles: ["USER"]
      },
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: null,
      depth: 0,
      parentCommentId: null,
      replyCount: 1,
      hasMoreReplies: false,
      replies: [
        {
          id: "comment-2",
          content: "Đây là reply cho bình luận đầu tiên",
          user: {
            id: "user-2",
            username: "testuser2",
            email: "test2@example.com",
            roles: ["USER"]
          },
          createdAt: "2024-01-01T11:00:00Z",
          updatedAt: null,
          depth: 1,
          parentCommentId: "comment-1",
          replyCount: 0,
          hasMoreReplies: false,
          replies: null
        }
      ]
    }
  ]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Comment System Test
          </h1>
          <p className="text-gray-600">
            Test tính năng bình luận với authentication flow
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
            <h2 className="text-xl font-bold">Mock Blog Post</h2>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                Đây là một bài viết mẫu để test hệ thống bình luận. 
                Bạn có thể thử các tính năng sau:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li><strong>Chưa đăng nhập:</strong> Viết bình luận → Redirect đến login → Auto submit sau khi login</li>
                <li><strong>Đã đăng nhập:</strong> Viết bình luận trực tiếp</li>
                <li><strong>Reply:</strong> Trả lời bình luận của người khác</li>
                <li><strong>Edit/Delete:</strong> Chỉnh sửa/xóa bình luận của mình</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Comment Section */}
        <CommentSection
          postId={mockPostId}
          initialComments={mockComments}
          onCommentsUpdate={(updatedComments) => {
            setMockComments(updatedComments);
            console.log('Mock comments updated:', updatedComments.length);
          }}
        />

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-lg font-semibold">Test Instructions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900">Test Flow cho User chưa đăng nhập:</h4>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Logout nếu đang đăng nhập</li>
                  <li>Viết bình luận trong form</li>
                  <li>Bấm "Đăng nhập & Bình luận"</li>
                  <li>Được redirect đến trang login</li>
                  <li>Đăng nhập thành công</li>
                  <li>Được redirect về trang này</li>
                  <li>Bình luận tự động được gửi</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Test Flow cho User đã đăng nhập:</h4>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Viết bình luận trong form</li>
                  <li>Bấm "Bình luận"</li>
                  <li>Bình luận được gửi ngay lập tức</li>
                  <li>Có thể reply, edit, delete bình luận của mình</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
