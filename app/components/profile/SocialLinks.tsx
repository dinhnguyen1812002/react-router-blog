
import { Label } from "~/components/ui/label";
import { Github, Facebook, Instagram, Linkedin } from "lucide-react";
import { Input } from "../ui/Input";

interface SocialLinksProps {
  github: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  onChange: (field: string, value: string) => void;
}

export const SocialLinks = ({
  github,
  facebook,
  instagram,
  linkedin,
  onChange,
}: SocialLinksProps) => {
  const socialPlatforms = [
    {
      id: "github",
      label: "GitHub",
      icon: Github,
      placeholder: "username or https://github.com/username",
      value: github,
      color: "text-foreground",
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: Facebook,
      placeholder: "username or https://facebook.com/username",
      value: facebook,
      color: "text-[#1877F2]",
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: Instagram,
      placeholder: "username or https://instagram.com/username",
      value: instagram,
      color: "text-[#E4405F]",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      placeholder: "username or https://linkedin.com/in/username",
      value: linkedin,
      color: "text-[#0A66C2]",
    },
  ];

  return (
    <div className="space-y-4">
      {socialPlatforms.map((platform) => {
        const Icon = platform.icon;
        return (
          <div key={platform.id} className="space-y-2">
            <Label htmlFor={platform.id} className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${platform.color}`} />
              {platform.label}
            </Label>
            <Input
              id={platform.id}
              placeholder={platform.placeholder}
              value={platform.value}
              onChange={(e) => onChange(platform.id, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
};
