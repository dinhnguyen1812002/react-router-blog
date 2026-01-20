import { useEffect } from "react";
import { resolveImageUrl } from "~/utils/image";
import type { UserProfile } from "~/types/profile";

interface ProfileSEOProps {
  profile: UserProfile;
  baseUrl?: string;
}

const domain = "http://localhost:5173";

export function ProfileSEO({ profile, baseUrl = domain }: ProfileSEOProps) {
  const profileUrl = `${baseUrl}/profile/${profile.slug}`;
  const avatarUrl = resolveImageUrl(profile.avatar) || `${baseUrl}/default-avatar.jpg`;

  // Generate description
  const description = profile.bio
    ? `${profile.bio.substring(0, 160)}...`
    : `Discover ${profile.username}'s profile with ${profile.postCount} posts. Explore their content and connect.`;

  // Generate keywords
  const keywords = [
    profile.username,
    "blog",
    "author",
    "posts",
    "content",
    ...(profile.bio ? profile.bio.split(" ").slice(0, 5) : []),
  ].join(", ");

  // Update meta tags using useEffect
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Update title
    document.title = `${profile.username} - Profile | Blog Community`;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("author", profile.username);
    updateMetaTag("robots", "index, follow");

    // Open Graph meta tags
    updateMetaTag("og:title", `${profile.username} - Profile`, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", "profile", true);
    updateMetaTag("og:url", profileUrl, true);
    updateMetaTag("og:image", avatarUrl, true);
    updateMetaTag("og:image:width", "400", true);
    updateMetaTag("og:image:height", "400", true);
    updateMetaTag("og:site_name", "Blog Community", true);
    updateMetaTag("og:locale", "vi_VN", true);

    // Profile specific Open Graph
    updateMetaTag("profile:username", profile.username, true);
    if (profile.bio) {
      updateMetaTag("profile:bio", profile.bio, true);
    }

    // Twitter Card meta tags
    updateMetaTag("twitter:card", "summary");
    updateMetaTag("twitter:title", `${profile.username} - Profile`);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", avatarUrl);
    if (profile.socialMediaLinks?.twitter) {
      const twitterHandle = profile.socialMediaLinks.twitter.split('/').pop();
      updateMetaTag("twitter:site", `@${twitterHandle}`);
    }

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = profileUrl;

    // Add structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": profile.username,
      "url": profileUrl,
      "image": avatarUrl,
      ...(profile.bio && { "description": profile.bio }),
      ...(profile.website && { "sameAs": [profile.website] }),
      ...(Object.values(profile.socialMediaLinks || {}).length > 0 && {
        "sameAs": Object.values(profile.socialMediaLinks).filter(Boolean)
      }),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": profileUrl
      },
      "knowsAbout": profile.customInformation ? "Writing, Blogging" : undefined,
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Blogger"
      }
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [profile, profileUrl, avatarUrl, description, keywords, baseUrl]);

  // This component doesn't render anything visible
  return null;
}