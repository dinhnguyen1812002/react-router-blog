# Components Guide - Hướng dẫn Sử dụng Components

## 📦 Tổng quan Components

Đã tạo các components tái sử dụng cho 3 trang web minimalist:

---

## 🎯 Layout Components

### MainLayout

**File**: `app/components/layout/MainLayout.tsx`

**Mục đích**: Wrapper chính cho tất cả các trang, bao gồm Header và Footer

**Usage**:

```tsx
import { MainLayout } from "~/components/layout/MainLayout";

export default function MyPage() {
  return (
    <MainLayout>
      <div>Your content here</div>
    </MainLayout>
  );
}
```

**Props**:

- `children`: React.ReactNode (required)
- `className`: string (optional) - Custom classes cho main element

---

## 📄 Article Components

### ArticleCard

**File**: `app/components/article/ArticleCard.tsx`

**Mục đích**: Card hiển thị bài viết trong list view

**Features**:

- Thumbnail với hover zoom
- Categories badges
- Title và excerpt
- Author info với avatar
- Meta data (date, reading time, views, likes)
- Responsive layout

**Usage**:

```tsx
import { ArticleCard } from "~/components/article/ArticleCard";

<ArticleCard post={post} />;
```

**Props**:

- `post`: Post (required) - Object bài viết từ API

**Styling**:

- Desktop: Thumbnail left, content right
- Mobile: Stack vertical
- Hover: Shadow + border + thumbnail scale

---

## 📂 Category Components

### CategoryCard

**File**: `app/components/category/CategoryCard.tsx`

**Mục đích**: Card hiển thị category trong grid

**Features**:

- Color bar phía trên
- Icon với background màu category
- Title và description
- Footer với arrow icon
- Hover lift animation

**Usage**:

```tsx
import { CategoryCard } from "~/components/category/CategoryCard";

<CategoryCard category={category} />;
```

**Props**:

- `category`: Category (required) - Object category từ API

**Styling**:

- Color bar: 8px height với category.backgroundColor
- Icon: 64x64 với background opacity 20%
- Hover: Shadow + translate-y + scale icon

---

## 🎭 Meme Components

### MemeGridItem

**File**: `app/components/meme/MemeGridItem.tsx`

**Mục đích**: Item trong meme grid

**Features**:

- Square aspect ratio
- Lazy loading image
- Hover overlay với zoom icon
- Stats overlay (views, likes)
- Click để mở lightbox

**Usage**:

```tsx
import { MemeGridItem } from "~/components/meme/MemeGridItem";

<MemeGridItem meme={meme} onClick={() => setSelectedMeme(meme)} />;
```

**Props**:

- `meme`: Meme (required) - Object meme từ API
- `onClick`: () => void (required) - Handler khi click

### MemeLightbox

**File**: `app/components/meme/MemeLightbox.tsx`

**Mục đích**: Modal viewer cho meme full size

**Features**:

- Full screen overlay
- Backdrop blur
- Close button
- ESC key support
- Prevent body scroll
- Image info section

**Usage**:

```tsx
import { MemeLightbox } from "~/components/meme/MemeLightbox";

{
  selectedMeme && (
    <MemeLightbox meme={selectedMeme} onClose={() => setSelectedMeme(null)} />
  );
}
```

**Props**:

- `meme`: Meme (required) - Meme để hiển thị
- `onClose`: () => void (required) - Handler khi đóng

**Interactions**:

- Click backdrop → Close
- Click X button → Close
- Press ESC → Close
- Click content → Không close

---

## 💀 Skeleton Components

### ArticleListSkeleton

**File**: `app/components/skeleton/ArticleListSkeleton.tsx`

**Mục đích**: Loading state cho article list

**Usage**:

```tsx
import { ArticleListSkeleton } from "~/components/skeleton/ArticleListSkeleton";

{
  isLoading ? <ArticleListSkeleton /> : <ArticleList />;
}
```

**Features**:

- 5 skeleton cards
- Animate pulse
- Match ArticleCard layout

### CategoryGridSkeleton

**File**: `app/components/skeleton/CategoryGridSkeleton.tsx`

**Mục đích**: Loading state cho category grid

**Usage**:

```tsx
import { CategoryGridSkeleton } from "~/components/skeleton/CategoryGridSkeleton";

{
  isLoading ? <CategoryGridSkeleton /> : <CategoryGrid />;
}
```

**Features**:

