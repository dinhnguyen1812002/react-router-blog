import { useState } from "react";
import { Button } from "~/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { cn } from "~/lib/utils";

interface FollowButtonProps {
  initialFollowing?: boolean;
  onFollow?: (isFollowing: boolean) => void;
  className?: string;
}

export const FollowButton = ({
  initialFollowing = false,
  onFollow,
  className,
}: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    setIsFollowing(!isFollowing);
    onFollow?.(!isFollowing);
  };

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "min-w-[140px] font-medium transition-all duration-300",
        isFollowing
          ? "bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      {isFollowing ? (
        <>
          {isHovering ? (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Bỏ theo dõi
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4 mr-2" />
              Đang theo dõi
            </>
          )}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Theo dõi
        </>
      )}
    </Button>
  );
};
