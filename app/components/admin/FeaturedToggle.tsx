import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Star, Loader2 } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "~/lib/utils"
import { adminPostsApi } from "~/api/admin-posts"

const featuredToggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-amber-50 text-amber-900 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 shadow-xs",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      },
      size: {
        sm: "h-8 px-3 gap-1.5",
        default: "h-9 px-4 py-2 gap-2",
        lg: "h-10 px-6 gap-2.5",
      },
      state: {
        featured:
          "data-[featured=true]:bg-gradient-to-r data-[featured=true]:from-amber-500 data-[featured=true]:to-amber-600 data-[featured=true]:text-white data-[featured=true]:border-amber-600 data-[featured=true]:shadow-md data-[featured=true]:dark:from-amber-600 data-[featured=true]:dark:to-amber-700",
        inactive: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "inactive",
    },
  },
)

interface FeaturedToggleProps {
  postId: string
  initialFeatured: boolean
  disabled?: boolean
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
  showLabel?: boolean
  className?: string
}

export function FeaturedToggle({
  postId,
  initialFeatured,
  disabled = false,
  size = "default",
  variant = "default",
  showLabel = true,
  className,
}: FeaturedToggleProps) {
  const [featured, setFeatured] = useState(initialFeatured)
  const queryClient = useQueryClient()

  useEffect(() => {
    setFeatured(initialFeatured)
  }, [initialFeatured])

  const updateFeaturedMutation = useMutation({
    mutationFn: () => adminPostsApi.updatePostFeatured(postId),
    onSuccess: () => {
      const newFeatured = !featured
      setFeatured(newFeatured)
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
      toast.success(newFeatured ? "Bài viết đã được đánh dấu nổi bật" : "Đã bỏ đánh dấu nổi bật", {
        description: `Trạng thái đã được cập nhật thành công`,
      })
    },
    onError: (error: any) => {
      setFeatured(initialFeatured)
      toast.error("Không thể cập nhật trạng thái nổi bật", {
        description: error?.response?.data?.message || "Vui lòng thử lại sau",
      })
    },
  })

  const handleToggle = () => {
    if (disabled || updateFeaturedMutation.isPending) return
    setFeatured(!featured)
    updateFeaturedMutation.mutate()
  }

  const isPending = updateFeaturedMutation.isPending

  return (
    <button
      data-slot="featured-toggle"
      data-featured={featured}
      onClick={handleToggle}
      disabled={disabled || isPending}
      className={cn(
        featuredToggleVariants({
          variant,
          size,
          state: featured ? "featured" : "inactive",
        }),
        className,
      )}
    >
      {featured && <Star className="h-4 w-4 fill-current shrink-0" />}
      {showLabel && <span className="font-medium">{featured ? "Nổi bật" : "Thêm nổi bật"}</span>}
      {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin ml-auto" />}
    </button>
  )
}

export { featuredToggleVariants }
