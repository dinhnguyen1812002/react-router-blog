import { useEffect } from "react";
import type { Post } from "~/types";

interface PostSEOProps {
  post: Post;
  baseUrl?: string;
}
const domain = "http://localhost:5173";

const getEnv = import.meta.env.VITE_ENV;

export function PostSEO({ post, baseUrl = domain }: PostSEOProps) {
  const postUrl = `${baseUrl}/posts/${post.slug}`;
  const imageUrl = post.thumbnail || post.thumbnailUrl || `${baseUrl}/default-post-image.jpg`;

  // Update meta tags using useEffect
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Update title
    document.title = `${post.title} `;

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
    updateMetaTag("description", post.excerpt);
    updateMetaTag("keywords", post.tags.map(tag => tag.name).join(", "));
    updateMetaTag("author", post.user.username);

    // Open Graph meta tags
    updateMetaTag("og:type", "article", true);
    updateMetaTag("og:title", post.title, true);
    updateMetaTag("og:description", post.excerpt, true);
    updateMetaTag("og:url", postUrl, true);
    updateMetaTag("og:image", imageUrl, true);
    updateMetaTag("og:image:width", "1200", true);
    updateMetaTag("og:image:height", "630", true);
    updateMetaTag("og:site_name", "Your Blog Name", true);
    updateMetaTag("og:locale", "vi_VN", true);
    updateMetaTag("article:published_time", post.createdAt, true);
    if (post.updatedAt) {
      updateMetaTag("article:modified_time", post.updatedAt, true);
    }
    updateMetaTag("article:author", post.user.username, true);

    // Twitter Card meta tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", post.title);
    updateMetaTag("twitter:description", post.excerpt);
    updateMetaTag("twitter:image", imageUrl);
    updateMetaTag("twitter:site", "@yourtwitterhandle");
    updateMetaTag("twitter:creator", "@yourtwitterhandle");

    // Additional meta tags
    updateMetaTag("robots", "index, follow");
    updateMetaTag("googlebot", "index, follow");
    updateMetaTag("language", "Vietnamese");
    updateMetaTag("geo.region", "VN");
    updateMetaTag("geo.placename", "Vietnam");

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = postUrl;

    // Add structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": imageUrl,
      "author": {
        "@type": "Person",
        "name": post.user.username,
        "image": post.user.avatar || `${baseUrl}/default-avatar.jpg`
      },
      "publisher": {
        "@type": "Organization",
        "name": "Your Blog Name",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      },
      "datePublished": post.createdAt,
      "dateModified": post.updatedAt || post.createdAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postUrl
      },
      "articleSection": post.categories.map(category => category.category).join(", "),
      "keywords": post.tags.map(tag => tag.name).join(", "),
      "wordCount": post.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
      "commentCount": post.commentCount || 0,
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/ViewAction",
          "userInteractionCount": post.viewCount || 0
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/LikeAction",
          "userInteractionCount": post.likeCount || 0
        }
      ]
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

    // Preload critical image
    let preloadLink = document.querySelector(`link[rel="preload"][href="${imageUrl}"]`) as HTMLLinkElement;
    if (!preloadLink) {
      preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.href = imageUrl;
      preloadLink.as = "image";
      document.head.appendChild(preloadLink);
    }

  }, [post, postUrl, imageUrl, baseUrl]);

  // This component doesn't render anything visible
  return null;
}
