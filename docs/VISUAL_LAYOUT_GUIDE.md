# 🎨 Visual Layout Guide - Hướng dẫn Trực quan

## Tổng quan Layout của 3 Trang

---

## 1️⃣ Trang Articles (`/articles`)

### Desktop Layout (> 1024px)

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER (Sticky)                      │
│  Logo    Articles  Categories  About      [Search] [User]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Bài viết                                          │     │
│  │  Khám phá những bài viết thú vị và bổ ích         │     │
│  │                                                    │     │
│  │  [Sort: Mới nhất ▼]                               │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  ┌──────────┐  [Tech] [React]                     │     │
│  │  │          │  Building Modern Web Apps            │     │
│  │  │  Image   │  Learn how to build scalable...     │     │
│  │  │  192x128 │  👤 John • 2 giờ trước • 5 phút đọc │     │
│  │  │          │  👁 1.2k  ❤ 234                      │     │
│  │  └──────────┘                                      │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  ┌──────────┐  [Design]                           │     │
│  │  │          │  UI/UX Best Practices                │     │
│  │  │  Image   │  Discover the secrets of...         │     │
│  │  │          │  👤 Jane • 5 giờ trước • 8 phút đọc  │     │
│  │  └──────────┘  👁 856  ❤ 123                       │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│              [Trước]  1  2  [3]  4  5  [Sau]                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                         FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 640px)

```
┌──────────────────────────┐
│  HEADER                  │
│  ☰  Logo  [Search] [👤]  │
├──────────────────────────┤
│                          │
│  Bài viết                │
│  [Sort: Mới nhất ▼]      │
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │      Image         │  │
│  │      Full Width    │  │
│  │                    │  │
│  ├────────────────────┤  │
│  │ [Tech] [React]     │  │
│  │ Building Modern... │  │
│  │ Learn how to...    │  │
│  │ 👤 John • 2h       │  │
│  │ 👁 1.2k  ❤ 234     │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │      Image         │  │
│  │ ...                │  │
│  └────────────────────┘  │
│                          │
│  [Trước] 1 2 [3] [Sau]  │
│                          │
├──────────────────────────┤
│  FOOTER                  │
└──────────────────────────┘
```

---

## 2️⃣ Trang Categories (`/categories`)

### Desktop Layout (> 1280px) - 4 Columns

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Danh mục                                                    │
│  Khám phá nội dung theo chủ đề yêu thích của bạn            │
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │──────│  │──────│  │──────│  │──────│  ← Color Bar       │
│  │      │  │      │  │      │  │      │                     │
│  │ [📄] │  │ [💻] │  │ [🎨] │  │ [📱] │  ← Icon            │
│  │      │  │      │  │      │  │      │                     │
│  │ Tech │  │ Code │  │Design│  │Mobile│  ← Title           │
│  │      │  │      │  │      │  │      │                     │
│  │ Desc │  │ Desc │  │ Desc │  │ Desc │  ← Description     │
│  │ ...  │  │ ...  │  │ ...  │  │ ...  │                     │
│  │      │  │      │  │      │  │      │                     │
│  │ Xem→ │  │ Xem→ │  │ Xem→ │  │ Xem→ │  ← Footer          │
│  └──────┘  └──────┘  └──────┘  └──────┘                    │
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │ AI   │  │ Data │  │ Cloud│  │ Web  │                     │
│  └──────┘  └──────┘  └──────┘  └──────┘                    │
│                                                              │
│  ← Về trang chủ                                             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                         FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

### Tablet Layout (640-1024px) - 2 Columns

```
┌────────────────────────────────┐
│          HEADER                │
├────────────────────────────────┤
│                                │
│  Danh mục                      │
│                                │
│  ┌──────────┐  ┌──────────┐   │
│  │──────────│  │──────────│   │
│  │  [📄]    │  │  [💻]    │   │
│  │  Tech    │  │  Code    │   │
│  │  Desc... │  │  Desc... │   │
│  │  Xem →   │  │  Xem →   │   │
│  └──────────┘  └──────────┘   │
│                                │
│  ┌──────────┐  ┌──────────┐   │
│  │  Design  │  │  Mobile  │   │
│  └──────────┘  └──────────┘   │
│                                │
├────────────────────────────────┤
│          FOOTER                │
└────────────────────────────────┘
```

