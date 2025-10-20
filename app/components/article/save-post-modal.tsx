"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CalendarIcon, Tag, FolderOpen, ImageIcon, X, Check, ChevronsUpDown, Clock } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Calendar } from "~/components/ui/calendar"
import { cn } from "~/lib/utils"
// import { Input } from "~/components/ui/input"
import { format } from "date-fns"
import { Input } from "../ui/Input"

interface SavePostModalProps {
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

export function SavePostModal({ open, onOpenChange }: SavePostModalProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("12:00")
  const [image, setImage] = useState<string | null>(null)
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false)
  const [dateTimeOpen, setDateTimeOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onOpenChange])

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
    const dateTime = date ? new Date(date) : null
    if (dateTime && time) {
      const [hours, minutes] = time.split(":")
      dateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    }
    console.log("[v0] Saving post with metadata:", { title, category, tags, date: dateTime, image })
    onOpenChange(false)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false)
    }
  }

  const handleDateTimeApply = () => {
    setDateTimeOpen(false)
  }

  if (!open) return null

  return (
    <>
      <div
        className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", "animate-in fade-in-0 duration-200")}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
        <div
          className={cn(
            "relative w-full max-w-[98vw] sm:max-w-[90vw] lg:max-w-[1100px] max-h-[95vh] sm:max-h-[90vh] overflow-hidden",
            "bg-background dark:bg-black rounded-2xl border shadow-2xl",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            "pointer-events-auto",
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 rounded-full p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-foreground dark:text-white" />
          </button>

          <div className="overflow-y-auto max-h-[95vh] sm:max-h-[90vh] p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 id="modal-title" className="text-2xl sm:text-3xl font-semibold dark:text-white">
                Save Post
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                Add metadata to your post before saving
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-6">
              <div className="space-y-3 sm:space-y-4">
                <label className="text-sm font-medium text-foreground dark:text-white">Cover Image Preview</label>
                {image ? (
                  <div className="relative w-full h-[220px] sm:h-[280px] lg:h-[380px] rounded-2xl overflow-hidden border-2 border-border shadow-lg">
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Document cover"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 shadow-lg rounded-xl"
                    >
                      <X className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full h-[220px] sm:h-[280px] lg:h-[380px] border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center gap-2 sm:gap-3 text-muted-foreground px-4">
                      <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12" />
                      <span className="text-sm sm:text-base font-medium text-center">Click to upload cover image</span>
                      <span className="text-xs sm:text-sm text-center">Recommended: 1200x630px</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white">Title</label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    className="text-base sm:text-lg h-10 sm:h-11"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 dark:text-white">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <FolderOpen className="h-4 w-4" />
                      Category
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full h-10 sm:h-11">
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

                  <div className="space-y-2 dark:text-white">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      Date & Time
                    </label>
                    <Popover open={dateTimeOpen} onOpenChange={setDateTimeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-10 sm:h-11 justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            <span className="flex items-center gap-2">
                              {format(date, "PPP")}
                              <span className="text-muted-foreground">•</span>
                              {time}
                            </span>
                          ) : (
                            <span>Pick date & time</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                        <div className="p-4 space-y-4">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          <div className="border-t pt-4 space-y-3">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <Clock className="h-4 w-4" />
                              Select Time
                            </label>
                            <Input
                              type="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="w-full"
                            />
                            <Button onClick={handleDateTimeApply} className="w-full rounded-lg" disabled={!date}>
                              Apply
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

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
                        className="w-full justify-between bg-transparent dark:text-white h-10 sm:h-11"
                      >
                        Select tags...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 rounded-xl" align="start">
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
                                <Check
                                  className={cn("mr-2 h-4 w-4", tags.includes(tag) ? "opacity-100" : "opacity-0")}
                                />
                                {tag}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-primary/70 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="dark:text-white w-full sm:w-auto rounded-xl"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} size="lg" className="w-full sm:w-auto rounded-xl">
                Save Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
