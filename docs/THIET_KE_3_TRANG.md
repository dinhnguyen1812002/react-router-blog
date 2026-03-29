# Tài liệu Thiết kế 3 Trang Web

## Tổng quan Thiết kế

### Phong cách: Minimalist & Modern

- **Nguyên tắc**: Less is more - Ít nhưng chất
- **Màu sắc**: Palette trung tính với gray scale
- **Typography**: Clean, readable, với hierarchy rõ ràng
- **Spacing**: Generous whitespace để tạo cảm giác thoáng đãng
- **Animations**: Subtle, smooth, không quá phô trương

---

## 1. Trang Danh sách Bài viết (Articles)

### Đường dẫn

`/articles`

### Mô tả

Trang hiển thị danh sách tất cả bài viết với layout dọc tương tự Medium, tối ưu cho việc đọc và duyệt nội dung.

### Layout Structure

```
┌─────────────────────────────────────┐
│  Header (Sticky)                    │
│  - Title: "Bài viết"                │
│  - Filter & Sort Controls           │
├─────────────────────────────────────┤
│  Article Card 1                     │
│  ┌──────────┬────────────────────┐  │
│  │ Thumb    │ Title              │  │
│  │ nail     │ Excerpt            │  │
│  │          │ Author + Meta      │  │
│  └──────────┴────────────────────┘  │
├─────────────────────────────────────┤
│  Article Card 2                     │
├─────────────────────────────────────┤
│  ...                                │
├─────────────────────────────────────┤
│  Pagination Controls                │
└─────────────────────────────────────┘
```

### Components Chi tiết

#### Article Card

- **Thumbnail**:
  - Desktop: 192px x 128px (w-48 h-32)
  - Mobile: Full width, 192px height
  - Hover: Scale 105% với smooth transition
- **Content Area**:
  - Categories badges: Rounded-full, màu từ API
  - Title: text-xl sm:text-2xl, font-semibold, line-clamp-2
  - Excerpt: text-sm, text-gray-600, line-clamp-2
- **Meta Information**:
  - Avatar tác giả (6x6, rounded-full)
  - Username
  - Thời gian đăng (relative time với date-fns)
  - Thời gian đọc (tính từ word count)
  - Views count
  - Likes count

#### Pagination

- Style: Rounded-full buttons
- Active page: bg-gray-900, text-white
- Disabled state: opacity-50
- Hiển thị tối đa 5 số trang

### Responsive Behavior

- **Mobile (< 640px)**:
  - Stack vertical
  - Thumbnail full width
  - Single column layout
- **Tablet (640px - 1024px)**:
  - Thumbnail bên trái
  - Content bên phải
- **Desktop (> 1024px)**:
  - Max-width: 1024px (4xl)
  - Centered layout

### Interactions

1. **Hover trên card**:
   - Shadow tăng lên (shadow-xl)
   - Border color đậm hơn
   - Thumbnail scale 105%
2. **Click**: Navigate đến `/articles/:slug`

3. **Filter**: Update URL params và reload data

### API Integration

```typescript
// Endpoint
GET /post?page=0&size=10&sortBy=newest&categorySlug=tech

// Response
{
  content: Post[],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}
```

---

## 2. Trang Danh mục (Categories)

### Đường dẫn

`/categories`

### Mô tả

Trang hiển thị tất cả categories dạng grid, mỗi category là một card với màu sắc riêng biệt.

### Layout Structure

```
┌─────────────────────────────────────┐
│  Header                             │
│  - Title: "Danh mục"                │
│  - Description                      │
├─────────────────────────────────────┤
│  ┌────────┬────────┬────────┬────┐  │
│  │Category│Category│Category│Cat │  │
│  │ Card 1 │ Card 2 │ Card 3 │ 4  │  │
│  └────────┴────────┴────────┴────┘  │
│  ┌────────┬────────┬────────┬────┐  │
│  │Category│Category│Category│Cat │  │
│  │ Card 5 │ Card 6 │ Card 7 │ 8  │  │
│  └────────┴────────┴────────┴────┘  │
└─────────────────────────────────────┘
```

### Components Chi tiết

#### Category Card

- **Color Bar**:
  - Height: 8px (h-2)
  - Color: Từ category.backgroundColor
- **Icon Area**:
  - Size: 64x64 (w-16 h-16)
  - Background: category.backgroundColor với opacity 20%
  - Icon: FileText từ lucide-react
