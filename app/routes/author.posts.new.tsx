import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { MainLayout } from '~/components/layout/MainLayout';

import { Input } from '~/components/ui/Input';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { authorApi, type CreateAuthorPostRequest } from '~/api/author';
import { categoriesApi } from '~/api/categories';
import { tagsApi } from '~/api/tags';
// TODO: Add authentication when implemented
import { Button } from '~/components/ui/button';
import ThumbnailUpload from '~/components/ui/ThumbnailUpload';
import EditorWrapper from '~/components/editors/EditorWrapper';

const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề không được quá 200 ký tự'),
  summary: z.string().max(500, 'Tóm tắt không được quá 500 ký tự').optional(),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
  tagUuids: z.array(z.string()).optional(),
  thumbnailUrl: z.string().optional(),
  contentType: z.enum(['RICHTEXT', 'MARKDOWN']),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

type PostForm = z.infer<typeof postSchema>;

export default function NewPostPage() {
  // TODO: Get user when authentication is implemented
  const user = null;
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      navigate('/author/posts');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    },
  });

  const onSubmit = (data: PostForm) => {
    const payload: CreateAuthorPostRequest = {
      title: data.title,
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

  // if (!user?.roles.includes('ROLE_AUTHOR')) {
  //   return (
  //       <MainLayout>
  //         <div className="max-w-4xl mx-auto px-4 py-8 text-center">
  //           <h1 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h1>
  //           <p className="text-gray-600">Bạn cần có quyền tác giả để truy cập trang này.</p>
  //         </div>
  //       </MainLayout>
  //   );
  // }

  return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Viết bài mới</h1>
            <p className="text-gray-600">Tạo một bài viết mới để chia sẻ với cộng đồng</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                    // label="Tiêu đề bài viết"
                    {...register('title')}
                    // error={errors.title?.message}
                    placeholder="Nhập tiêu đề bài viết..."
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tóm tắt (tùy chọn)
                  </label>
                  <textarea
                      {...register('summary')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                  />
                  {errors.summary && (
                      <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                        {...register('categoryId')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại nội dung
                    </label>
                    <select
                        {...register('contentType')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="RICH_TEXT">Rich Text</option>
                      <option value="MARKDOWN">Markdown</option>
                    </select>
                  </div>
                </div>

                {/* Thumbnail Upload per docs step 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh thumbnail (tùy chọn)
                  </label>
                  <ThumbnailUpload
                    value={watch('thumbnailUrl')}
                    onChange={(url) => setValue('thumbnailUrl', url)}
                    onRemove={() => setValue('thumbnailUrl', '')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Tags</h2>
              </CardHeader>
              <CardContent>
                {tagsLoading ? (
                    <p className="text-gray-500">Đang tải tags...</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags?.map((tag) => (
                          <button
                              key={tag.uuid}
                              type="button"
                              onClick={() => handleTagToggle(tag.uuid)}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                  selectedTags.includes(tag.uuid)
                                      ? 'text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Nội dung bài viết</h2>
              </CardHeader>
              <CardContent>
                <EditorWrapper
                  contentType={watch('contentType')}
                  value={watch('content') || ''}
                  onChange={(val) => setValue('content', val)}
                  placeholder={watch('contentType') === 'MARKDOWN' ? '# Tiêu đề\n\nViết nội dung bài viết bằng Markdown...' : 'Viết nội dung bài viết...'}
                />
                {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/author/posts')}
              >
                Hủy
              </Button>

              <div className="flex space-x-4">
                <Button
                    type="submit"
                    variant="secondary"
                    onClick={() => setValue('status', 'DRAFT')}
                    disabled={createPostMutation.isPending}
                >
                  💾 Lưu nháp
                </Button>
                <Button
                    type="submit"
                    onClick={() => setValue('status', 'PUBLISHED')}
                    disabled={createPostMutation.isPending}
                >
                  🚀 Xuất bản
                </Button>
              </div>
            </div>

            {createPostMutation.error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.
                </div>
            )}
          </form>
        </div>
      </MainLayout>
  );
}