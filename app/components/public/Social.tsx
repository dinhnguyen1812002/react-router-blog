import { Twitter, Github, Linkedin, Globe, Instagram, Facebook } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { SocialLinks } from "~/types/profile";

interface SocialLinksProps {
  links: SocialLinks;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
};

export const Social = ({ links }: SocialLinksProps) => {
  return (
    <div className="flex items-center gap-2">
      {Object.entries(links)
        .filter(([key, url]) => url && key !== 'type')
        .map(([key, url]) => {
          const iconKey = key.toLowerCase();
          const Icon = iconMap[iconKey];
          if (!Icon) return null;
          return (
            <Button
              key={key}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              asChild
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Icon className="h-5 w-5" />
              </a>
            </Button>
          );
        })}
    </div>
  );
};