- **Content**:
  - Title: text-xl, font-semibold
  - Description: text-sm, line-clamp-2
- **Footer**:
  - "Xem bài viết" text
  - ChevronRight icon
  - Border-top separator

#### Grid System

- **Mobile**: 1 column
- **Tablet**: 2 columns (sm:grid-cols-2)
- **Desktop**: 3 columns (lg:grid-cols-3)
- **Large Desktop**: 4 columns (xl:grid-cols-4)
- Gap: 24px (gap-6)

### Responsive Behavior

Grid tự động điều chỉnh số cột dựa trên viewport width.

### Interactions

1. **Hover trên card**:
   - Shadow tăng (shadow-2xl)
   - Translate lên -4px
   - Border color đậm hơn
   - ChevronRight icon dịch sang phải
   - Overlay gradient xuất hiện
2. **Click**: Navigate đến `/articles?category={slug}`

### API Integration

```typescript
// Endpoint
GET /category

// Response
Category[] = [
  {
    id: number,
    category: string,
    slug: string,
    backgroundColor: string,
    description: string
  }
]
```

---

## 3. Trang Meme Gallery

### Đường dẫn

`/memes`

### Mô tả

Trang hiển thị meme dạng grid với infinite scroll và lightbox viewer.

### Layout Structure

```
┌─────────────────────────────────────┐
│  Header (Sticky)                    │
│  - Title + Refresh Button           │
├─────────────────────────────────────┤
│  ┌────┬────┬────┬────┐              │
│  │Meme│Meme│Meme│Meme│              │
│  │ 1  │ 2  │ 3  │ 4  │              │
│  └────┴────┴────┴────┘              │
│  ┌────┬────┬────┬────┐              │
│  │Meme│Meme│Meme│Meme│              │
│  │ 5  │ 6  │ 7  │ 8  │              │
│  └────┴────┴────┴────┘              │
│  [Infinite Scroll Trigger]          │
│  Loading...                         │
└─────────────────────────────────────┘
```

### Components Chi tiết

#### Meme Card

- **Container**:
  - Aspect ratio: 1:1 (aspect-square)
  - Rounded corners: rounded-xl
  - Border: border-gray-200
- **Image**:
  - Object-fit: cover
  - Lazy loading: loading="lazy"
  - Hover: scale-110
- **Hover Overlay**:
  - Background: black/40
  - ZoomIn icon ở giữa
  - Stats (views, likes) ở dưới
- **Info Section**:
  - Title: font-medium, line-clamp-2
  - Description: text-sm, line-clamp-2

#### Lightbox Modal

- **Backdrop**:
  - Fixed full screen
  - Background: black/90 với backdrop-blur
  - z-index: 50
- **Content**:
  - Max-width: 5xl
  - Max-height: 90vh
  - Scrollable nếu cần
  - Close button ở góc trên phải
- **Image**:
  - Full width
  - Auto height
  - Rounded corners

#### Infinite Scroll

- Sử dụng Intersection Observer API
- Trigger khi scroll đến 10% cuối trang
- Auto load page tiếp theo
- Loading indicator khi đang fetch

#### Refresh Button

- Icon: RefreshCw với animation spin khi loading
- Position: Top right của header
- Style: Rounded-full, bg-gray-900

### Grid System

- **Mobile**: 1 column
- **Tablet**: 2 columns (sm:grid-cols-2)
- **Desktop**: 3 columns (lg:grid-cols-3)
- **Large Desktop**: 4 columns (xl:grid-cols-4)
- Gap: 24px (gap-6)

### Responsive Behavior

- Grid columns tự động điều chỉnh
- Lightbox responsive với padding
- Touch-friendly trên mobile

### Interactions

1. **Click vào meme**: Mở lightbox
2. **Click backdrop**: Đóng lightbox
3. **Click close button**: Đóng lightbox
4. **Scroll xuống**: Auto load more
5. **Click refresh**: Reload từ đầu

### API Integration

```typescript
// Endpoint
GET /meme?page=0

// Response
{
  content: Meme[],
  pageNumber: number,
  pageSize: number,
  totalElements: number,
  totalPages: number,
  last: boolean
}

// Meme Object
{
  id: string,
  name: string,
  description: string,
  memeUrl: string,
  slug: string,
  views?: number,
  likes?: number
}
```

---

## Tailwind CSS Classes Chính

### Layout