### Mobile Layout (< 640px) - 1 Column

```
┌──────────────────────┐
│  HEADER              │
├──────────────────────┤
│                      │
│  Danh mục            │
│                      │
│  ┌────────────────┐  │
│  │────────────────│  │
│  │     [📄]       │  │
│  │   Technology   │  │
│  │   Description  │  │
│  │   Xem →        │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │   Programming  │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │     Design     │  │
│  └────────────────┘  │
│                      │
├──────────────────────┤
│  FOOTER              │
└──────────────────────┘
```

---

## 3️⃣ Trang Memes (`/memes`)

### Desktop Layout (> 1280px) - 4 Columns

```
┌─────────────────────────────────────────────────────────────┐
│                    HEADER (Sticky)                           │
│  Logo  Articles  Categories  About    [🔄 Làm mới] [User]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Meme Gallery                                                │
│  Bộ sưu tập meme vui nhộn và sáng tạo                       │
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │      │  │      │  │      │  │      │                     │
│  │ Meme │  │ Meme │  │ Meme │  │ Meme │                     │
│  │  1   │  │  2   │  │  3   │  │  4   │                     │
│  │      │  │      │  │      │  │      │                     │
│  │Title │  │Title │  │Title │  │Title │                     │
│  └──────┘  └──────┘  └──────┘  └──────┘                    │
│                                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │ Meme │  │ Meme │  │ Meme │  │ Meme │                     │
│  │  5   │  │  6   │  │  7   │  │  8   │                     │
│  └──────┘  └──────┘  └──────┘  └──────┘                    │
│                                                              │
│  [🔄 Đang tải...]  ← Infinite Scroll Trigger                │
│                                                              │
│  Bạn đã xem hết tất cả meme                                 │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                         FOOTER                               │
└─────────────────────────────────────────────────────────────┘
```

### Lightbox View

```
┌─────────────────────────────────────────────────────────────┐
│                                                         [X]  │
│                                                              │
│                                                              │
│              ┌─────────────────────────┐                    │
│              │                         │                    │
│              │                         │                    │
│              │     Full Size Image     │                    │
│              │                         │                    │
│              │                         │                    │
│              └─────────────────────────┘                    │
│              ┌─────────────────────────┐                    │
│              │ Meme Title              │                    │
│              │ Description here...     │                    │
│              │ 👁 1.2k  ❤ 234          │                    │
│              └─────────────────────────┘                    │
│                                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
     ← Click backdrop để đóng
```

### Mobile Layout (< 640px) - 1 Column

```
┌──────────────────────┐
│  HEADER              │
│  [🔄 Làm mới]        │
├──────────────────────┤
│                      │
│  Meme Gallery        │
│                      │
│  ┌────────────────┐  │
│  │                │  │
│  │     Meme 1     │  │
│  │                │  │
│  │  Title         │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │     Meme 2     │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │     Meme 3     │  │
│  └────────────────┘  │
│                      │
│  [🔄 Loading...]     │
│                      │
│  ↓ Scroll to load    │
│                      │
├──────────────────────┤
│  FOOTER              │
└──────────────────────┘
```

---

## 🎨 Component Anatomy

### ArticleCard Anatomy

```
┌─────────────────────────────────────────────┐
│  ┌──────────┐  [Category Badge]            │ ← Categories
│  │          │                               │
│  │  Image   │  Article Title Here          │ ← Title (2 lines max)
│  │  192x128 │  This is the excerpt that    │ ← Excerpt (2 lines max)
│  │          │  describes the article...    │
│  │          │                               │
│  └──────────┘  👤 Author • 2h • 5 min      │ ← Meta info
│                 👁 1.2k  ❤ 234              │ ← Stats
└─────────────────────────────────────────────┘
     ↑ Hover: Shadow + Border + Image Scale
```

### CategoryCard Anatomy

```
┌─────────────────────┐
│─────────────────────│ ← Color Bar (8px)
│                     │
│     ┌─────┐         │
│     │ [📄]│         │ ← Icon (64x64)
│     └─────┘         │    Background: color + 20% opacity
│                     │
│  Category Name      │ ← Title (font-semibold)
│                     │
│  This is a short    │ ← Description (2 lines max)
│  description...     │
│                     │
│ ─────────────────── │ ← Border separator
│  Xem bài viết    →  │ ← Footer with arrow
└─────────────────────┘
     ↑ Hover: Lift + Shadow + Icon rotate
```

