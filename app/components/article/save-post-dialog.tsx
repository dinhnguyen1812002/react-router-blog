import type React from "react"
import { useState, useEffect } from "react"
import { Calendar, Tag, FolderOpen, X, Check, ChevronsUpDown, AlertCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
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
        const dateStr = new Date(existingPost.public_date).toISOString().slice(0, 16)
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
 

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto dark:bg-black">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Save Post</DialogTitle>
          <DialogDescription>Add metadata to your post before saving</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">
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
                "text-lg",
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
          
          {/* Excerpt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">
              Tóm tắt <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value)
                setErrors(prev => ({ ...prev, excerpt: undefined }))
              }}
              placeholder="Nhập tóm tắt ngắn gọn về bài viết (10-500 ký tự)"
              rows={3}
              className={cn(
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
                "text-xs",
                excerpt.length > 500 ? "text-red-500" : "text-muted-foreground"
              )}>
                {excerpt.length}/500
              </span>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2 dark:text-white">
            <label className="text-sm font-medium text-foreground">
              Ảnh đại diện
            </label>
            <ThumbnailUpload
              value={thumbnail}
              onChange={handleThumbnailChange}
              onRemove={handleThumbnailRemove}
              maxSize={10}
              allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
            />
            {errors.thumbnail && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.thumbnail}</span>
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 dark:text-white">
            {/* Category Selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
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
                  "w-full",
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
            <div className="space-y-2 dark:text-white">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="h-4 w-4" />
                Ngày xuất bản
              </label>
              <Input 
                type="datetime-local" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full" 
              />
            </div>
          </div>

          {/* Tags Selector */}
          <div className="space-y-2 dark:text-white">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
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
                  className="w-full justify-between bg-transparent dark:text-white"
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
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tagUuid) => {
                  const tag = availableTags.find((t) => t.uuid === tagUuid)
                  return (
                    <span
                      key={tagUuid}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag?.name || tagUuid}
                      <button 
                        type="button"
                        onClick={() => handleRemoveTag(tagUuid)} 
                        className="hover:text-primary/70 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="dark:text-white"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button 
            type="button"
            variant={isPublish ? "secondary" : "default"}
            onClick={() => setIsPublish(!isPublish)}
            disabled={isLoading}
          >
            {isPublish ? "Lưu nháp" : "Xuất bản ngay"}
          </Button>
          <Button 
            type="button"
            onClick={handleSave} 
            disabled={isLoading || !title.trim() || !excerpt.trim() || !category}
          >
            {isLoading ? "Đang lưu..." : "Lưu bài viết"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
