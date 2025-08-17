import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';

import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { postsApi } from '~/api/posts';
import { categoriesApi } from '~/api/categories';
import { tagsApi } from '~/api/tags';
import { useAuthStore } from '~/store/authStore';
import { Button } from '~/components/ui/button';
import { Settings, Tag, Image, FileText, Save, Send, AlertCircle, Eye, X, History } from 'lucide-react';
import ThumbnailUpload from '~/components/ui/ThumbnailUpload';
import PostPreview from '~/components/post/PostPreview';
import EditorWrapper from '~/components/editors/EditorWrapper';
import { authApi } from '~/api/auth';
import { authorApi, type CreateAuthorPostRequest } from '~/api/author';

const postSchema = z.object({
  title: z.string().min(5, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề không được quá 200 ký tự'),
  excerpt: z.string().min(5, 'Hãy thêm tóm tắt ').max(200, 'không được quá 200 ký tự'),
  summary: z.string().max(500, 'Tóm tắt không được quá 500 ký tự').optional(),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
  tagUuids: z.array(z.string()).optional(),
  thumbnailUrl: z.string().optional(),
  contentType: z.enum(['MARKDOWN', 'RICHTEXT']),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

type PostForm = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [postId, setPostId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      contentType: 'RICHTEXT',
      status: 'DRAFT',
    },
  });

  const contentType = watch('contentType');
  const contentValue = watch('content');

  // Fetch post by slug for editing
  const { data: postResp, isLoading: postLoading, refetch: refetchPost } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.getPostBySlug(slug!),
    enabled: !!slug,
  });

  // Populate form when post loads
  useEffect(() => {
    const p = postResp?.data;
    if (!p) return;
    setPostId(p.id);
    setValue('title', p.title || '');
    setValue('excerpt', p.summary || p.excerpt || '');
    setValue('summary', p.summary || '');
    setValue('content', p.content || '');
    setValue('categoryId', p.categories && p.categories.length > 0 ? String(p.categories[0].id) : '');
    setValue('thumbnailUrl', p.thumbnail || p.thumbnailUrl || '');
    setValue('contentType', p.contentType || 'RICHTEXT');
    setSelectedTags(p.tags?.map((t: any) => t.uuid) || []);
  }, [postResp]);

  // Fetch categories and tags
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
  });

  const createPostMutation = useMutation({
    mutationFn: authorApi.createPost,
    onSuccess: () => {
      navigate('/dashboard/content');
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
      setSubmitError(error.response?.data?.message || 'Có lỗi xảy ra khi tạo bài viết');
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (data: PostForm) => {
      if (!postId) throw new Error('Missing post id');
      const payload: any = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        categories: [Number(data.categoryId)],
        tags: selectedTags,
        thumbnail: data.thumbnailUrl || undefined,
      };
      return authorApi.updatePost(String(postId), payload);
    },
    onSuccess: () => {
      refetchPost();
    },
    onError: (error: any) => {
      console.error('Error updating post:', error);
      setSubmitError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bài viết');
    },
  });

  const onSubmit = (data: PostForm) => {
    setSubmitError(null);
    const payload: CreateAuthorPostRequest = {
      title: data.title,
      excerpt:data.excerpt,
      content: data.content,
      categories: [Number(data.categoryId)],
      tags: selectedTags,
      thumbnail: data.thumbnailUrl || undefined,
    };
    createPostMutation.mutate(payload);
  };

  const handleTagToggle = (tagUuid: string) => {
    setSelectedTags(prev =>
      prev.includes(tagUuid)
        ? prev.filter(uuid => uuid !== tagUuid)
        : [...prev, tagUuid]
    );
  };

  const handleThumbnailChange = (url: string) => {
    setValue('thumbnailUrl', url);
  };

  const handleThumbnailRemove = () => {
    setValue('thumbnailUrl', '');
  };

  const handleContentChange = (value: string) => {
    setValue('content', value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Settings className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Viết bài mới</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard/content')}
                className="text-sm"
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPreview(true)}
                className="text-sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </Button>
              {/* <Button
                type="submit"
                variant="secondary"
                onClick={() => {
                  setValue('status', 'DRAFT');
                  handleSubmit(onSubmit)();
                }}
                disabled={createPostMutation.isPending}
                className="text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Cập nhật
              </Button> */}
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (!postId) return;
                  handleSubmit((data) => updatePostMutation.mutate(data))();
                }}
                disabled={updatePostMutation.isPending}
                className="text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Cập nhật
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => refetchPost()}
                className="text-sm"
              >
                <History className="w-4 h-4 mr-2" />
                Tải lại
              </Button>
              {/* <Button
                type="submit"
                onClick={() => {
                  setValue('status', 'PUBLISHED');
                  handleSubmit(onSubmit)();
                }}
                disabled={createPostMutation.isPending}
                className="text-sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Xuất bản
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Input */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <input
                    {...register('title')}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="w-full text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <EditorWrapper
                    contentType={contentType}
                    value={contentValue || ''}
                    onChange={handleContentChange}
                    placeholder={contentType === 'RICHTEXT' ? "Viết nội dung bài viết..." : "# Tiêu đề\n\nViết nội dung bài viết bằng Markdown..."}
                  />
                  {errors.content && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <div className="w-80 space-y-6">
              {/* Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Tóm tắt
                  </h3>
                </CardHeader>
                <CardContent>
                  <textarea
                    {...register('excerpt')}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                    placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                  />
                  {errors.summary && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.summary.message}</p>
                  )}
                </CardContent>
              </Card>

              {/* Category & Content Type */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Cài đặt
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Danh mục
                    </label>
                    <select
                      {...register('categoryId')}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      disabled={categoriesLoading}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.category}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.categoryId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Loại nội dung
                    </label>
                    <select
                      {...register('contentType')}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="RICHTEXT">Rich Text</option>
                      <option value="MARKDOWN">Markdown</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Thumbnail Upload */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                    <Image className="w-4 h-4 mr-2" />
                    Ảnh đại diện
                  </h3>
                </CardHeader>
                <CardContent>
                  <ThumbnailUpload
                    value={watch('thumbnailUrl')}
                    onChange={handleThumbnailChange}
                    onRemove={handleThumbnailRemove}
                    maxSize={10}
                    allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                  />
                  {errors.thumbnailUrl && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      {errors.thumbnailUrl.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Tags
                  </h3>
                </CardHeader>
                <CardContent>
                  {tagsLoading ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Đang tải tags...</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags?.map((tag) => (
                        <button
                          key={tag.uuid}
                          type="button"
                          onClick={() => handleTagToggle(tag.uuid)}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            selectedTags.includes(tag.uuid)
                              ? 'text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                          style={selectedTags.includes(tag.uuid) ? { backgroundColor: tag.color } : {}}
                        >
                          #{tag.name}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {submitError && (
        <div className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                Lỗi tạo bài viết
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {submitError}
              </p>
            </div>
            <button
              onClick={() => setSubmitError(null)}
              className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Post Preview */}
      <PostPreview
        post={{
          title: watch('title') || '',
          content: watch('content') || '',
          summary: watch('summary') || '',
          thumbnailUrl: watch('thumbnailUrl') || '',
          contentType: watch('contentType') || 'RICHTEXT',
        }}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}
