import type React from "react"
import { useState, useEffect } from "react"
import { Calendar, Tag, FolderOpen, X, Check, ChevronsUpDown, AlertCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { cn } from "~/lib/utils"
import { Input } from "../ui/Input"
import { Textarea } from "~/components/ui/textarea"
import ThumbnailUpload from "~/components/ui/ThumbnailUpload"
import type { Post, Category, Tag as TagType } from "~/types"
import { categoriesApi } from "~/api/categories"
import { tagsApi } from "~/api/tags"
import { Calendar24 } from "./data-time"

interface SavePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (metadata: {
    title: string
    excerpt: string
    content: string
    category: number
    tags: string[]
    thumbnail?: string
    publishDate?: string
    isPublish: boolean
  }) => void
  existingPost?: Post
  isLoading?: boolean
  content?: string
}

export function SavePostDialog({
  open,
  onOpenChange,
  onSave,
  existingPost,
  isLoading = false,
  content = ""
}: SavePostDialogProps) {
  // Form state
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [date, setDate] = useState("")
  const [thumbnail, setThumbnail] = useState<string>("")
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false)
  const [isPublish, setIsPublish] = useState(false)

  // Validation state
  const [errors, setErrors] = useState<{
    title?: string;
    excerpt?: string;
    category?: string;
    thumbnail?: string;
  }>({})

  // Fetch categories and tags from API
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  })

  const { data: availableTags = [], isLoading: isLoadingTags } = useQuery<TagType[]>({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
  })

  // Load existing post data if editing
  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title || "")
      setExcerpt(existingPost.excerpt || existingPost.summary || "")
      setCategory(existingPost.categories?.[0]?.id?.toString() || "")
      setTags(existingPost.tags?.map(t => t.uuid) || [])
      setThumbnail(existingPost.thumbnail || existingPost.thumbnailUrl || "")
      setIsPublish(existingPost.is_publish || false)

      // Set publish date if available
      if (existingPost.public_date) {
        const dateObj = new Date(existingPost.public_date)
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        const hours = String(dateObj.getHours()).padStart(2, '0')
        const minutes = String(dateObj.getMinutes()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}T${hours}:${minutes}:00`
        setDate(dateStr)
      }
    }
  }, [existingPost])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setErrors({})
    }
  }, [open])

  // Tag handlers
  const handleAddTag = (tagUuid: string) => {
    if (!tags.includes(tagUuid)) {
      setTags([...tags, tagUuid])
    }
  }

  const handleRemoveTag = (tagUuidToRemove: string) => {
    setTags(tags.filter((tagUuid) => tagUuid !== tagUuidToRemove))
  }

  // Thumbnail handlers
  const handleThumbnailChange = (url: string) => {
    setThumbnail(url)
    setErrors(prev => ({ ...prev, thumbnail: undefined }))
  }

  const handleThumbnailRemove = () => {
    setThumbnail("")
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc"
    } else if (title.trim().length < 5) {
      newErrors.title = "Tiêu đề phải có ít nhất 5 ký tự"
    } else if (title.trim().length > 200) {
      newErrors.title = "Tiêu đề không được quá 200 ký tự"
    }

    if (!excerpt.trim()) {
      newErrors.excerpt = "Tóm tắt là bắt buộc"
    } else if (excerpt.trim().length < 10) {
      newErrors.excerpt = "Tóm tắt phải có ít nhất 10 ký tự"
    } else if (excerpt.trim().length > 500) {
      newErrors.excerpt = "Tóm tắt không được quá 500 ký tự"
    }

    if (!category) {
      newErrors.category = "Vui lòng chọn danh mục"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save handler with validation
  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    if (onSave) {
      onSave({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content,
        category: parseInt(category),
        tags,
        thumbnail: thumbnail || undefined,
        publishDate: date || undefined,
        isPublish
      })
    }
    onOpenChange(false)
  }


  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
          onClick={() => onOpenChange(false)} 
        />
        
        {/* Modal Container */}
        <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Lưu bài viết</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                  Thêm thông tin metadata cho bài viết trước khi lưu
                </p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 flex-shrink-0"
                disabled={isLoading}
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 sm:px-8 py-6 space-y-8">
              {/* Section 1: Basic Information */}
              <section className="space-y-5">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Thông tin cơ bản
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                    Tiêu đề và mô tả ngắn gọn về bài viết
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Title - Full width on mobile, 2/3 on desktop */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-1">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value)
                        setErrors(prev => ({ ...prev, title: undefined }))
                      }}
                      placeholder="Nhập tiêu đề bài viết"
                      className={cn(
                        "text-lg h-12",
                        errors.title && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    {errors.title && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail - 1/3 on desktop */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground dark:text-white">
                      Ảnh đại diện
                    </label>
                    <ThumbnailUpload
                      value={thumbnail}
                      onChange={handleThumbnailChange}
                      onRemove={handleThumbnailRemove}
                      maxSize={10}
                      allowedTypes={['image/jpeg', 'image/png', 'image/jpg','image/gif', 'image/webp']}
                    />
                    {errors.thumbnail && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.thumbnail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Excerpt - Full width */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-1">
                    Tóm tắt <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => {
                      setExcerpt(e.target.value)
                      setErrors(prev => ({ ...prev, excerpt: undefined }))
                    }}
                    placeholder="Nhập tóm tắt ngắn gọn về bài viết (10-500 ký tự)"
                    rows={4}
                    className={cn(
                      "resize-none",
                      errors.excerpt && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      {errors.excerpt && (
                        <div className="flex items-center gap-2 text-sm text-red-500">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.excerpt}</span>
                        </div>
                      )}
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      excerpt.length > 500 ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {excerpt.length}/500
                    </span>
                  </div>
                </div>
              </section>

              {/* Section 2: Metadata */}
              <section className="space-y-5">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Phân loại & Metadata
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                    Danh mục, thẻ và thông tin xuất bản
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Selector */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-white">
                      <FolderOpen className="h-4 w-4" />
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={category}
                      onValueChange={(value) => {
                        setCategory(value)
                        setErrors(prev => ({ ...prev, category: undefined }))
                      }}
                    >
                      <SelectTrigger className={cn(
                        "w-full h-11",
                        errors.category && "border-red-500 focus:ring-red-500"
                      )}>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCategories ? (
                          <div className="p-2 text-sm text-muted-foreground">Đang tải danh mục...</div>
                        ) : (
                          categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.category}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-white">
                      <Calendar className="h-4 w-4" />
                      Ngày xuất bản
                    </label>
                    <div className="pt-2">
                      <Calendar24
                        date={date}
                        setDate={(value: string) => {
                          setDate(value)
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tags Selector */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-white">
                    <Tag className="h-4 w-4" />
                    Thẻ (Tags)
                  </label>
                  <Popover open={tagSelectorOpen} onOpenChange={setTagSelectorOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={tagSelectorOpen}
                        className="w-full justify-between h-11 bg-transparent dark:text-white"
                      >
                        {tags.length > 0 ? `Đã chọn ${tags.length} thẻ` : "Chọn thẻ..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Tìm kiếm thẻ..." />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy thẻ nào.</CommandEmpty>
                          {isLoadingTags ? (
                            <div className="p-2 text-sm text-muted-foreground">Đang tải thẻ...</div>
                          ) : (
                            <CommandGroup>
                              {availableTags.map((tag) => (
                                <CommandItem
                                  key={tag.uuid}
                                  value={tag.name}
                                  onSelect={() => {
                                    handleAddTag(tag.uuid)
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", tags.includes(tag.uuid) ? "opacity-100" : "opacity-0")} />
                                  {tag.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tagUuid) => {
                        const tag = availableTags.find((t) => t.uuid === tagUuid)
                        return (
                          <span
                            key={tagUuid}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                          >
                            {tag?.name || tagUuid}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tagUuid)}
                              className="hover:text-primary/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 sm:py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Button
                  type="button"
                  variant={isPublish ? "secondary" : "outline"}
                  onClick={() => setIsPublish(!isPublish)}
                  disabled={isLoading}
                  className="min-w-[140px]"
                >
                  {isPublish ? "Lưu nháp" : "Xuất bản ngay"}
                </Button>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden lg:inline">
                  {isPublish ? "Bài viết sẽ được xuất bản ngay" : "Bài viết sẽ được lưu dưới dạng nháp"}
                </span>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="dark:text-white min-w-[100px]"
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading || !title.trim() || !excerpt.trim() || !category}
                  className="min-w-[140px]"
                >
                  {isLoading ? "Đang lưu..." : "Lưu bài viết"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
