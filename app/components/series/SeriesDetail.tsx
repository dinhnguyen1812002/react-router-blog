import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Button } from "~/components/ui/button";
import { formatDateSimple } from "~/lib/utils";
import {
  BookOpen,
  User,
  Calendar,
  FileText,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  GripVertical,
} from "lucide-react";
import type { Series } from "~/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface SeriesDetailProps {
  series: Series;
  showActions?: boolean;
  onEdit?: (series: Series) => void;
  onDelete?: (series: Series) => void;
  onAddPost?: (series: Series) => void;
  onReorderPosts?: (postIds: string[]) => void;
}

export const SeriesDetail = ({ 
  series, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onAddPost,
  onReorderPosts 
}: SeriesDetailProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/series">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
      </div>

      {/* Series Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {series.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {series.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Tác giả: {series.username || series.author?.username || "Unknown"}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{series.posts?.length || 0} bài viết</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Tạo lúc: {formatDateSimple(series.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Quản lý
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(series)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa series
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddPost?.(series)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm bài viết
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(series)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa series
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Danh sách bài viết ({series.posts?.length || 0})
            </h2>
            {showActions && (
              <Button size="sm" onClick={() => onAddPost?.(series)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm bài viết
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {!series.posts || series.posts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chưa có bài viết nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Hãy thêm bài viết đầu tiên vào series này.
              </p>
              {showActions && (
                <Button onClick={() => onAddPost?.(series)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm bài viết
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {series.posts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {showActions && onReorderPosts && (
                    <div className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <GripVertical className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <Link
                      to={`/posts/${post.slug}`}
                      className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                    </Link>
                  </div>
                  
                  {showActions && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Remove post from series logic would go here
                        console.log("Remove post:", post.id);
                      }}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
