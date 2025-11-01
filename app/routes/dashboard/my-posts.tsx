

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { userPostsApi } from "~/api/userPosts"
import { useAuthStore } from "~/store/authStore"
import {
  Search,
  Plus,
  BookOpen,
  Edit,
  Trash2,
  Calendar,
  Eye,
  MessageCircle,
  Tag,
  ChevronRight,
  Grid3x3,
  List,
} from "lucide-react"
import { formatDateSimple } from "~/lib/utils"
import { authorApi } from "~/api/author"
import { PostList } from "~/components/post/PostList"
import { ListView } from "~/components/post/ListView"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  })

  return debouncedValue
}

export default function MyPostsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const size = 6

  const debouncedSearch = useDebounce(searchTerm, 500)

  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-posts", page, debouncedSearch],
    queryFn: async () => {
      const response = await authorApi.getMyPosts(
        page,
        size,
        debouncedSearch || undefined,
        undefined,
        undefined,
        "desc",
      )
      return response
    },
    enabled: !!user,
    staleTime: 30000,
    placeholderData: (previousData) => previousData,
  })

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      return await userPostsApi.deletePost(postId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-posts"] })
      queryClient.invalidateQueries({ queryKey: ["user-stats"] })
      if (typeof window !== "undefined" && window.alert) {
        window.alert("Bài viết đã được xóa thành công!")
      }
    },
    onError: (error) => {
      if (typeof window !== "undefined" && window.alert) {
        window.alert(`Không thể xóa bài viết: ${error.message || "Lỗi không xác định"}`)
      }
    },
  })

  const handleDelete = async (postId: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) {
      return
    }
    try {
      await deleteMutation.mutateAsync(postId)
    } catch (error) {
      console.error("Delete operation failed:", error)
    }
  }

  const posts = postsData || []
  const hasNextPage = posts.length >= size

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8 md:py-12 px-4 md:px-0 mb-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance">Bài viết của tôi</h1>
              <p className="text-primary-foreground/90 text-lg">Quản lý và xuất bản những câu chuyện của bạn</p>
            </div>
            <Link to="/dashboard/posts/new" className="mt-2">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg dark:text-black">
                <Plus className="w-5 h-5 mr-2" />
                Viết bài mới
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-0 pb-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="relative max-w-2xl flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(0)
                }}
              />
            </div>
            <div className="flex gap-2 bg-muted/50 p-1 rounded-lg w-fit">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2"
              >
                <Grid3x3 className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Danh sách</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`bg-card rounded-lg overflow-hidden shadow-sm border border-border animate-pulse ${
                  viewMode === "list" ? "flex gap-4 p-4" : ""
                }`}
              >
                <div
                  className={viewMode === "grid" ? "h-40 w-full bg-muted" : "h-24 w-24 flex-shrink-0 bg-muted rounded"}
                />
                <div className={viewMode === "grid" ? "p-6 space-y-3 w-full" : "flex-1 space-y-2"}>
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            {viewMode === "grid" ? (
             <PostList  posts={posts}/>
            ) : (
              <ListView posts={posts}  />
            )}

            {!isLoading && posts.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-border">
                <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  Trước
                </Button>
                <span className="px-4 py-2 text-sm font-medium">Trang {page + 1}</span>
                <Button variant="outline" disabled={!hasNextPage} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-4 rounded-full bg-secondary mb-4">
              <BookOpen className="w-12 h-12 text-primary/60" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Chưa có bài viết nào</h3>
            <p className="text-muted-foreground mb-6">Bắt đầu viết bài đầu tiên để chia sẻ những suy nghĩ của bạn</p>
            <Link to="/dashboard/posts/new">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Viết bài mới
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
