import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { Input } from '~/components/ui/Input';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { postsApi } from '~/api/posts';
import { categoriesApi } from '~/api/categories';
import { tagsApi } from '~/api/tags';
import { useAuthStore } from '~/store/authStore';
import { Button } from '~/components/ui/button';
import { ImageUp, UploadCloud, X, Settings, Tag, Image, FileText, Save, Send } from 'lucide-react';
import { upload as uploadFile } from '~/api/uploads';
import EditorWrapper from '~/components/editors/EditorWrapper';

const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề không được quá 200 ký tự'),
  summary: z.string().max(500, 'Tóm tắt không được quá 500 ký tự').optional(),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
  tagUuids: z.array(z.string()).optional(),
  thumbnailUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  contentType: z.enum(['MARKDOWN', 'RICHTEXT']),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

type PostForm = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showConfirmUpload, setShowConfirmUpload] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  
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
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      navigate('/dashboard/content');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    },
  });

  const onSubmit = (data: PostForm) => {
    const postData = {
      ...data,
      tagUuids: selectedTags,
    };
    createPostMutation.mutate(postData);
  };

  const handleTagToggle = (tagUuid: string) => {
    setSelectedTags(prev =>
      prev.includes(tagUuid)
        ? prev.filter(uuid => uuid !== tagUuid)
        : [...prev, tagUuid]
    );
  };

  const uploadImageMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (url: string) => {
      setValue('thumbnailUrl', url);
      setShowConfirmUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadedImageUrl(url);
    },
    onError: (err) => {
      console.error('Upload failed', err);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleUploadConfirm = () => {
    if (selectedFile) {
      uploadImageMutation.mutate(selectedFile);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowConfirmUpload(false);
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImageUrl(null);
    setValue('thumbnailUrl', '');
  };

  const handleContentChange = (value: string) => {
    setValue('content', value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Lưu nháp
              </Button>
              <Button
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
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                    {...register('summary')}
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
                  {uploadedImageUrl ? (
                    <div className="space-y-3">
                      <img 
                        src={uploadedImageUrl} 
                        alt="Thumbnail" 
                        className="w-full h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600" 
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleRemoveUploadedImage}
                        className="w-full"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Xóa ảnh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center">
                          <UploadCloud className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">Upload ảnh</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                      
                      {selectedFile && (
                        <div className="space-y-2">
                          {previewUrl && (
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="w-full h-20 object-cover rounded-md border border-gray-300 dark:border-gray-600" 
                            />
                          )}
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => setShowConfirmUpload(true)}
                              disabled={uploadImageMutation.isPending}
                              className="flex-1"
                            >
                              <ImageUp className="w-4 h-4 mr-1" />
                              Upload
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={handleCancelUpload}
                              className="flex-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
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

      {/* Upload Confirmation Dialog */}
      {showConfirmUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận upload ảnh</h3>
            
            {previewUrl && (
              <div className="mb-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-auto max-h-48 object-contain rounded-md border border-gray-300 dark:border-gray-700" 
                />
              </div>
            )}
            
            <p className="mb-4 text-sm">Bạn có chắc chắn muốn upload ảnh này không?</p>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowConfirmUpload(false)}
              >
                Huỷ
              </Button>
              <Button
                type="button"
                onClick={handleUploadConfirm}
                disabled={uploadImageMutation.isPending}
              >
                {uploadImageMutation.isPending ? 'Đang upload...' : 'Xác nhận'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {createPostMutation.error && (
        <div className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md shadow-lg">
          Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.
        </div>
      )}
    </div>
  );
}