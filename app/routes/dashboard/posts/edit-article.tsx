import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { Button, Input } from "~/components/ui";
import { SavePostDialog } from "~/components/article/save-post-dialog";
import { authorApi, type CreateAuthorPostRequest } from "~/api/author";
import type { Route } from "../+types";
import { useEditor } from "@tiptap/react";
import { SaveAll } from "lucide-react";
import { toast } from "sonner";


export function meta({}: Route.MetaArgs) {
  return [{ title: "Write your thought" }];
}

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  // Editor content state
  const [editorContent, setEditorContent] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // Fetch post if editing
  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", id],
    queryFn: () => authorApi.getPostById(id!),
    enabled: isEditMode && !!id,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAuthorPostRequest) => authorApi.createPost(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["author", "posts"] });
      navigate("/dashboard/my-posts");
      toast.success("Post update successfully");
    },

    onError: (error) => {
      console.error("Create post error:", error);
      toast.error("Failed to update post");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      authorApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["author", "posts"] });
      navigate("/dashboard/my-posts");
    },
    onError: (error) => {
      console.error("Update post error:", error);
    },
  });

  // Load post content if editing
  useEffect(() => {
    if (existingPost && isEditMode) {
      setEditorContent(existingPost.content || "");
    }
  }, [existingPost, isEditMode]);

  /**
   * Handle save post with metadata
   * 
   * Flow:
   * 1. Nhận metadata từ SavePostDialog (đã được validate)
   * 2. Kết hợp với editorContent từ TipTap editor
   * 3. Tạo payload theo CreateAuthorPostRequest interface
   * 4. Gọi API createPost hoặc updatePost tùy theo mode
   * 
   * API Format:
   * {
   *   "title": "Your Post Title",
   *   "content": "The full content of your post.",
   *   "thumbnail": "URL_of_the_thumbnail_image",
   *   "categories": ["", ""],  // String array
   *   "tags": ["", ""],        // String array
   *   "featured": false,
   *   "public_date": "2025-09-01T10:00:00"
   * }
   * 
   * @param metadata - Post metadata từ dialog
   */
  const handleSave = (metadata: {
    title: string;
    excerpt: string;
    content: string;
    category: number;
    tags: string[];
    thumbnail?: string;
    publishDate?: string;
    isPublish: boolean;
  }) => {
    // Tạo payload theo đúng format API yêu cầu
    const postData: CreateAuthorPostRequest = {
      title: metadata.title,
      excerpt: metadata.excerpt, // Tóm tắt bài viết
      content: metadata.content, // Nội dung từ rich text editor
      thumbnail: metadata.thumbnail, // URL của ảnh đã upload
      categories: [String(metadata.category)], // Convert to string array
      tags: metadata.tags, // Array of tag UUIDs (already strings)
      featured: false, // Default to false, có thể thêm option sau
      public_date: metadata.publishDate, // ISO datetime string
    };

    // Update hoặc create tùy theo mode
    if (isEditMode && id) {
      updateMutation.mutate({ id, data: postData });
    } else {
      createMutation.mutate(postData);
    }
  };

  if (isLoadingPost) {
    return (

        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </div>

    );
  }

  return (

      <div className="flex flex-col h-screen">
        <div className="border-b bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                {isEditMode ? "Edit Post" : "Create New Post"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Edit your post content and metadata"
                  : "Write your new post here"}
              </p>
            </div>
            <Button
              onClick={() => setIsSaveDialogOpen(true)}
              className="gap-2"
              disabled={!editorContent.trim()}
            >
             <SaveAll />
              {isEditMode ? "Edit" : "Save"}
            </Button>
          </div>
        </div>

        <main className="flex-1 overflow-auto dark:text-white dark:bg-black/40">
          <SimpleEditor 
            value={existingPost?.content}
            onChange={setEditorContent}
          />
        </main>

        <SavePostDialog
          open={isSaveDialogOpen}
          onOpenChange={setIsSaveDialogOpen}
          onSave={handleSave}
          existingPost={existingPost}
          isLoading={createMutation.isPending || updateMutation.isPending}
          content={editorContent}
        />
      </div>

  );
}
