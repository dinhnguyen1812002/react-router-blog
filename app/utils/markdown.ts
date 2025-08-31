// Markdown processing utilities with security measures
// Note: This requires 'marked' and 'dompurify' packages to be installed
// Run: npm install marked dompurify @types/dompurify

let marked: any;
let DOMPurify: any;

// Dynamic imports to handle SSR and missing dependencies
const loadDependencies = async () => {
  if (typeof window === 'undefined') {
    // Server-side: use a simple fallback
    return {
      marked: null,
      DOMPurify: null
    };
  }

  try {
    if (!marked) {
      const markedModule = await import('marked');
      marked = markedModule.marked;
    }
    
    if (!DOMPurify) {
      const DOMPurifyModule = await import('dompurify');
      DOMPurify = DOMPurifyModule.default;
    }

    return { marked, DOMPurify };
  } catch (error) {
    console.warn('Markdown dependencies not available:', error);
    return { marked: null, DOMPurify: null };
  }
};

// Fallback markdown renderer for when dependencies are not available
const fallbackMarkdownRenderer = (content: string): string => {
  return content
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
};

// Safe HTML sanitization configuration
const getSanitizeConfig = () => ({
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'u', 's',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src',
    'class', 'id',
    'target', 'rel'
  ],
  // Ensure external links are safe
  ADD_ATTR: ['target', 'rel'],
  FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout'],
  // Remove dangerous tags
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button', 'iframe'],
  // Transform external links to be safe
  ALLOW_DATA_ATTR: false,
});

// Process placeholders in markdown content
const processPlaceholders = (content: string, userData?: any): string => {
  if (!userData) return content;

  let processedContent = content;

  // Replace {{post_count}} with actual post count
  if (userData.postsCount !== undefined) {
    processedContent = processedContent.replace(/\{\{post_count\}\}/g, userData.postsCount.toString());
  }

  // Replace {{latest_posts}} with HTML list of recent posts
  if (userData.latestPosts && Array.isArray(userData.latestPosts)) {
    const postsHtml = `<ul class="list-disc list-inside space-y-1">
      ${userData.latestPosts.map((post: any) => 
        `<li><a href="/posts/${post.slug}" class="text-blue-600 hover:text-blue-800">${post.title}</a></li>`
      ).join('')}
    </ul>`;
    processedContent = processedContent.replace(/\{\{latest_posts\}\}/g, postsHtml);
  }

  // Replace {{user_bio}} with user bio
  if (userData.bio) {
    processedContent = processedContent.replace(/\{\{user_bio\}\}/g, userData.bio);
  }

  // Replace {{social_links}} with social media links
  if (userData.socialMediaLinks) {
    const socialLinksHtml = Object.entries(userData.socialMediaLinks)
      .filter(([_, url]) => url)
      .map(([platform, url]) => 
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">${platform}</a>`
      )
      .join(' | ');
    
    if (socialLinksHtml) {
      processedContent = processedContent.replace(/\{\{social_links\}\}/g, socialLinksHtml);
    }
  }

  return processedContent;
};

// Main function to safely render markdown
export const renderMarkdownSafely = async (
  content: string, 
  userData?: any
): Promise<string> => {
  if (!content) return '';

  try {
    const { marked: markedLib, DOMPurify: DOMPurifyLib } = await loadDependencies();

    // Process placeholders first
    const processedContent = processPlaceholders(content, userData);

    let html: string;

    if (markedLib && DOMPurifyLib) {
      // Use full markdown processing with marked
      html = markedLib.parse(processedContent);
      
      // Sanitize the HTML to prevent XSS attacks
      html = DOMPurifyLib.sanitize(html, getSanitizeConfig());
    } else {
      // Fallback to simple markdown processing
      html = fallbackMarkdownRenderer(processedContent);
      
      // Basic XSS prevention for fallback
      html = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }

    return html;
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return '<p class="text-red-500">Error rendering content</p>';
  }
};

// Validate markdown content length and structure
export const validateMarkdownContent = (content: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check length
  if (content.length > 10000) {
    errors.push('Content must be less than 10,000 characters');
  }

  // Check for potentially dangerous content
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  dangerousPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      errors.push('Content contains potentially unsafe elements');
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Extract plain text from markdown for search/preview purposes
export const extractPlainText = (markdownContent: string): string => {
  return markdownContent
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
};