### MemeGridItem Anatomy

```
┌─────────────────┐
│                 │
│                 │
│   Meme Image    │ ← Square (1:1 ratio)
│   (Hover: Zoom) │
│                 │
│                 │
├─────────────────┤
│ Meme Title      │ ← Title (2 lines max)
│ Description...  │ ← Description (2 lines max)
└─────────────────┘
     ↑ Hover: Overlay + Zoom Icon + Stats
```

---

## 🎯 Interaction Flows

### Articles Page Flow

```
User lands on /articles
    ↓
Load posts (page 0, size 10)
    ↓
Display list with pagination
    ↓
User clicks "Sau" button
    ↓
URL updates: ?page=1
    ↓
Load page 1 posts
    ↓
Display new posts
    ↓
User clicks article
    ↓
Navigate to /articles/:slug
```

### Categories Page Flow

```
User lands on /categories
    ↓
Load all categories
    ↓
Display grid (1-4 columns)
    ↓
User hovers category
    ↓
Show hover effects (lift, shadow)
    ↓
User clicks category
    ↓
Navigate to /articles?category=slug
    ↓
Articles filtered by category
```

### Memes Page Flow

```
User lands on /memes
    ↓
Load memes (page 0)
    ↓
Display grid
    ↓
User scrolls down
    ↓
Intersection Observer triggers
    ↓
Load page 1 (auto)
    ↓
Append to grid
    ↓
Repeat until last = true
    ↓
Show "Đã xem hết" message
    ↓
User clicks meme
    ↓
Open lightbox
    ↓
User clicks backdrop or X
    ↓
Close lightbox
```

---

## 🎨 Visual States

### Loading State

```
┌─────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ ← Shimmer animation
│ ▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │
│ ▓▓▓▓  ▓▓▓▓  ▓▓▓▓   │
└─────────────────────┘
```

### Empty State

```
┌─────────────────────┐
│                     │
│      ┌─────┐        │
│      │ [📄]│        │ ← Icon
│      └─────┘        │
│                     │
│  Không có dữ liệu   │ ← Title
│                     │
│  Chưa có bài viết   │ ← Description
│  nào được đăng      │
│                     │
│   [Thử lại]         │ ← Action (optional)
│                     │
└─────────────────────┘
```

### Hover State (Category Card)

```
Before Hover:
┌─────────────────┐
│─────────────────│
│   [📄]          │
│   Category      │
│   Description   │
│   Xem →         │
└─────────────────┘

During Hover:
┌─────────────────┐  ← Lift up 4px
│─────────────────│
│   [📄]          │  ← Icon scale + rotate
│   Category      │  ← Text color change
│   Description   │
│   Xem  →        │  ← Arrow moves right
└─────────────────┘
  └─ Shadow 2xl
  └─ Gradient overlay
```

---

## 📐 Spacing System

### Container Spacing

```
Max Width:
- Articles:   max-w-4xl  (896px)
- Categories: max-w-7xl  (1280px)
- Memes:      max-w-7xl  (1280px)

Padding:
- Mobile:  px-4  (16px)
- Tablet:  px-6  (24px)
- Desktop: px-8  (32px)
```

### Grid Spacing

```
Gap between items:
- gap-6 (24px) - Default
- gap-8 (32px) - Larger spacing

Section spacing:
- py-8  (32px top/bottom)
- py-12 (48px top/bottom)
```

### Card Spacing

```
Internal padding:
- p-4 (16px) - Compact
- p-6 (24px) - Default
- p-8 (32px) - Spacious

Gap between elements:
- gap-2 (8px)  - Tight
- gap-4 (16px) - Normal
- gap-6 (24px) - Loose
```

---

## 🎭 Animation Timings

### Hover Animations

```
Image Scale:
- Duration: 300ms
- Transform: scale(1) → scale(1.05)
- Easing: ease-out

Shadow:
- Duration: 300ms
- Shadow: none → shadow-xl
- Easing: ease-out

Border:
- Duration: 300ms
- Color: gray-200 → gray-300
- Easing: ease-out
```

### Page Transitions

```
Fade In:
- Duration: 400ms
- Opacity: 0 → 1
- Transform: translateY(10px) → translateY(0)
- Easing: ease-out
```

