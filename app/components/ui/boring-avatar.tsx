import React, { useState } from "react";
import Avatar from "boring-avatars";
import { cn } from "~/lib/utils";

export type UserAvatarProps = {
  src?: string | null; // User-provided avatar URL
  name?: string; // Seed for boring-avatars (use username/email/display name)
  size?: number; // Width/height in px
  alt?: string;
  className?: string;
  square?: boolean; // Square avatar instead of round
  // Boring Avatars customization
  variant?: "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus";
  colors?: string[];
  title?: string; // Optional title/tooltip
};

const DEFAULT_COLORS = [
  "#F94144",
  "#F3722C",
  "#F8961E",
  "#F9844A",
  "#F9C74F",
  "#90BE6D",
  "#43AA8B",
  "#577590",
];

export function UserAvatar({
  src,
  name = "user",
  size = 40,
  alt,
  className,
  square = false,
  variant = "beam",
  colors = DEFAULT_COLORS,
  title,
}: UserAvatarProps) {
  const [errored, setErrored] = useState(false);

  const showImage = Boolean(src && !errored);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800",
        className
      )}
      style={{ width: size, height: size, borderRadius: square ? 8 : 9999 }}
      title={title ?? name}
    >
      {showImage ? (
        <img
          src={src ?? undefined}
          alt={alt || name}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <Avatar
          size={size}
          name={name}
          variant={variant}
          colors={colors}
          square={square}
        />
      )}
    </div>
  );
}

export default UserAvatar;
