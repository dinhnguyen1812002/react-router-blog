import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authorApi, type CreateAuthorPostRequest } from '~/api/author';

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

export type PostForm = z.infer<typeof postSchema>;

interface UsePostEditorOptions {
  postId?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function usePostEditor({ postId, onSuccess, onError }: UsePostEditorOptions = {}) {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      contentType: 'RICHTEXT',
      status: 'DRAFT',
      public_date: new Date().toISOString().slice(0, 16),
    },
  });

  const { setValue, getValues, watch } = form;

  // Fetch post by ID for editing
  const { 
    data: post, 
    isLoading: postLoading, 
    error: postError, 
    refetch: refetchPost 
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) throw new Error('Post ID is required');
      console.log('[usePostEditor] Fetching post with ID:', postId);
      const response = await authorApi.getPostById(postId);
      console.log('[usePostEditor] Post data received:', response);
      return response; // Returns Post directly
    },
    enabled: !!postId,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Populate form when post loads
  useEffect(() => {
    if (!post) return;
    
    console.log('[usePostEditor] Populating form with post data:', post);
    
    // Populate form fields
    setValue('title', post.title || '');
    setValue('excerpt', post.summary || post.excerpt || '');
    setValue('summary', post.summary || '');
    setValue('content', post.content || '');
    
    // Set category (first category if exists)
    if (post.categories && post.categories.length > 0) {
      setValue('categoryId', String(post.categories[0].id));
    }
    
    // Set thumbnail
    setValue('thumbnailUrl', post.thumbnail || post.thumbnailUrl || '');
    
    // Set content type
    setValue('contentType', post.contentType || 'RICHTEXT');
    
    // Set status
    setValue('status', post.is_publish ? 'PUBLISHED' : 'DRAFT');
    
    // Set publish date
    if (post.public_date) {
      const dateStr = String(post.public_date).slice(0, 16);
      setValue('public_date', dateStr);
    }
    
    // Set tags
    const tagUuids = post.tags?.map((t: any) => t.uuid) || [];
    setSelectedTags(tagUuids);
    
    console.log('[usePostEditor] Form populated successfully');
  }, [post, setValue]);

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: authorApi.createPost,
    onSuccess: () => {
      console.log('[usePostEditor] Post created successfully');
      onSuccess?.();
      navigate('/dashboard/content');
    },
    onError: (error: any) => {
      console.error('[usePostEditor] Error creating post:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo bài viết';
      setSubmitError(errorMessage);
      onError?.(error);
    },
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (data: PostForm) => {
      if (!postId) {
        throw new Error('Không tìm thấy ID bài viết');
      }
      
      console.log('[usePostEditor] Updating post with ID:', postId);
      console.log('[usePostEditor] Form data:', data);
      console.log('[usePostEditor] Selected tags:', selectedTags);
      
      const payload: CreateAuthorPostRequest = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        thumbnail: data.thumbnailUrl || undefined,
        categories: [String(data.categoryId)], // Convert to string array
        tags: selectedTags, // Already string array
        featured: false, // Default value
        public_date: data.public_date || undefined,
      };
      
      console.log('[usePostEditor] Update payload:', payload);
      
      const response = await authorApi.updatePost(String(postId), payload);
      console.log('[usePostEditor] Update response:', response);
      
      return response;
    },
    onSuccess: (response) => {
      console.log('[usePostEditor] Post updated successfully:', response);
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      onSuccess?.();
      
      // Show success notification
      showToast('Cập nhật bài viết thành công!', 'success');
      
      setTimeout(() => {
        navigate('/dashboard/content');
      }, 2000);
    },
    onError: (error: any) => {
      console.error('[usePostEditor] Error updating post:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật bài viết';
      setSubmitError(errorMessage);
      setAutoSaveStatus('error');
      onError?.(error);
    },
  });

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    const contentValue = watch('content');
    const titleValue = watch('title');
    
    if (!contentValue || !titleValue || !postId) return;
    
    console.log('[usePostEditor] Auto-saving...');
    setAutoSaveStatus('saving');
    
    try {
      const formData = getValues();
      const payload: CreateAuthorPostRequest = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        thumbnail: formData.thumbnailUrl || undefined,
        categories: [String(formData.categoryId)],
        tags: selectedTags,
        featured: false,
        public_date: formData.public_date || undefined,
      };
      
      await authorApi.updatePost(String(postId), payload);
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      console.log('[usePostEditor] Auto-save successful');
    } catch (error) {
      console.error('[usePostEditor] Auto-save error:', error);
      setAutoSaveStatus('error');
    }
  }, [postId, getValues, selectedTags, watch]);

  // Manual save
  const manualSave = async () => {
    if (!postId) {
      showToast('Chưa có ID bài viết để lưu', 'error');
      return;
    }
    
    console.log('[usePostEditor] Manual save triggered');
    setAutoSaveStatus('saving');
    
    try {
      const formData = getValues();
      
      // Validate required fields
      if (!formData.title || !formData.content || !formData.categoryId) {
        showToast('Vui lòng điền đầy đủ tiêu đề, nội dung và danh mục', 'error');
        setAutoSaveStatus('error');
        return;
      }
      
      const payload: CreateAuthorPostRequest = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        thumbnail: formData.thumbnailUrl || undefined,
        categories: [String(formData.categoryId)],
        tags: selectedTags,
        featured: false,
        public_date: formData.public_date || undefined,
      };
      
      console.log('[usePostEditor] Saving post manually:', payload);
      
      await authorApi.updatePost(String(postId), payload);
      
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      
      showToast('Đã lưu bài viết!', 'success');
      
      console.log('[usePostEditor] Post saved successfully');
    } catch (error: any) {
      console.error('[usePostEditor] Save error:', error);
      setAutoSaveStatus('error');
      
      const errorMsg = error.response?.data?.message || error.message || 'Lỗi khi lưu bài viết';
      showToast(errorMsg, 'error');
    }
  };

  // Submit handler
  const onSubmit = (data: PostForm) => {
    console.log('[usePostEditor] Form submitted:', data);
    setSubmitError(null);
    
    if (postId) {
      // Update existing post
      console.log('[usePostEditor] Updating existing post...');
      updatePostMutation.mutate(data);
    } else {
      // Create new post
      console.log('[usePostEditor] Creating new post...');
      const payload: CreateAuthorPostRequest = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        thumbnail: data.thumbnailUrl || undefined,
        categories: [String(data.categoryId)],
        tags: selectedTags,
        featured: false,
        public_date: data.public_date ? new Date(data.public_date).toISOString() : undefined,
      };
      createPostMutation.mutate(payload);
    }
  };

  return {
    // Form
    form,
    
    // Tags
    selectedTags,
    setSelectedTags,
    
    // States
    submitError,
    setSubmitError,
    autoSaveStatus,
    lastSaved,
    
    // Post data
    post,
    postLoading,
    postError,
    refetchPost,
    
    // Mutations
    createPostMutation,
    updatePostMutation,
    
    // Actions
    onSubmit,
    autoSave,
    manualSave,
  };
}

// Helper function to show toast notifications
function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  const bgColor = type === 'success' 
    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  const textColor = type === 'success' 
    ? 'text-green-800 dark:text-green-200' 
    : 'text-red-800 dark:text-red-200';
  const dotColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  
  toast.className = `fixed top-4 right-4 ${bgColor} border rounded-lg shadow-lg p-4 max-w-sm z-50`;
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <div class="w-2 h-2 ${dotColor} rounded-full"></div>
      <span class="text-sm ${textColor}">${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
