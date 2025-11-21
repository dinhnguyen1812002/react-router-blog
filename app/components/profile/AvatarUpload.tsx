import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { profileApi } from "~/api/profile";

interface AvatarUploadProps {
  currentAvatar: string | null;
  onAvatarChange: (avatar: string | null) => void;
}

export const AvatarUpload = ({ currentAvatar, onAvatarChange }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatar);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid File Type", {
        description: "Please upload a JPG, PNG, GIF, or WebP image",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", {
        description: "Please upload a file smaller than 5MB",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const response = await profileApi.uploadAvatar(file);
      onAvatarChange(response.url);
      setPreview(response.url);
      toast.success("Avatar uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload Failed", {
        description: error.response?.data?.message || "Failed to upload avatar",
      });
      setPreview(currentAvatar);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-border shadow-[var(--shadow-medium)]">
          <AvatarImage src={preview || undefined} alt="Profile" className="object-cover" />
          <AvatarFallback className="bg-muted text-4xl">
            {preview ? "" : "U"}
          </AvatarFallback>
        </Avatar>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto"
          disabled={uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Photo"}
        </Button>

        {preview && !uploading && (
          <Button
            variant="destructive"
            onClick={handleRemove}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Remove Photo
          </Button>
        )}

        <p className="text-xs text-muted-foreground">
          JPG, PNG, GIF, or WebP. Max size 5MB.
        </p>
      </div>
    </div>
  );
};
