# PostCard Components

Bộ component PostCard được thiết kế để hiển thị bài viết với nhiều variant khác nhau, từ đầy đủ đến compact.

## Components

### 1. PostCard (Tối ưu)
Component chính để hiển thị bài viết, đã được tối ưu để gọn gàng hơn so với phiên bản gốc.

**Thay đổi chính:**
- Giảm padding từ `p-6` xuống `p-4`
- Giảm aspect ratio thumbnail từ `16/9` xuống `16/10`
- Gộp author, date, và stats vào một dòng
- Giảm số tags hiển thị từ 4 xuống 3
- Giảm line-clamp cho title và content
- Đơn giản hóa hover effects

```tsx
import { PostCard } from '~/components/post/PostCard';

<PostCard post={post} />
```

### 2. PostCardCompact
Component compact với 2 variants cho các trường hợp sử dụng khác nhau.

#### Variant: Horizontal (default)
Layout ngang, phù hợp cho sidebar hoặc related posts.

```tsx
import { PostCardCompact } from '~/components/post/PostCardCompact';

<PostCardCompact post={post} variant="horizontal" />
// hoặc
<PostCardCompact post={post} /> // default là horizontal
```

#### Variant: Minimal
Thiết kế tối giản nhất, phù hợp cho widget hoặc notification.

```tsx
<PostCardCompact post={post} variant="minimal" />
```

## Khi nào sử dụng?

### PostCard (Tối ưu)
- ✅ Trang chủ
- ✅ Danh sách bài viết chính
- ✅ Grid layout với 2-3 cột
- ✅ Khi cần hiển thị đầy đủ thông tin

### PostCardCompact - Horizontal
- ✅ Sidebar "Bài viết liên quan"
- ✅ Danh sách bài viết trong dashboard
- ✅ Search results
- ✅ Khi cần layout ngang

### PostCardCompact - Minimal
- ✅ Widget "Bài viết mới nhất"
- ✅ Notification list
- ✅ Mobile sidebar
- ✅ Khi cần hiển thị nhiều bài viết trong không gian nhỏ

## Demo

Xem demo tại: `/post-card-demo`

## Tính năng chung

Tất cả variants đều hỗ trợ:
- ✅ Responsive design
- ✅ Dark mode
- ✅ Hover effects
- ✅ BookmarkButton
- ✅ LikeButton
- ✅ RatingComponent
- ✅ Category badges
- ✅ Tags display
- ✅ Author info
- ✅ Stats (views, likes, comments)
- ✅ Thumbnail fallback

## Tối ưu hóa

### So với PostCard gốc:
- 📉 Giảm 30% chiều cao
- 📉 Giảm 25% padding
- 📉 Ít hover effects phức tạp hơn
- 📈 Tăng density thông tin
- 📈 Tốc độ render nhanh hơn

### Performance:
- Lazy loading cho thumbnails
- Optimized re-renders
- Minimal DOM nodes
- Efficient CSS classes
