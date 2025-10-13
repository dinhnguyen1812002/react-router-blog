import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';

// UI Components
import { Button } from '~/components/ui/button';
import { 
  Save, 
  Send, 
  Eye, 
  X, 
  Settings, 
  AlertCircle, 
  FileText, 
  Tag, 
  Image as ImageIcon,
  Type,
  Clock,
  BookOpen,
  Focus,
  ChevronDown,
  History,
  Lightbulb,
} from 'lucide-react';
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
  public_date: z.string().min(1, 'Ngày xuất bản là bắt buộc'),
});

type PostForm = z.infer<typeof postSchema>;

export default function EditPostPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [excerptCharCount, setExcerptCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      contentType: 'RICHTEXT',
      status: 'DRAFT',
      public_date: new Date().toISOString().slice(0, 16),
    },
  });

  const contentType = watch('contentType');
  const contentValue = watch('content');
  const titleValue = watch('title') || '';
  const excerptValue = watch('excerpt') || '';

  // Live counters
  useEffect(() => {
    setTitleCharCount(titleValue.length);
    setExcerptCharCount(excerptValue.length);
  }, [titleValue, excerptValue]);

  const wordCount = (contentValue?.trim()?.split(/\s+/)?.filter(Boolean)?.length) || 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const characterCount = contentValue?.length || 0;

  // ============================================
  // FETCH POST BY ID
  // ============================================
  const { data: postResponse, isLoading: postLoading, error: postError, refetch: refetchPost } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required');
      const response = await authorApi.getPostById(id);
      return response;
    },
    enabled: !!id,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // ============================================
  // POPULATE FORM khi data load xong
  // ============================================
  useEffect(() => {
    if (!postResponse) return;
    
    const post = postResponse;
    console.log(' Populating form with post:', post);
    
    // Set basic fields
    setValue('title', post.title || '', { shouldValidate: false });
    setValue('excerpt', post.excerpt || '', { shouldValidate: false });
    setValue('content', post.content || '', { shouldValidate: false });
    
    // Set category
    if (post.categories && post.categories.length > 0) {
      setValue('categoryId', String(post.categories[0].id), { shouldValidate: false });
    }
    
    // Set thumbnail
    if (post.thumbnail) {
      setValue('thumbnailUrl', post.thumbnail, { shouldValidate: false });
    }
    
    // Set content type
    setValue('contentType', 'RICHTEXT', { shouldValidate: false });
    
    // Set status
    setValue('status', post.is_publish ? 'PUBLISHED' : 'DRAFT', { shouldValidate: false });
    
    // Set publish date
    if (post.public_date) {
      const dateStr = String(post.public_date).slice(0, 16);
      setValue('public_date', dateStr, { shouldValidate: false });
    }
    
    // Set tags
    if (post.tags && Array.isArray(post.tags)) {
      const tagUuids = post.tags.map((t: any) => t.uuid);
      setSelectedTags(tagUuids);
    }
    
    console.log('✅ Form populated successfully');
  }, [postResponse, setValue]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!contentValue || !titleValue || !id) return;
    
    setAutoSaveStatus('saving');
    try {
      const formData = getValues();
      const payload: CreateAuthorPostRequest = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        categories: [Number(formData.categoryId)],
        tags: selectedTags,
        thumbnail: formData.thumbnailUrl || undefined,
        public_date: formData.public_date || undefined,
        is_publish: formData.status === 'PUBLISHED',
      };
      
      await authorApi.updatePost(id, payload);
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('error');
    }
  }, [contentValue, titleValue, id, getValues, selectedTags]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  // Fetch categories and tags
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
  });

  // ============================================
  // UPDATE POST MUTATION
  // ============================================
  const updatePostMutation = useMutation({
    mutationFn: async (data: PostForm) => {
      if (!id) throw new Error('Post ID is required');
      
      const payload: CreateAuthorPostRequest = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        categories: [Number(data.categoryId)],
        tags: selectedTags,
        thumbnail: data.thumbnailUrl || undefined,
        public_date: data.public_date,
        is_publish: data.status === 'PUBLISHED',
      };
      
      console.log(' Updating post:', payload);
      return await authorApi.updatePost(id, payload);
    },
    onSuccess: () => {
      console.log(' Post updated successfully');
      // navigate('/dashboard/');
      navigate(-1)
    },
    onError: (error: any) => {
      console.error('Error updating post:', error);
      setSubmitError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bài viết');
    },
  });

  const onSubmit = (data: PostForm) => {
    setSubmitError(null);
    updatePostMutation.mutate(data);
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

  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
    if (!focusMode) {
      setShowSidebar(false);
    }
  };

  const WritingStats = () => (
    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center space-x-1">
        <Type className="w-3 h-3" />
        <span>{wordCount} từ</span>
        
      </div>
      <div className="flex items-center space-x-1">
        <Clock className="w-3 h-3" />
        <span>~{readingTimeMinutes} phút</span>
      </div>
      <div className="flex items-center space-x-1">
        <BookOpen className="w-3 h-3" />
        <span>{characterCount} ký tự</span>
      </div>
    </div>
  );

  const AutoSaveIndicator = () => (
    <div className="flex items-center space-x-2 text-xs">
      {autoSaveStatus === 'saving' && (
        <div className="flex items-center space-x-1 text-blue-600">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span>Đang lưu...</span>
        </div>
      )}
      {autoSaveStatus === 'saved' && lastSaved && (
        <div className="flex items-center space-x-1 text-green-600">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <span>Đã lưu {lastSaved.toLocaleTimeString()}</span>
        </div>
      )}
      {autoSaveStatus === 'error' && (
        <div className="flex items-center space-x-1 text-red-600">
          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
          <span>Lỗi lưu</span>
        </div>
      )}
    </div>
  );

  // ============================================
  // LOADING STATE
  // ============================================
  if (postLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (postError) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Không thể tải bài viết
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {postError instanceof Error ? postError.message : 'Có lỗi xảy ra khi tải dữ liệu bài viết'}
          </p>
          <div className="space-x-3">
            <Button
              onClick={() => refetchPost()}
              variant="outline"
              className="text-sm"
            >
              Thử lại
            </Button>
            <Button
              onClick={() => navigate('/dashboard/content')}
              variant="ghost"
              className="text-sm"
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN UI
  // ============================================
  return (
    <div className={`bg-gray-50 dark:bg-gray-900 ${focusMode ? 'focus-mode' : ''}`}>
      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFocusMode}
                className={`p-2 rounded-md transition-colors ${
                  focusMode 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Focus className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {focusMode ? 'Chế độ tập trung' : 'Chỉnh sửa bài viết'}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <WritingStats />
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <AutoSaveIndicator />
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/dashboard/content')}
                className="text-sm"
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="text-sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
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
              <Button
                type="submit"
                variant="secondary"
                onClick={() => {
                  setValue('status', 'DRAFT', { shouldValidate: true });
                  handleSubmit(onSubmit)();
                }}
                disabled={updatePostMutation.isPending}
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
                disabled={updatePostMutation.isPending}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Xuất bản
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className={`flex gap-6 transition-all duration-300 ${focusMode ? 'max-w-4xl mx-auto' : ''}`}>
          {/* Main Content */}
          <div className={`flex-1 ${focusMode ? 'max-w-4xl' : ''}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Input */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <input
                    {...register('title')}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0"
                  />
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500 dark:text-gray-400">
                        {titleCharCount}/200 ký tự
                      </span>
                      {errors.title && (
                        <span className="text-red-600 dark:text-red-400 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.title.message}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {wordCount} từ • ~{readingTimeMinutes} phút đọc
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-100 dark:border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nội dung bài viết
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({contentType === 'RICHTEXT' ? 'Rich Text' : 'Markdown'})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setValue('contentType', 'RICHTEXT', { shouldValidate: true })}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          contentType === 'RICHTEXT' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                      >
                        Rich Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('contentType', 'MARKDOWN', { shouldValidate: true })}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          contentType === 'MARKDOWN' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                      >
                        Markdown
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <EditorWrapper
                    contentType={contentType}
                    value={contentValue || ''}
                    onChange={handleContentChange}
                    placeholder={contentType === 'RICHTEXT' ? 'Viết nội dung bài viết...' : '# Tiêu đề\n\nViết nội dung bài viết bằng Markdown...'}
                  />
                  {errors.content && (
                    <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.content.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          {showSidebar && !focusMode && (
            <div className={`${sidebarCollapsed ? 'w-16' : 'w-96'} 
            space-y-6 sticky top-6 self-start transition-all duration-300`}>
              {sidebarCollapsed ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              ) : (
                <> 
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
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                        placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                      />
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">{excerptCharCount}/200 ký tự</span>
                        {errors.excerpt && (
                          <span className="text-red-600 dark:text-red-400">{errors.excerpt.message}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Settings */}
                  <Card>
                    <CardHeader className="pb-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ngày xuất bản
                        </label>
                        <input
                          type="datetime-local"
                          {...register('public_date')}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        {errors.public_date && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.public_date.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Danh mục
                        </label>
                        <select
                          {...register('categoryId')}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                    </CardContent>
                  </Card>

  

                  {/* Thumbnail Upload */}
                  <Card>
                    <CardHeader className="pb-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Thumbnai
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

                  {/* Writing Tips */}
                  <Card>
                    <CardHeader className="pb-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Mẹo viết
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        <p>• Sử dụng tiêu đề hấp dẫn để thu hút người đọc</p>
                        <p>• Viết tóm tắt ngắn gọn, súc tích</p>
                        <p>• Chia nhỏ nội dung thành các đoạn văn</p>
                        <p>• Sử dụng hình ảnh để minh họa</p>
                        <p>• Kiểm tra chính tả trước khi xuất bản</p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {submitError && (
        <div className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 max-w-md z-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Lỗi cập nhật bài viết</h4>
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
