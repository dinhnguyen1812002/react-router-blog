import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Search, Plus, Eye, Edit2, Trash2, TrendingUp } from "lucide-react"
import { format } from "date-fns"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { DataTable } from "~/components/ui/data-table"
import { FeaturedToggle } from "~/components/admin/FeaturedToggle"
import { toast } from "sonner"

import { adminPostsApi, type AdminPostListItem } from "~/api/admin-posts"
import { resolveAvatarUrl } from "~/utils/image"

export default function ArticlesContent() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [featuredFilter, setFeaturedFilter] = useState<string>("all")

  const queryClient = useQueryClient()

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["admin-posts", page, size, search, categoryFilter, featuredFilter],
    queryFn: () =>
      adminPostsApi.getAdminPosts({
        page,
        size,
        search: search || undefined,
        categoryId: categoryFilter && categoryFilter !== "all" ? categoryFilter : undefined,
        featured: featuredFilter === "true" ? true : featuredFilter === "false" ? false : undefined,
      }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => adminPostsApi.getCategories(),
  })

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => adminPostsApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
      toast.success("Xóa bài viết thành công!")
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa bài viết!")
    },
  })

  const totalViews = postsData?.content?.reduce((sum, post) => sum + (post.viewCount || 0), 0) || 0
  const totalLikes = postsData?.content?.reduce((sum, post) => sum + (post.likeCount || 0), 0) || 0
  const publishedCount = postsData?.content?.filter((post) => post.is_publish).length || 0

  const columns: ColumnDef<AdminPostListItem>[] = [
    {
      accessorKey: "user",
      header: "Tác giả",
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={resolveAvatarUrl(user.avatar) || "/placeholder.svg"} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user.username}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Tiêu đề
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const post = row.original
        return (
          <div className="max-w-[300px]">
            <div className="font-semibold text-sm truncate">{post.title}</div>
            <div className="text-xs text-muted-foreground truncate">/{post.slug}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "categories",
      header: "Danh mục",
      cell: ({ row }) => {
        const categories = row.original.categories
        return categories && categories.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 2).map((category) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.category}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{categories.length - 2}
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Không có</span>
        )
      },
    },
   
    {
      accessorKey: "likeCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Thích
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="text-sm font-medium text-center">{row.original.likeCount}</div>
      },
    },
    {
      accessorKey: "viewCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Xem
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="text-sm font-medium text-center">{row.original.viewCount}</div>
      },
    },
    {
      accessorKey: "is_publish",
      header: "Trạng thái",
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.is_publish ? "outline" : "secondary"} className="text-xs">
            {row.original.is_publish ? "Published" : "Draft"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "featured",
      header: "Nổi bật",
      cell: ({ row }) => {
        const post = row.original
        return <FeaturedToggle postId={post.id} initialFeatured={post.featured} />
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            Ngày tạo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="text-xs">{format(new Date(row.original.createdAt), "dd/MM/yyyy")}</div>
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const post = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs font-semibold">Thao tác</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs">
                <Eye className="h-3 w-3 mr-2" />
                Xem bài viết
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs">
                <Edit2 className="h-3 w-3 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-xs text-destructive focus:text-destructive"
                onClick={() => {
                  if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
                    deletePostMutation.mutate(post.id)
                  }
                }}
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Quản lý bài viết</h1>
              <p className="text-sm text-muted-foreground mt-1">Quản lý tất cả bài viết trong hệ thống</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Bài viết mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Articles */}
            <div className="bg-card border border-border/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tổng bài viết</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{postsData?.totalElements || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>

            {/* Published */}
            <div className="bg-card border border-border/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Công khai</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{publishedCount}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Total Views */}
            <div className="bg-card border border-border/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tổng lượt xem</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalViews.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Likes */}
            <div className="bg-card border border-border/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tổng lượt thích</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalLikes.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-pink-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm bài viết theo tiêu đề hoặc slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categoriesData?.data?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc nổi bật" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="true">Nổi bật</SelectItem>
                  <SelectItem value="false">Không nổi bật</SelectItem>
                </SelectContent>
              </Select>

              <Select value={size.toString()} onValueChange={(value) => setSize(Number(value))}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 mục</SelectItem>
                  <SelectItem value="20">20 mục</SelectItem>
                  <SelectItem value="50">50 mục</SelectItem>
                  <SelectItem value="100">100 mục</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="bg-card border border-border/50 rounded-lg p-8">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-1/6 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-1/6 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-1/6 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
            <DataTable
              columns={columns}
              data={postsData?.content || []}
              searchKey="title"
              searchPlaceholder="Tìm kiếm theo tiêu đề..."
            />
          </div>
        )}

        {/* Pagination */}
        {postsData && !isLoading && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {postsData.content.length} trong {postsData.totalElements} bài viết
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                Trước
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Trang</span>
                <Select value={(page + 1).toString()} onValueChange={(value) => setPage(Number(value) - 1)}>
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: postsData.totalPages }, (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground">/ {postsData.totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(postsData.totalPages - 1, page + 1))}
                disabled={page >= postsData.totalPages - 1}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