### Lightbox Animations

```
Backdrop:
- Duration: 200ms
- Opacity: 0 → 1
- Backdrop-blur: 0 → 8px

Content:
- Duration: 300ms
- Opacity: 0 → 1
- Transform: translateY(20px) scale(0.95) → translateY(0) scale(1)
- Easing: ease-out
```

---

## 🎨 Color Usage

### Background Colors

```
Light Mode:
- Page:  bg-linear-to-b from-gray-50 to-white
- Card:  bg-white
- Hover: bg-gray-100

Dark Mode:
- Page:  bg-linear-to-b from-gray-900 to-gray-800
- Card:  bg-gray-800
- Hover: bg-gray-700
```

### Text Colors

```
Light Mode:
- Primary:   text-gray-900
- Secondary: text-gray-600
- Muted:     text-gray-500

Dark Mode:
- Primary:   text-gray-100
- Secondary: text-gray-400
- Muted:     text-gray-500
```

### Border Colors

```
Light Mode:
- Default: border-gray-200
- Hover:   border-gray-300

Dark Mode:
- Default: border-gray-700
- Hover:   border-gray-600
```

---

## 📱 Responsive Patterns

### Stack to Row

```
Mobile:
flex flex-col

Desktop:
sm:flex-row
```

### Grid Columns

```
Mobile → Desktop:
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

### Hide/Show

```
Hide on mobile, show on desktop:
hidden md:block

Show on mobile, hide on desktop:
block md:hidden
```

### Responsive Sizes

```
Text:
text-xl sm:text-2xl lg:text-3xl

Spacing:
p-4 sm:p-6 lg:p-8

Width:
w-full sm:w-48 lg:w-64
```

---

## 🎯 Key Measurements

### Articles Page

```
Container: max-w-4xl (896px)
Card height: auto (content-based)
Thumbnail: 192x128 (desktop), full width (mobile)
Gap: 32px between cards
```

### Categories Page

```
Container: max-w-7xl (1280px)
Card height: auto (content-based)
Icon: 64x64
Color bar: 8px height
Gap: 24px between cards
```

### Memes Page

```
Container: max-w-7xl (1280px)
Item: aspect-square (1:1)
Gap: 24px between items
Lightbox: max-w-5xl, max-h-90vh
```

---

## 🎨 Visual Hierarchy

### Typography Scale

```
Level 1 (Page Title):
- Size: text-3xl sm:text-4xl (36-48px)
- Weight: font-light
- Color: text-gray-900 dark:text-gray-100

Level 2 (Card Title):
- Size: text-xl sm:text-2xl (20-32px)
- Weight: font-semibold
- Color: text-gray-900 dark:text-gray-100

Level 3 (Section Title):
- Size: text-lg (18px)
- Weight: font-medium
- Color: text-gray-900 dark:text-gray-100

Body Text:
- Size: text-sm (14px)
- Weight: font-normal
- Color: text-gray-600 dark:text-gray-400

Small Text:
- Size: text-xs (12px)
- Weight: font-normal
- Color: text-gray-500 dark:text-gray-500
```

---

## 🎯 Z-Index Layers

```
Layer 0: Base content (z-0)
Layer 1: Sticky header (z-10)
Layer 2: Dropdowns (z-20)
Layer 3: Modals/Lightbox (z-50)
```

---

## 📊 Performance Considerations

### Image Loading

```
Strategy: Lazy loading
Attribute: loading="lazy"
Benefit: Faster initial page load
```

### Infinite Scroll

```
Strategy: Intersection Observer
Threshold: 0.1 (10% visible)
Benefit: Efficient, no scroll listeners
```

### Code Splitting

```
Strategy: Route-based splitting
Tool: React Router automatic
Benefit: Smaller initial bundle
```

---

## ✅ Checklist Sử dụng

### Khi implement trang mới:

- [ ] Sử dụng MainLayout wrapper
- [ ] Thêm loader function cho SSR
- [ ] Implement loading state với skeleton
- [ ] Thêm empty state
- [ ] Ensure responsive design
- [ ] Add dark mode support
- [ ] Include hover effects
- [ ] Add accessibility attributes
- [ ] Test trên multiple devices
- [ ] Verify performance

---

**Visual guide này giúp hiểu rõ layout và structure của 3 trang! 🎨**
