import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

import { Upload, X } from "lucide-react";
import { toast, useSonner } from "sonner";
import { Button } from "../ui/button";


interface AvatarUploadProps {
  currentAvatar: string | null;
  onAvatarChange: (avatar: string | null) => void;
}

export const AvatarUpload = ({ currentAvatar, onAvatarChange }: AvatarUploadProps) => {
  const { toasts } = useSonner();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatar);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast("Invalid File Type", {
        description: "Please upload a JPG or PNG image",
        
      });
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast("File size is too large", {
        description: "Please upload a file smaller than 2MB",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onAvatarChange(result);
    };
    reader.readAsDataURL(file);
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
      <Avatar className="h-32 w-32 border-4 border-border shadow-[var(--shadow-medium)]">
        <AvatarImage src={preview || undefined} alt="Profile" className="object-cover" />
        <AvatarFallback className="bg-muted text-4xl">
          {preview ? "" : "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>

        {preview && (
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
          JPG or PNG. Max size 2MB.
        </p>
      </div>
    </div>
  );
};
