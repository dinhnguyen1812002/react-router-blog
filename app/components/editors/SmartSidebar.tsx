import { useState, useEffect } from 'react';
import { 
  FileText, 
  Settings, 
  Image as ImageIcon, 
  Tag, 
  Lightbulb, 
  Target,
  BookOpen,
  Clock,
  Type,
  Palette,
  Zap,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  History,
  Save,
  Download,
  Upload,
  Eye,
  Focus,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  Calendar,
  Timer,
  Edit3,
  Copy,
  Trash2,
  Plus,
  Minus,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '~/components/ui/Card';
import { Button } from '~/components/ui/button';
import ThumbnailUpload from '~/components/ui/ThumbnailUpload';

interface SmartSidebarProps {
  // Form data
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  selectedTags: string[];
  thumbnailUrl: string;
  contentType: 'RICHTEXT' | 'MARKDOWN';
  publicDate: string;
  
  // Data
  categories: any[];
  tags: any[];
  
  // Handlers
  onTitleChange: (title: string) => void;
  onExcerptChange: (excerpt: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onTagToggle: (tagUuid: string) => void;
  onThumbnailChange: (url: string) => void;
  onThumbnailRemove: () => void;
  onContentTypeChange: (type: 'RICHTEXT' | 'MARKDOWN') => void;
  onPublicDateChange: (date: string) => void;
  
  // Stats
  wordCount: number;
  characterCount: number;
  readingTime: number;
  
  // UI State
  collapsed: boolean;
  onToggleCollapse: () => void;
  
  // Actions
  onSave: () => void;
  onPreview: () => void;
  onFocusMode: () => void;
  onExport: () => void;
  
  // Errors
  errors: any;
}

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  color = "text-gray-600 dark:text-gray-400" 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  color?: string;
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="flex items-center space-x-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </div>
    <span className={`text-sm font-semibold ${color}`}>{value}</span>
  </div>
);

const WritingTips = () => {
  const [currentTip, setCurrentTip] = useState(0);
  
  const tips = [
    "Sử dụng tiêu đề hấp dẫn để thu hút người đọc",
    "Viết tóm tắt ngắn gọn, súc tích trong 1-2 câu",
    "Chia nhỏ nội dung thành các đoạn văn dễ đọc",
    "Sử dụng hình ảnh để minh họa và làm nổi bật",
    "Kiểm tra chính tả và ngữ pháp trước khi xuất bản",
    "Sử dụng từ khóa phù hợp để tối ưu SEO",
    "Tạo cấu trúc rõ ràng với các tiêu đề phụ",
    "Viết nội dung có giá trị và hữu ích cho người đọc"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
          Mẹo viết
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {tips[currentTip]}
            </p>
          </div>
          <div className="flex space-x-1">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentTip ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ContentAnalysis = ({ 
  wordCount, 
  characterCount, 
  readingTime, 
  title, 
  excerpt, 
  content 
}: {
  wordCount: number;
  characterCount: number;
  readingTime: number;
  title: string;
  excerpt: string;
  content: string;
}) => {
  const getScore = (value: number, min: number, max: number) => {
    if (value < min) return { score: 'low', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' };
    if (value > max) return { score: 'high', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' };
    return { score: 'good', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' };
  };

  const titleScore = getScore(title.length, 30, 60);
  const excerptScore = getScore(excerpt.length, 50, 160);
  const contentScore = getScore(wordCount, 300, 2000);

  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
          Phân tích nội dung
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <StatCard
            icon={Type}
            label="Tiêu đề"
            value={`${title.length}/60 ký tự`}
            color={titleScore.color}
          />
          <StatCard
            icon={FileText}
            label="Tóm tắt"
            value={`${excerpt.length}/160 ký tự`}
            color={excerptScore.color}
          />
          <StatCard
            icon={BookOpen}
            label="Nội dung"
            value={`${wordCount} từ`}
            color={contentScore.color}
          />
          <StatCard
            icon={Clock}
            label="Thời gian đọc"
            value={`~${readingTime} phút`}
            color="text-gray-600 dark:text-gray-400"
          />
        </div>
        
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">Đánh giá SEO</h4>
          <div className="space-y-1">
            <div className={`p-2 rounded text-xs ${titleScore.bg}`}>
              <span className={titleScore.color}>
                Tiêu đề: {titleScore.score === 'good' ? 'Tốt' : titleScore.score === 'low' ? 'Quá ngắn' : 'Quá dài'}
              </span>
            </div>
            <div className={`p-2 rounded text-xs ${excerptScore.bg}`}>
              <span className={excerptScore.color}>
                Tóm tắt: {excerptScore.score === 'good' ? 'Tốt' : excerptScore.score === 'low' ? 'Quá ngắn' : 'Quá dài'}
              </span>
            </div>
            <div className={`p-2 rounded text-xs ${contentScore.bg}`}>
              <span className={contentScore.color}>
                Nội dung: {contentScore.score === 'good' ? 'Tốt' : contentScore.score === 'low' ? 'Quá ngắn' : 'Quá dài'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuickActions = ({ 
  onSave, 
  onPreview, 
  onFocusMode, 
  onExport 
}: {
  onSave: () => void;
  onPreview: () => void;
  onFocusMode: () => void;
  onExport: () => void;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
        <Zap className="w-4 h-4 mr-2 text-purple-500" />
        Thao tác nhanh
      </h3>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="text-xs"
        >
          <Save className="w-3 h-3 mr-1" />
          Lưu
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          className="text-xs"
        >
          <Eye className="w-3 h-3 mr-1" />
          Xem trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onFocusMode}
          className="text-xs"
        >
          <Focus className="w-3 h-3 mr-1" />
          Focus
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="text-xs"
        >
          <Download className="w-3 h-3 mr-1" />
          Xuất
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function SmartSidebar({
  title,
  excerpt,
  content,
  categoryId,
  selectedTags,
  thumbnailUrl,
  contentType,
  publicDate,
  categories,
  tags,
  onTitleChange,
  onExcerptChange,
  onCategoryChange,
  onTagToggle,
  onThumbnailChange,
  onThumbnailRemove,
  onContentTypeChange,
  onPublicDateChange,
  wordCount,
  characterCount,
  readingTime,
  collapsed,
  onToggleCollapse,
  onSave,
  onPreview,
  onFocusMode,
  onExport,
  errors
}: SmartSidebarProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'analysis'>('content');

  if (collapsed) {
    return (
      <div className="smart-sidebar collapsed w-16 space-y-4">
        <div className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('content')}
            className={`p-3 ${activeTab === 'content' ? 'bg-blue-100 dark:bg-blue-900/20' : ''}`}
            title="Nội dung"
          >
            <FileText className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('settings')}
            className={`p-3 ${activeTab === 'settings' ? 'bg-blue-100 dark:bg-blue-900/20' : ''}`}
            title="Cài đặt"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('analysis')}
            className={`p-3 ${activeTab === 'analysis' ? 'bg-blue-100 dark:bg-blue-900/20' : ''}`}
            title="Phân tích"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-3"
          title="Mở rộng"
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`smart-sidebar w-80 space-y-6 ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          <Button
            variant={activeTab === 'content' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('content')}
            className="text-xs"
          >
            Nội dung
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('settings')}
            className="text-xs"
          >
            Cài đặt
          </Button>
          <Button
            variant={activeTab === 'analysis' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('analysis')}
            className="text-xs"
          >
            Phân tích
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
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
                value={excerpt}
                onChange={(e) => onExcerptChange(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                placeholder="Viết tóm tắt ngắn gọn về bài viết..."
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">{excerpt.length}/160 ký tự</span>
                {errors.excerpt && (
                  <span className="text-red-600 dark:text-red-400">{errors.excerpt.message}</span>
                )}
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
                value={thumbnailUrl}
                onChange={onThumbnailChange}
                onRemove={onThumbnailRemove}
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
              <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => (
                  <button
                    key={tag.uuid}
                    type="button"
                    onClick={() => onTagToggle(tag.uuid)}
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
            </CardContent>
          </Card>

          <WritingTips />
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt bài viết
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ngày xuất bản
                </label>
                <input
                  type="datetime-local"
                  value={publicDate}
                  onChange={(e) => onPublicDateChange(e.target.value)}
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
                  value={categoryId}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loại nội dung
                </label>
                <div className="inline-flex rounded-md shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onContentTypeChange('RICHTEXT')}
                    className={`px-3 py-1.5 text-xs ${contentType === 'RICHTEXT' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >
                    Rich Text
                  </button>
                  <button
                    type="button"
                    onClick={() => onContentTypeChange('MARKDOWN')}
                    className={`px-3 py-1.5 text-xs border-l border-gray-300 dark:border-gray-700 ${contentType === 'MARKDOWN' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >
                    Markdown
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <QuickActions
            onSave={onSave}
            onPreview={onPreview}
            onFocusMode={onFocusMode}
            onExport={onExport}
          />
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <ContentAnalysis
            wordCount={wordCount}
            characterCount={characterCount}
            readingTime={readingTime}
            title={title}
            excerpt={excerpt}
            content={content}
          />
        </div>
      )}
    </div>
  );
}
