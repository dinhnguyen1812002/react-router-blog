import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { ThemedCard, ThemedCardContent, ThemedCardHeader } from '~/components/ui/ThemedCard';
import { ThemedButton } from '~/components/ui/ThemedButton';
import { ThemedInput, ThemedTextarea } from '~/components/ui/ThemedInput';
import { ThemedBadge } from '~/components/ui/ThemedBadge';
import { postsApi } from '~/api/posts';
import { 
  Save, 
  Eye, 
  Upload, 
  X,
  Plus,
  Hash,
  FileText,
  Image,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardHeader, Button } from '~/components/ui';


export default function NewPostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    thumbnail: '',
    categories: [] as string[],
    tags: [] as string[],
    featured: false
  });
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // Create post mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => postsApi.createPost(data),
    onSuccess: (response) => {
      navigate(`/posts/${response.slug}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="theme-gradient-bg w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Viết bài mới
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Chia sẻ kiến thức và trải nghiệm của bạn
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ThemedButton 
              variant="outline" 
              onClick={() => navigate('/dashboard/my-posts')}
              icon={<X className="w-4 h-4" />}
            >
              Hủy
            </ThemedButton>
            <ThemedButton 
              variant="outline"
              icon={<Eye className="w-4 h-4" />}
            >
              Xem trước
            </ThemedButton>
            <ThemedButton 
              gradient
              onClick={handleSubmit}
              disabled={createMutation.isPending || !formData.title.trim()}
              loading={createMutation.isPending}
              icon={<Save className="w-4 h-4" />}
            >
              {createMutation.isPending ? 'Đang lưu...' : 'Xuất bản'}
            </ThemedButton>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card>
                <CardContent className="p-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tiêu đề bài viết *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardContent className="p-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tóm tắt
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardContent className="p-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nội dung bài viết *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Viết nội dung bài viết của bạn ở đây..."
                    rows={20}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Hỗ trợ Markdown. Sử dụng **bold**, *italic*, `code`, và nhiều định dạng khác.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-6">
              {/* Thumbnail */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Ảnh đại diện</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Tải ảnh lên
                    </Button>
                    {formData.thumbnail && (
                      <img
                        src={formData.thumbnail}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Danh mục</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Thêm danh mục..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                      />
                      <Button type="button" onClick={addCategory} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Tags</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Thêm tag..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Hash className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Options */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Tùy chọn</h3>
                </CardHeader>
                <CardContent>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Đánh dấu là bài viết nổi bật
                    </span>
                  </label>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {/* Error Display */}
        {createMutation.error && (
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="text-red-600 dark:text-red-400">
                Lỗi: {(createMutation.error as any)?.message || 'Không thể tạo bài viết'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
