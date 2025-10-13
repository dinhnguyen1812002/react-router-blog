import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Loader2, Search, Check, X } from "lucide-react";
import { postsApi } from "~/api/posts";
import type { Post, Series } from "~/types";

interface AddPostToSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  series: Series | null;
  onAddPost: (postId: string) => Promise<void>;
  loading?: boolean;
}

export const AddPostToSeriesModal = ({ 
  isOpen, 
  onClose, 
  series, 
  onAddPost,
  loading = false 
}: AddPostToSeriesModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user's posts for selection
  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["user-posts", searchTerm],
    queryFn: () => postsApi.getPosts(0, 50, { search: searchTerm }),
    enabled: isOpen,
  });

  // Filter out posts that are already in the series
  const availablePosts = userPosts?.content?.filter(
    (post) => !series?.posts?.some((seriesPost) => seriesPost.id === post.id)
  ) || [];

  const handlePostSelect = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSubmit = async () => {
    if (selectedPosts.length === 0) return;

    try {
      setIsSubmitting(true);
      for (const postId of selectedPosts) {
        await onAddPost(postId);
      }
      setSelectedPosts([]);
      onClose();
    } catch (error) {
      console.error("Error adding posts to series:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedPosts([]);
    setSearchTerm("");
    onClose();
  };

  // Reset selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPosts([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 gap-0 overflow-hidden bg-white dark:bg-black border-0 shadow-2xl">
        {/* Header with gradient */}
        <div className="relative px-8 py-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border-b border-gray-100 dark:border-gray-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Thêm bài viết vào series
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                {series?.title}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
            </button>
          </div>

          {/* Search Bar - Integrated in header */}
          <div className="relative mt-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" strokeWidth={2} />
            <Input
              placeholder="Tìm kiếm theo tên bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all"
            />
          </div>
        </div>

        {/* Posts List with better spacing */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white dark:bg-black min-h-[400px] max-h-[500px]">
          {isLoadingPosts ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-800"></div>
                <Loader2 className="w-12 h-12 absolute inset-0 animate-spin text-gray-900 dark:text-white" strokeWidth={2} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium">
                Đang tải bài viết...
              </p>
            </div>
          ) : availablePosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-gray-400 dark:text-gray-600" strokeWidth={2} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {searchTerm ? "Không tìm thấy bài viết phù hợp" : "Không có bài viết nào để thêm"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Tất cả bài viết đã được thêm vào series"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availablePosts.map((post, index) => {
                const isSelected = selectedPosts.includes(post.id);
                
                return (
                  <button
                    key={post.id}
                    onClick={() => handlePostSelect(post.id)}
                    className={`group w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900 shadow-sm"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Custom Checkbox */}
                      <div className={`relative w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                        isSelected 
                          ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white scale-110" 
                          : "border-gray-300 dark:border-gray-700 group-hover:border-gray-400 dark:group-hover:border-gray-600"
                      }`}>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-white dark:text-black" strokeWidth={3} />
                        )}
                      </div>

                      {/* Post Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-relaxed">
                          {post.title}
                        </h4>
                        {post.excerpt && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            {/* Selected Count with badge */}
            <div className="flex items-center gap-3">
              {selectedPosts.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white rounded-full">
                    <span className="text-xs font-bold text-white dark:text-black">
                      {selectedPosts.length}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    bài viết đã chọn
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  Chọn bài viết để thêm vào series
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-medium border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg transition-all"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedPosts.length === 0 || isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" strokeWidth={2.5} />
                    Đang thêm...
                  </>
                ) : (
                  <>Thêm vào series</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};