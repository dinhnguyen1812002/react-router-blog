import type React from "react"
import { useState } from "react"
import { Calendar, Tag, FolderOpen, ImageIcon, X, Check, ChevronsUpDown } from "lucide-react"
import { Button } from "~/components/ui/button"

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
import { FileUpload } from "src/components/ui/file-upload"

interface SavePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const availableTags = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "CSS",
  "HTML",
  "Tutorial",
  "Guide",
  "Tips",
  "Best Practices",
  "Performance",
  "Security",
  "Design",
  "UI/UX",
]

export function SavePostDialog({ open, onOpenChange }: SavePostDialogProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [date, setDate] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false)

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
  }

  const handleSave = () => {
    console.log("[v0] Saving post with metadata:", { title, category, tags, date, image })
    // Here you would typically save the post data
    onOpenChange(false)
  }

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };
 

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
            <label className="text-sm font-medium text-foreground dark:text-white">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="text-lg"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2 dark:text-white">
            <label className="text-sm font-medium text-foreground ">Cover Image</label>
            {image ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                <img src={image || "/placeholder.svg"} alt="Document cover" className="w-full h-full object-cover" />
                <Button variant="destructive" size="sm" onClick={handleRemoveImage} className="absolute top-2 right-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-sm">Click to upload cover image</span>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
            {/* <FileUpload onChange={handleFileUpload} /> */}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 dark:text-white">
            {/* Category Selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FolderOpen className="h-4 w-4" />
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="space-y-2 dark:text-white">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="h-4 w-4" />
                Date
              </label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full" />
            </div>
          </div>

          {/* Tags Selector */}
          <div className="space-y-2 dark:text-white">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Tag className="h-4 w-4" />
              Tags
            </label>
            <Popover open={tagSelectorOpen} onOpenChange={setTagSelectorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={tagSelectorOpen}
                  className="w-full justify-between bg-transparent dark:text-white"
                >
                  Select tags...
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search tags..." />
                  <CommandList>
                    <CommandEmpty>No tag found.</CommandEmpty>
                    <CommandGroup>
                      {availableTags.map((tag) => (
                        <CommandItem
                          key={tag}
                          value={tag}
                          onSelect={() => {
                            handleAddTag(tag)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", tags.includes(tag) ? "opacity-100" : "opacity-0")} />
                          {tag}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-primary/70 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}
            className="dark:text-white"
            >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
