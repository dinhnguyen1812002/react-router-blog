import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
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

export default function CreatePostPage() {
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

  const categories = categoriesData?.data || [];
  const tags = tagsData?.data || [];

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: Partial<PostFormData>) => postsApi.createPost(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${response.data.slug}`);
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });

  // Auto-save mutation
  const autoSaveMutation = useMutation({
    mutationFn: (data: Partial<PostFormData>) => {
      // Save as draft to localStorage for now
      localStorage.setItem('post-draft', JSON.stringify(data));
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
        if (!prev.seoTitle) {
          newData.seoTitle = value;
        }
      }
      
      // Auto-generate SEO description from summary
      if (field === 'summary' && !prev.seoDescription) {
        newData.seoDescription = value;
      }

      return newData;
    });

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
  };

  // Handle tag selection
  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
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

  // Handle form submission
  const handleSubmit = (asDraft = false) => {
    const submitData = {
      ...formData,
      published: !asDraft && formData.published,
    };

    createPostMutation.mutate(submitData);
  };

  // Load draft from localStorage on mount
  useState(() => {
    const draft = localStorage.getItem('post-draft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Write and publish your blog post
          </p>
        </div>

        {/* Auto-save status */}
        <div className="flex items-center space-x-4">
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
              disabled={createPostMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            
            <Button
              onClick={() => handleSubmit(false)}
              disabled={createPostMutation.isPending || !formData.title || !formData.content}
            >
              {createPostMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Globe className="h-4 w-4 mr-2" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </div>

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
                  <span>By {user?.username}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString()}</span>
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
        </div>
      </div>
    </div>
  );
}
