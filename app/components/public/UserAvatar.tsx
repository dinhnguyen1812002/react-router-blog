import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

interface UserAvatarProps {
  src?:  string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-24 w-24",
  xl: "h-32 w-32 md:h-40 md:w-40",
};

export const UserAvatar = ({ src, name, size = "md", className }: UserAvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn(
      sizeClasses[size],
      "ring-4 ring-background shadow-card",
      className
    )}>
      <AvatarImage src={src || undefined} alt={name} className="object-cover" />
      <AvatarFallback className="bg-primary text-primary-foreground font-display text-lg md:text-2xl">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