- 8 skeleton cards
- Grid layout matching CategoryCard
- Animate pulse

### MemeGridSkeleton

**File**: `app/components/skeleton/MemeGridSkeleton.tsx`

**Mục đích**: Loading state cho meme grid

**Usage**:

```tsx
import { MemeGridSkeleton } from "~/components/skeleton/MemeGridSkeleton";

{
  isLoading ? <MemeGridSkeleton /> : <MemeGrid />;
}
```

**Features**:

- 8 skeleton items
- Square aspect ratio
- Animate pulse

---

## 🎨 UI Components

### EmptyState

**File**: `app/components/ui/EmptyState.tsx`

**Mục đích**: Hiển thị khi không có dữ liệu

**Usage**:

```tsx
import { EmptyState } from "~/components/ui/EmptyState";
import { FileText } from "lucide-react";

<EmptyState
  icon={FileText}
  title="Không có bài viết"
  description="Chưa có bài viết nào được đăng."
  action={<button>Tạo bài viết</button>}
/>;
```

**Props**:

- `icon`: LucideIcon (optional) - Icon component
- `title`: string (required) - Tiêu đề
- `description`: string (optional) - Mô tả
- `action`: React.ReactNode (optional) - Action button/link

### Pagination

**File**: `app/components/ui/Pagination.tsx`

**Mục đích**: Component phân trang tái sử dụng

**Usage**:

```tsx
import { Pagination } from "~/components/ui/Pagination";

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  maxVisible={5}
/>;
```

**Props**:

- `currentPage`: number (required) - Trang hiện tại (0-indexed)
- `totalPages`: number (required) - Tổng số trang
- `onPageChange`: (page: number) => void (required) - Handler
- `maxVisible`: number (optional, default: 5) - Số page numbers hiển thị

**Features**:

- Smart page number calculation
- Previous/Next buttons
- Disabled states
- Aria labels cho accessibility

---

## 🔧 Component Patterns

### Pattern 1: Loader + Component

```tsx
// Loader fetch data server-side
export async function loader() {
  const data = await api.getData();
  return { data };
}

// Component nhận data từ loader
export default function Page({ loaderData }) {
  const { data } = loaderData;
  return <div>{/* Render */}</div>;
}
```

### Pattern 2: Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);

return <>{isLoading ? <Skeleton /> : <Content />}</>;
```

### Pattern 3: Empty States

```tsx
{
  data.length === 0 && (
    <EmptyState icon={Icon} title="No data" description="Description here" />
  );
}
```

### Pattern 4: Hover Effects

```tsx
<div className="group hover:shadow-xl transition-all duration-300">
  <img className="group-hover:scale-105 transition-transform" />
</div>
```

---

## 🎨 Styling Conventions

### Class Naming

```tsx
// Base classes
className = "bg-white dark:bg-gray-800";

// Hover states
className = "hover:shadow-xl hover:border-gray-300";

// Transitions
className = "transition-all duration-300";

// Responsive
className = "w-full sm:w-48 lg:w-64";
```

### Color System

```tsx
// Background
bg-white dark:bg-gray-800

// Text
text-gray-900 dark:text-gray-100  // Primary
text-gray-600 dark:text-gray-400  // Secondary
text-gray-500 dark:text-gray-500  // Muted

// Border
border-gray-200 dark:border-gray-700
```

### Spacing

```tsx
// Padding
p - 4; // 16px
p - 6; // 24px
p - 8; // 32px

// Gap
gap - 2; // 8px
gap - 4; // 16px
gap - 6; // 24px
```

---

## 🚀 Performance Tips

### 1. Lazy Loading

```tsx
// Images
<img loading="lazy" src={url} alt={alt} />;

// Components
const Component = lazy(() => import("./Component"));
```

### 2. Memoization

```tsx
import { memo } from "react";

export const MyComponent = memo(function MyComponent({ data }) {
  // Component logic
});
```

### 3. Efficient Re-renders

```tsx
// Sử dụng useCallback cho handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);

// Sử dụng useMemo cho computed values
const computedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

---

## ♿ Accessibility

### Semantic HTML

```tsx
<article>  // Cho article cards
<nav>      // Cho navigation
<button>   // Cho interactive elements
<img alt="..."> // Alt text
```

### ARIA Labels

```tsx
<button aria-label="Close">
  <X />
</button>

<nav aria-label="Pagination">
  {/* Pagination controls */}
</nav>
```