- `max-w-4xl`, `max-w-7xl`: Container max width
- `mx-auto`: Center horizontally
- `px-4 sm:px-6 lg:px-8`: Responsive padding
- `py-8`, `py-12`: Vertical spacing

### Grid

- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- `gap-6`: Grid gap

### Typography

- `text-3xl sm:text-4xl`: Responsive font size
- `font-light`, `font-semibold`: Font weights
- `line-clamp-2`: Truncate text

### Colors

- `bg-gray-50 dark:bg-gray-900`: Background
- `text-gray-900 dark:text-gray-100`: Text
- `border-gray-200 dark:border-gray-700`: Borders

### Effects

- `hover:shadow-xl`: Shadow on hover
- `hover:scale-105`: Scale on hover
- `transition-all duration-300`: Smooth transitions
- `backdrop-blur-sm`: Blur effect

### Utilities

- `rounded-lg`, `rounded-xl`, `rounded-full`: Border radius
- `overflow-hidden`: Clip content
- `cursor-pointer`: Pointer cursor

---

## Best Practices Đã Áp dụng

### 1. Performance

✅ Lazy loading cho images
✅ Pagination/Infinite scroll
✅ Efficient re-renders với React hooks
✅ Code splitting tự động

### 2. Accessibility

✅ Semantic HTML (article, nav, button)
✅ Alt text cho images
✅ Keyboard navigation support
✅ Focus states rõ ràng

### 3. SEO

✅ Server-side rendering
✅ Semantic markup
✅ Meta tags (có thể thêm)
✅ Clean URLs

### 4. User Experience

✅ Loading states
✅ Empty states
✅ Error handling
✅ Smooth animations
✅ Responsive design

### 5. Code Quality

✅ TypeScript cho type safety
✅ Comments bằng tiếng Việt
✅ Consistent naming conventions
✅ Reusable components
✅ Clean code structure

---

## Customization Guide

### Thay đổi màu sắc

Chỉnh sửa trong Tailwind classes:

```tsx
// Từ
className = "bg-gray-900";

// Sang
className = "bg-blue-600";
```

### Thay đổi số items per page

```typescript
// Trong loader function
const params: GetPostsParams = {
  page,
  size: 20, // Thay đổi từ 10 sang 20
  sortBy,
};
```

### Thay đổi grid columns

```tsx
// Từ
className = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

// Sang
className = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
```

### Thêm animations

```tsx
// Thêm vào className
className = "animate-fade-in";

// Hoặc custom animation trong tailwind.config.js
```

---

## Testing Checklist

### Functional Testing

- [ ] Articles load correctly
- [ ] Pagination works
- [ ] Sorting works
- [ ] Category filter works
- [ ] Meme infinite scroll works
- [ ] Lightbox opens/closes
- [ ] Refresh button works

### Responsive Testing

- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Large Desktop (1440px)

### Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Performance Testing

- [ ] Images load efficiently
- [ ] No layout shifts
- [ ] Smooth scrolling
- [ ] Fast page transitions

---

## Future Enhancements

### Có thể thêm

1. **Search functionality**: Tìm kiếm bài viết
2. **Tag filtering**: Filter theo tags
3. **Bookmarking**: Lưu bài viết yêu thích
4. **Share buttons**: Chia sẻ lên social media
5. **View transitions**: Page transitions mượt hơn
6. **Skeleton loading**: Loading states đẹp hơn
7. **Image optimization**: WebP, responsive images
8. **PWA support**: Offline capability

### Tối ưu hóa

1. **Virtual scrolling**: Cho danh sách dài
2. **Image CDN**: Tối ưu delivery
3. **Caching strategy**: Redis hoặc browser cache
4. **Prefetching**: Prefetch next page

---

## Technical Stack

### Frontend

- **Framework**: React Router v7
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Date formatting**: date-fns
- **Type safety**: TypeScript

### Features

- Server-Side Rendering (SSR)
- Client-Side Navigation
- Optimistic UI updates
- Error boundaries
- Loading states

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid & Flexbox
- Intersection Observer API

---

## Kết luận

3 trang web đã được thiết kế với:

- ✅ Phong cách minimalist, hiện đại
- ✅ Responsive hoàn toàn
- ✅ Performance tối ưu
- ✅ User experience mượt mà
- ✅ Code clean và maintainable
- ✅ Comments tiếng Việt đầy đủ

Tất cả đều sẵn sàng để chạy và có thể customize dễ dàng theo nhu cầu.
