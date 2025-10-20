import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

// UI Components
import { Button } from '~/components/ui/button';
import { Save, Send, Eye, X, Settings, AlertCircle, FileText, Tag, Image as ImageIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '~/components/ui/Card';

// API
import { categoriesApi } from '~/api/categories';
import { tagsApi } from '~/api/tags';
import { type CreateAuthorPostRequest } from '~/api/author';

// Editor & Preview
import EditorWrapper from '~/components/editors/EditorWrapper';
import PostPreview from '~/components/post/PostPreview';
import ThumbnailUpload from '~/components/ui/ThumbnailUpload';
import { authorApi } from '~/api/author';


const postSchema = z.object({
  title: z.string().min(5, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề không được quá 200 ký tự'),
  excerpt: z.string().min(5, 'Hãy thêm tóm tắt').max(200, 'Tóm tắt không được quá 200 ký tự'),
  summary: z.string().max(500, 'Tóm tắt không được quá 500 ký tự').optional(),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
  tagUuids: z.array(z.string()).optional(),
  thumbnailUrl: z.string().optional(),
  contentType: z.enum(['MARKDOWN', 'RICHTEXT']),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  public_date: z.string().min(1, 'You should add this'),
});

type PostForm = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [excerptCharCount, setExcerptCharCount] = useState(0);

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
  const titleValue = watch('title') || '';
  const excerptValue = watch('excerpt') || '';

  // Live counters
  useState(() => {
    setTitleCharCount(titleValue.length);
    setExcerptCharCount(excerptValue.length);
  });

  const wordCount = (contentValue?.trim()?.split(/\s+/)?.filter(Boolean)?.length) || 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

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

  const onSubmit = (data: PostForm) => {
    setSubmitError(null);
    const payload: CreateAuthorPostRequest = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      categories: [Number(data.categoryId)],
      tags: selectedTags,
      thumbnail: data.thumbnailUrl || undefined,
      public_date: data.public_date, 
    };
    createPostMutation.mutate(payload);
  };

  const handleTagToggle = (tagUuid: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagUuid)
        ? prev.filter((uuid) => uuid !== tagUuid)
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
    setValue('content', value, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
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
              <Button
                type="submit"
                variant="secondary"
                onClick={() => {
                  setValue('status', 'DRAFT', { shouldValidate: true });
                  handleSubmit(onSubmit)();
                }}
                disabled={createPostMutation.isPending}
                className="text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu nháp
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  setValue('status', 'PUBLISHED', { shouldValidate: true });
                  handleSubmit(onSubmit)();
                }}
                disabled={createPostMutation.isPending}
                className="text-sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Xuất bản
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Input */}
              <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <input
                    {...register('title')}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="w-full text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{titleCharCount}/200 ký tự</span>
                    <span className={errors.title ? 'text-red-600 dark:text-red-400' : ''}>{errors.title ? errors.title.message : ''}</span>
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white dark:bg-black rounded-lg shadow-sm">
                <div>
                  <EditorWrapper
                    contentType={contentType}
                    value={contentValue || ''}
                    onChange={handleContentChange}
                    placeholder={contentType === 'RICHTEXT' ? 'Viết nội dung bài viết...' : '# Tiêu đề\n\nViết nội dung bài viết bằng Markdown...'}
                  />
                  {errors.content && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
                  )}
                  <div className="px-6 py-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                    <span>{wordCount} từ • ~{readingTimeMinutes} phút đọc</span>
                    <span>Nội dung: {contentType === 'RICHTEXT' ? 'Rich Text' : 'Markdown'}</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <div className="w-80 space-y-6 sticky top-6 self-start">
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-black text-gray-900 dark:text-gray-100 resize-none"
                    placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                  />
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">{excerptCharCount}/200 ký tự</span>
                    {errors.excerpt && (
                      <span className="text-red-600 dark:text-red-400">{errors.excerpt.message}</span>
                    )}
                  </div>
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
                      Ngày xuất bản
                    </label>
                    <input
                      type="datetime-local"
                      {...register('public_date')}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-black text-gray-900 dark:text-gray-100"
                    />
                    {errors.public_date && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.public_date.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Danh mục
                    </label>
                    <select
                      {...register('categoryId')}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-black text-gray-900 dark:text-gray-100"
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
                    <div className="inline-flex rounded-md shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setValue('contentType', 'RICHTEXT', { shouldValidate: true })}
                        className={`px-3 py-1.5 text-xs ${contentType === 'RICHTEXT' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-black text-gray-700 dark:text-gray-300'}`}
                      >
                        Rich Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('contentType', 'MARKDOWN', { shouldValidate: true })}
                        className={`px-3 py-1.5 text-xs border-l border-gray-300 dark:border-gray-700 ${contentType === 'MARKDOWN' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-black text-gray-700 dark:text-gray-300'}`}
                      >
                        Markdown
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thumbnail Upload */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
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
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.thumbnailUrl.message}</p>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Tags {selectedTags.length > 0 ? `(${selectedTags.length})` : ''}
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
                              : 'bg-gray-100 dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Lỗi tạo bài viết</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{submitError}</p>
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