### Keyboard Support

```tsx
// ESC key để đóng modal
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [onClose]);
```

---

## 🧪 Testing Components

### Unit Testing

```tsx
import { render, screen } from "@testing-library/react";
import { ArticleCard } from "./ArticleCard";

test("renders article card", () => {
  const post = {
    /* mock data */
  };
  render(<ArticleCard post={post} />);
  expect(screen.getByText(post.title)).toBeInTheDocument();
});
```

### Integration Testing

```tsx
test("pagination works", () => {
  const handlePageChange = jest.fn();
  render(
    <Pagination
      currentPage={0}
      totalPages={5}
      onPageChange={handlePageChange}
    />,
  );

  fireEvent.click(screen.getByText("Sau"));
  expect(handlePageChange).toHaveBeenCalledWith(1);
});
```

---

## 📚 Component Hierarchy

```
MainLayout
├── Header
├── Main Content
│   ├── Articles Page
│   │   ├── ArticleCard (multiple)
│   │   ├── Pagination
│   │   └── EmptyState (conditional)
│   │
│   ├── Categories Page
│   │   ├── CategoryCard (multiple)
│   │   └── EmptyState (conditional)
│   │
│   └── Memes Page
│       ├── MemeGridItem (multiple)
│       ├── MemeLightbox (conditional)
│       └── EmptyState (conditional)
│
└── Footer
```

---

## 🎯 Best Practices

### 1. Component Composition

```tsx
// Good: Small, focused components
<ArticleCard post={post} />

// Bad: Monolithic components
<ArticleListWithEverything />
```

### 2. Props Interface

```tsx
// Good: Clear interface
interface ArticleCardProps {
  post: Post;
  variant?: "default" | "compact";
}

// Bad: Unclear props
interface Props {
  data: any;
  type: string;
}
```

### 3. Default Props

```tsx
// Good: Sensible defaults
function Pagination({ maxVisible = 5 }) {
  // ...
}
```

### 4. Error Boundaries

```tsx
// Wrap components có thể fail
<ErrorBoundary fallback={<ErrorState />}>
  <ArticleCard post={post} />
</ErrorBoundary>
```

---

## 🔄 Component Lifecycle

### Mount

```tsx
useEffect(() => {
  // Setup code
  return () => {
    // Cleanup code
  };
}, []);
```

### Update

```tsx
useEffect(() => {
  // Update logic
}, [dependency]);
```

### Unmount

```tsx
useEffect(() => {
  return () => {
    // Cleanup: remove listeners, cancel requests
  };
}, []);
```

---

## 💡 Tips & Tricks

### Tip 1: Conditional Rendering

```tsx
// Good: Early return
if (!data) return <EmptyState />;
return <Content data={data} />;

// Also good: Ternary
{
  data ? <Content data={data} /> : <EmptyState />;
}
```

### Tip 2: Event Handlers

```tsx
// Good: Named handlers
const handleClick = () => { /* ... */ };
<button onClick={handleClick}>Click</button>

// Avoid: Inline functions (causes re-renders)
<button onClick={() => { /* ... */ }}>Click</button>
```

### Tip 3: Styling

```tsx
// Good: Tailwind utilities
className="flex items-center gap-4"

// Avoid: Inline styles (unless dynamic)
style={{ display: 'flex', gap: '16px' }}
```

---

## 📋 Component Checklist

Khi tạo component mới, đảm bảo:

- [ ] TypeScript interface cho props
- [ ] Default props nếu cần
- [ ] Proper semantic HTML
- [ ] Accessibility attributes
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Loading states
- [ ] Error handling
- [ ] Comments tiếng Việt
- [ ] Reusable và composable

---

## 🎉 Summary

**Đã tạo 11 components**:

**Layout** (1):

- MainLayout

**Article** (1):

- ArticleCard

**Category** (1):

- CategoryCard

**Meme** (2):

- MemeGridItem
- MemeLightbox

**Skeleton** (3):

- ArticleListSkeleton
- CategoryGridSkeleton
- MemeGridSkeleton

**UI** (2):

- EmptyState
- Pagination

**Header/Footer** (2):

- Header (existing)
- Footer (existing)

Tất cả components đều:
✅ TypeScript type-safe
✅ Responsive design
✅ Dark mode support
✅ Accessibility compliant
✅ Reusable và maintainable
✅ Comments tiếng Việt

---

**Ready to use! 🚀**
