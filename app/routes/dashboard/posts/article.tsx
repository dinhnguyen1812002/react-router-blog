/**
 * Article Editor Page
 *
 * Unified create and edit post page.
 * - Create: /dashboard/article
 * - Edit: /dashboard/article/:id/edit
 *
 * Features: TipTap editor, SavePostDialog with Zod validation, toast feedback.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { Button } from "~/components/ui";
import { SavePostDialog } from "~/components/article/save-post-dialog";
import { authorApi, type CreateAuthorPostRequest } from "~/api/author";
import type { PostFormMetadata } from "~/schemas/post";
import type { Route } from "../+types";
import { SaveAll } from "lucide-react";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Write your thought" }];
}

function ArticleLoadingState() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
          role="status"
          aria-label="Loading"
        />
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [editorContent, setEditorContent] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", id],
    queryFn: () => authorApi.getPostById(id!),
    enabled: isEditMode && Boolean(id),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAuthorPostRequest) => authorApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["author", "posts"] });
      toast.success("Post created successfully");
      navigate("/dashboard/my-posts");
    },
    onError: () => {
      toast.error("Failed to create post");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id: postId,
      data,
    }: {
      id: string;
      data: CreateAuthorPostRequest;
    }) => authorApi.updatePost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["author", "posts"] });
      toast.success("Post updated successfully");
      navigate("/dashboard/my-posts");
    },
    onError: () => {
      toast.error("Failed to update post");
    },
  });

  useEffect(() => {
    if (existingPost && isEditMode) {
      setEditorContent(existingPost.content ?? "");
    }
  }, [existingPost, isEditMode]);

  const handleSave = (metadata: PostFormMetadata) => {
    const postData: CreateAuthorPostRequest = {
      authorName: metadata.authorName,
      title: metadata.title,
      excerpt: metadata.excerpt,
      createdAt: metadata.createdAt,
      content: metadata.content,
      thumbnail: metadata.thumbnail,
      categories: metadata.categories,
      tags: metadata.tags,
      featured: metadata.featured ?? false,
      public_date: metadata.public_date,
      status: metadata.status,
      visibility: metadata.visibility,
      scheduledPublishAt: metadata.scheduledPublishAt,
    };

    if (isEditMode && id) {
      updateMutation.mutate({ id, data: postData });
    } else {
      createMutation.mutate(postData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isLoadingPost) {
    return <ArticleLoadingState />;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-background px-4 py-3">
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
            {isEditMode ? "Update" : "Save"}
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto dark:text-white dark:bg-black/40">
        <SimpleEditor
          value={editorContent}
          onChange={setEditorContent}
        />
      </main>

      <SavePostDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSave}
        existingPost={existingPost}
        isLoading={isPending}
        content={editorContent}
      />
    </div>
  );
}
