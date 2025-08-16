import { useState, useEffect, useRef } from 'react';
import { List, ChevronRight, Hash, Eye, EyeOff } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
  element?: HTMLElement;
}

interface TableOfContentsProps {
  content?: string;
  className?: string;
  maxLevel?: number;
  showNumbers?: boolean;
  collapsible?: boolean;
  sticky?: boolean;
  highlightActive?: boolean;
  smoothScroll?: boolean;
  offset?: number;
}

export default function TableOfContents({
  content,
  className = '',
  maxLevel = 3,
  showNumbers = true,
  collapsible = true,
  sticky = true,
  highlightActive = true,
  smoothScroll = true,
  offset = 80,
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract headings from content or DOM
  useEffect(() => {
    const extractHeadings = () => {
      let headings: NodeListOf<HTMLElement>;
      
      if (content) {
        // Parse content string to extract headings
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      } else {
        // Extract from current page DOM
        headings = document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6, .post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6');
      }

      const items: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level <= maxLevel) {
          let id = heading.id;
          
          // Generate ID if not exists
          if (!id) {
            id = `heading-${index}-${heading.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || index}`;
            heading.id = id;
          }

          items.push({
            id,
            text: heading.textContent || '',
            level,
            element: heading,
          });
        }
      });

      setTocItems(items);
    };

    // Extract headings after a short delay to ensure content is rendered
    const timer = setTimeout(extractHeadings, 100);
    
    // Re-extract when content changes
    const observer = new MutationObserver(extractHeadings);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [content, maxLevel]);

  // Setup intersection observer for active heading detection
  useEffect(() => {
    if (!highlightActive || tocItems.length === 0) return;

    const headingElements = tocItems.map(item => item.element).filter(Boolean) as HTMLElement[];
    
    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Get the first visible heading
          const firstVisible = visibleEntries[0];
          setActiveId(firstVisible.target.id);
        }
      },
      {
        rootMargin: `-${offset}px 0px -50% 0px`,
        threshold: 0,
      }
    );

    headingElements.forEach(element => {
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [tocItems, highlightActive, offset]);

  // Handle scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const elementPosition = element.offsetTop - offset;
    
    if (smoothScroll) {
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, elementPosition);
    }

    // Update active heading
    setActiveId(id);
  };

  // Generate numbering
  const generateNumbers = (items: TocItem[]) => {
    const counters: number[] = [0, 0, 0, 0, 0, 0];
    
    return items.map(item => {
      // Reset deeper level counters
      for (let i = item.level; i < counters.length; i++) {
        if (i === item.level - 1) {
          counters[i]++;
        } else if (i > item.level - 1) {
          counters[i] = 0;
        }
      }
      
      // Generate number string
      const numberParts = counters.slice(0, item.level).filter(n => n > 0);
      return numberParts.join('.');
    });
  };

  const numbers = showNumbers ? generateNumbers(tocItems) : [];

  if (tocItems.length === 0) {
    return null;
  }

  const containerClasses = `
    ${sticky ? '' : ''}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center space-x-2">
            <List className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              Mục lục
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({tocItems.length})
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
              >
                <ChevronRight 
                  className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${
                    isCollapsed ? '' : 'rotate-90'
                  }`} 
                />
              </button>
            )}
            
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={isVisible ? 'Ẩn' : 'Hiện'}
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {isVisible && !isCollapsed && (
          <div className="p-4 max-h-96 overflow-y-auto">
            <nav>
              <ul className="space-y-1">
                {tocItems.map((item, index) => {
                  const isActive = highlightActive && activeId === item.id;
                  const indentLevel = Math.max(0, item.level - 1);
                  
                  return (
                    <li key={item.id} style={{ marginLeft: `${indentLevel * 16}px` }}>
                      <button
                        onClick={() => scrollToHeading(item.id)}
                        className={`w-full text-left p-2 rounded-md transition-all duration-200 group flex items-start space-x-2 ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {/* Number */}
                        {showNumbers && (
                          <span className={`text-xs font-mono flex-shrink-0 mt-0.5 ${
                            isActive 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {numbers[index]}.
                          </span>
                        )}
                        
                        {/* Hash icon for active item */}
                        {isActive && (
                          <Hash className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
                        )}
                        
                        {/* Text */}
                        <span className={`text-sm leading-relaxed ${
                          item.level === 1 ? 'font-medium' : 
                          item.level === 2 ? 'font-normal' : 'font-light'
                        }`}>
                          {item.text}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}

        {/* Collapsed state */}
        {isVisible && isCollapsed && (
          <div className="p-4">
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
              <span className="text-sm">Mục lục đã thu gọn</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      {highlightActive && tocItems.length > 0 && (
        <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tiến độ đọc</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {tocItems.findIndex(item => item.id === activeId) + 1} / {tocItems.length}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${((tocItems.findIndex(item => item.id === activeId) + 1) / tocItems.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for table of contents
export function useTableOfContents(maxLevel: number = 3) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const extractHeadings = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const items: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level <= maxLevel) {
          let id = heading.id;
          
          if (!id) {
            id = `heading-${index}-${heading.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || index}`;
            heading.id = id;
          }

          items.push({
            id,
            text: heading.textContent || '',
            level,
            element: heading as HTMLElement,
          });
        }
      });

      setTocItems(items);
    };

    const timer = setTimeout(extractHeadings, 100);
    return () => clearTimeout(timer);
  }, [maxLevel]);

  return { tocItems, activeId, setActiveId };
}
