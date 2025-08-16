import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { postsApi } from "~/api/posts";
import { categoriesApi } from "~/api/categories";
import { tagsApi } from "~/api/tags";
import { uploadsApi } from "~/api/uploads";
import { useAuthStore } from "~/store/authStore";
import { generateSlug } from "~/lib/utils";
import {
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  FileText,
  Tag as TagIcon,
  Folder,
  Globe,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  History,
  ArrowLeft,
  Trash2,
} from "lucide-react";

interface PostFormData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  contentType: "RICHTEXT" | "MARKDOWN";
  thumbnail: string;
  featured: boolean;
  published: boolean;
  categoryIds: number[];
  tagIds: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    slug: "",
    summary: "",
    content: "",
    contentType: "RICHTEXT",
    thumbnail: "",
    featured: false,
    published: false,
    categoryIds: [],
    tagIds: [],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [newTag, setNewTag] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<PostFormData | null>(null);

  // Fetch post data
  const {
    data: postResponse,
    isLoading: isLoadingPost,
    error: postError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postsApi.getPostBySlug(id!),
    enabled: !!id,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getCategories(),
  });

  // Fetch tags
  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => tagsApi.getTags(),
  });

  const post = postResponse?.data;
  const categories = categoriesData?.data || [];
  const tags = tagsData?.data || [];

  // Check if user can edit this post
  const canEdit = user?.id === post?.user?.id || user?.roles?.includes('ADMIN');

  // Load post data into form
  useEffect(() => {
    if (post) {
      const postFormData: PostFormData = {
        title: post.title,
        slug: post.slug,
        summary: post.summary || "",
        content: post.content,
        contentType: post.contentType || "RICHTEXT",
        thumbnail: post.thumbnail || post.thumbnailUrl || "",
        featured: post.featured,
        published: post.published || false,
        categoryIds: post.categories?.map(c => c.id) || [],
        tagIds: post.tags?.map(t => t.uuid) || [],
        seoTitle: post.seoTitle || post.title,
        seoDescription: post.seoDescription || post.summary || "",
        seoKeywords: post.seoKeywords || "",
      };
      
      setFormData(postFormData);
      setOriginalData(postFormData);
    }
  }, [post]);

  // Enhanced Update post mutation following author.ts patterns
  const updatePostMutation = useMutation({
    mutationFn: async (data: Partial<PostFormData>) => {
      console.log('📝 Starting update operation for post:', { postId: post?.id, data });

      // Validate required fields
      if (!data.title?.trim()) {
        throw new Error('Title is required');
      }
      if (!data.content?.trim()) {
        throw new Error('Content is required');
      }

      return await postsApi.updatePost(Number(post?.id), data);
    },
    onSuccess: (response, variables) => {
      console.log('✅ Post updated successfully:', { response, variables });

      // Invalidate multiple related queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["featured-posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });

      // Reset change tracking
      setHasChanges(false);

      // Show success notification
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Bài viết đã được cập nhật thành công!');
      }

      // Navigate to the updated post
      if (response?.data?.slug) {
        navigate(`/posts/${response.data.slug}`);
      } else {
        navigate("/dashboard/my-posts");
      }
    },
    onError: (error, variables) => {
      console.error('❌ Update post failed:', { error, variables });

      // Show error notification with specific message
      const errorMessage = error.message || 'Không thể cập nhật bài viết';
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(`Lỗi cập nhật: ${errorMessage}`);
      }
    },
  });

  // Enhanced Delete post mutation following author.ts patterns
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      console.log('🗑️ Starting delete operation for post:', post?.id);

      if (!post?.id) {
        throw new Error('Post ID is required for deletion');
      }

      return await postsApi.deletePost(Number(post.id));
    },
    onSuccess: (data) => {
      console.log('✅ Post deleted successfully:', { postId: post?.id, data });

      // Invalidate multiple related queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["featured-posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });

      // Show success notification
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Bài viết đã được xóa thành công!');
      }

      // Navigate back to posts list
      navigate("/dashboard/my-posts");
    },
    onError: (error) => {
      console.error('❌ Delete post failed:', { postId: post?.id, error });

      // Show error notification
      const errorMessage = error.message || 'Không thể xóa bài viết';
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(`Lỗi xóa bài viết: ${errorMessage}`);
      }
    },
  });

  // Auto-save mutation
  const autoSaveMutation = useMutation({
    mutationFn: (data: Partial<PostFormData>) => {
      // Save as draft to localStorage for now
      localStorage.setItem(`post-draft-${id}`, JSON.stringify(data));
      return Promise.resolve(data);
    },
    onMutate: () => {
      setAutoSaveStatus('saving');
    },
    onSuccess: () => {
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    },
    onError: () => {
      setAutoSaveStatus('error');
    },
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadsApi.uploadImage(file),
    onSuccess: (response) => {
      setFormData(prev => ({ ...prev, thumbnail: response.data.url }));
      setUploadingImage(false);
      setHasChanges(true);
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      setUploadingImage(false);
    },
  });

  // Handle form changes
  const handleInputChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generate slug from title
      if (field === 'title') {
        newData.slug = generateSlug(value);
        // Auto-generate SEO title if not manually set
        if (!prev.seoTitle || prev.seoTitle === prev.title) {
          newData.seoTitle = value;
        }
      }
      
      // Auto-generate SEO description from summary
      if (field === 'summary' && (!prev.seoDescription || prev.seoDescription === prev.summary)) {
        newData.seoDescription = value;
      }

      return newData;
    });

    setHasChanges(true);

    // Trigger auto-save after 2 seconds of inactivity
    setTimeout(() => {
      autoSaveMutation.mutate(formData);
    }, 2000);
  };

  // Handle category selection
  const handleCategoryToggle = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
    setHasChanges(true);
  };

  // Handle tag selection
  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
    setHasChanges(true);
  };

  // Handle new tag creation
  const handleCreateTag = () => {
    if (newTag.trim()) {
      // TODO: Implement tag creation API
      console.log("Create new tag:", newTag);
      setNewTag("");
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      uploadImageMutation.mutate(file);
    }
  };

  // Enhanced form submission handler following author.ts patterns
  const handleSubmit = (asDraft = false) => {
    // Client-side validation
    if (!formData.title?.trim()) {
      window.alert('Please enter a post title');
      return;
    }

    if (!formData.content?.trim()) {
      window.alert('Please enter post content');
      return;
    }

    const submitData = {
      ...formData,
      published: !asDraft && formData.published,
    };

    console.log('📝 Submitting post update:', {
      postId: post?.id,
      asDraft,
      published: submitData.published,
      title: submitData.title
    });

    updatePostMutation.mutate(submitData);
  };

  // Enhanced delete handler following author.ts patterns
  const handleDelete = () => {
    if (!post) {
      window.alert('Post not found');
      return;
    }

    const confirmMessage = `Are you sure you want to delete "${post.title}"?\n\nThis action cannot be undone and will permanently remove:
    • The post content
    • All comments and interactions
    • View statistics
    • Any bookmarks by other users`;

    if (window.confirm(confirmMessage)) {
      console.log('🗑️ User confirmed deletion for post:', {
        id: post.id,
        title: post.title,
        slug: post.slug
      });
      deletePostMutation.mutate();
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    if (originalData) {
      setFormData(originalData);
      setHasChanges(false);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Post not found or you don't have permission to edit it.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to edit this post.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button onClick={() => navigate(`/posts/${post.slug}`)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            View Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Post
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Editing: {post.title}
          </p>
        </div>

        {/* Auto-save status and actions */}
        <div className="flex items-center space-x-4">
          {/* Changes indicator */}
          {hasChanges && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-orange-600 dark:text-orange-400">
                Unsaved changes
              </span>
            </div>
          )}

          {/* Auto-save status */}
          <div className="flex items-center space-x-2 text-sm">
            {autoSaveStatus === 'saving' && (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-blue-500">Saving...</span>
              </>
            )}
            {autoSaveStatus === 'saved' && (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Saved</span>
              </>
            )}
            {autoSaveStatus === 'error' && (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Error saving</span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {hasChanges && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDiscardChanges}
              >
                Discard Changes
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={updatePostMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            
            <Button
              onClick={() => handleSubmit(false)}
              disabled={updatePostMutation.isPending || !formData.title || !formData.content}
            >
              {updatePostMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Globe className="h-4 w-4 mr-2" />
              )}
              Update & Publish
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Change tracking alert */}
      {hasChanges && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your work!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {!showPreview ? (
            <>
              {/* Basic Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Basic Information</span>
                </h2>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter post title..."
                      className="mt-1"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="post-url-slug"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      URL: /posts/{formData.slug || 'post-url-slug'}
                    </p>
                  </div>

                  {/* Summary */}
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      placeholder="Brief description of your post..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5" />
                  <span>Featured Image</span>
                </h2>

                <div className="space-y-4">
                  {formData.thumbnail ? (
                    <div className="relative">
                      <img
                        src={formData.thumbnail}
                        alt="Featured image"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleInputChange('thumbnail', '')}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      {uploadingImage ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                          <span className="text-blue-500">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Click to upload featured image
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div>
                    <Label htmlFor="thumbnail-url">Or enter image URL</Label>
                    <Input
                      id="thumbnail-url"
                      value={formData.thumbnail}
                      onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Content *
                </h2>

                {/* Content Type Toggle */}
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => handleInputChange('contentType', 'RICHTEXT')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      formData.contentType === 'RICHTEXT'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    Rich Text
                  </button>
                  <button
                    onClick={() => handleInputChange('contentType', 'MARKDOWN')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      formData.contentType === 'MARKDOWN'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    Markdown
                  </button>
                </div>

                {/* Content Editor */}
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder={
                    formData.contentType === 'MARKDOWN'
                      ? "Write your post content in Markdown..."
                      : "Write your post content..."
                  }
                  rows={20}
                  className="font-mono"
                />
              </div>
            </>
          ) : (
            /* Preview Mode */
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Preview
              </h2>

              {/* Preview Header */}
              <div className="mb-6">
                {formData.thumbnail && (
                  <img
                    src={formData.thumbnail}
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {formData.title || 'Untitled Post'}
                </h1>

                {formData.summary && (
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                    {formData.summary}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>By {post.user.username}</span>
                  <span>•</span>
                  <span>Updated {new Date().toLocaleDateString()}</span>
                  {formData.featured && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary">Featured</Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Preview Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {formData.contentType === 'MARKDOWN' ? (
                  <pre className="whitespace-pre-wrap">{formData.content}</pre>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Post Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Post Status
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                <span className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              {post.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Updated:</span>
                  <span className="text-sm">{new Date(post.updatedAt).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Views:</span>
                <span className="text-sm">{post.viewCount || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Likes:</span>
                <span className="text-sm">{post.likeCount || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Comments:</span>
                <span className="text-sm">{post.commentCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Publish Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Publish Settings
            </h3>

            <div className="space-y-4">
              {/* Featured Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Featured Post</Label>
                  <p className="text-sm text-gray-500">
                    Show in featured section
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="published">Publish Immediately</Label>
                  <p className="text-sm text-gray-500">
                    Make post public
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleInputChange('published', checked)}
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>Categories</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="rounded border-gray-300"
                  />
                  <span
                    className="px-2 py-1 rounded text-sm text-white"
                    style={{ backgroundColor: category.backgroundColor }}
                  >
                    {category.category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <TagIcon className="h-5 w-5" />
              <span>Tags</span>
            </h3>

            {/* Add new tag */}
            <div className="flex space-x-2 mb-4">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
              />
              <Button
                size="sm"
                onClick={handleCreateTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected tags */}
            {formData.tagIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tagIds.map((tagId) => {
                  const tag = tags.find(t => t.uuid === tagId);
                  return tag ? (
                    <Badge
                      key={tagId}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tagId)}
                    >
                      {tag.name}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}

            {/* Available tags */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tags
                .filter(tag => !formData.tagIds.includes(tag.uuid))
                .map((tag) => (
                  <button
                    key={tag.uuid}
                    onClick={() => handleTagToggle(tag.uuid)}
                    className="block w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    style={{ color: tag.color }}
                  >
                    #{tag.name}
                  </button>
                ))}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              SEO Settings
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="seo-title">SEO Title</Label>
                <Input
                  id="seo-title"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="SEO optimized title..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="seo-description">SEO Description</Label>
                <Textarea
                  id="seo-description"
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="SEO meta description..."
                  rows={3}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seoDescription.length}/160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="seo-keywords">Keywords</Label>
                <Input
                  id="seo-keywords"
                  value={formData.seoKeywords}
                  onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Version History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Version History</span>
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current version</span>
                <span className="text-green-600 dark:text-green-400">v1.0</span>
              </div>
              <p className="text-xs text-gray-500">
                Version history and revision tracking coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
