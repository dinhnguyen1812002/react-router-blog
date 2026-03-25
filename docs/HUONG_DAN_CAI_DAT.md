# Hướng dẫn Cài đặt và Chạy Project

## Tổng quan
Project này sử dụng React Router v7 với Tailwind CSS để xây dựng 3 trang web với phong cách minimalist:
- Trang danh sách bài viết (Articles)
- Trang danh mục (Categories)
- Trang hiển thị Meme

## Yêu cầu hệ thống
- Node.js >= 18.x
- npm hoặc yarn hoặc bun

## Cài đặt

### 1. Clone repository (nếu chưa có)
```bash
git clone <repository-url>
cd blog-frontend
```

### 2. Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
# hoặc
bun install
```

### 3. Cấu hình môi trường
Tạo file `.env` trong thư mục gốc với nội dung:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Chạy Project

### Development Mode
```bash
npm run dev
# hoặc
yarn dev
# hoặc
bun dev
```

Server sẽ chạy tại: `http://localhost:5173`

### Build Production
```bash
npm run build
# hoặc
yarn build
# hoặc
bun run build
```

### Chạy Production Build
```bash
npm start
# hoặc
yarn start
# hoặc
bun start
```

## Cấu trúc 3 Trang Mới

### 1. Trang Danh sách Bài viết (`/articles`)
**File**: `app/routes/articles._index.tsx`

**Tính năng**:
- Layout dạng list dọc tương tự Medium
- Hiển thị thumbnail, tiêu đề, mô tả, tác giả, ngày đăng
- Tính toán thời gian đọc tự động
- Pagination với nút Previous/Next
- Filter theo category và sort theo mới nhất/xem nhiều nhất
- Hover effects mượt mà
- Responsive trên mọi thiết bị

**API Endpoint**: `GET /post?page=0&size=10&sortBy=newest`

**Cách sử dụng**:
- Truy cập: `http://localhost:5173/articles`
- Filter theo category: `http://localhost:5173/articles?category=technology`
- Sắp xếp: `http://localhost:5173/articles?sortBy=views`

### 2. Trang Danh mục (`/categories`)
**File**: `app/routes/category.index.tsx`

**Tính năng**:
- Grid layout responsive (1-4 cột tùy màn hình)
- Hiển thị icon/màu đại diện cho mỗi category
- Số lượng bài viết trong category
- Click để filter bài viết theo category
- Hover effects với animation
- Color bar phía trên mỗi card

**API Endpoint**: `GET /category`

**Cách sử dụng**:
- Truy cập: `http://localhost:5173/categories`
- Click vào category để xem bài viết thuộc category đó

### 3. Trang Meme (`/memes`)
**File**: `app/routes/memes._index.tsx`

**Tính năng**:
- Grid layout responsive cho hình ảnh
- Infinite scroll (tự động load khi scroll xuống)
- Lazy loading cho hình ảnh
- Lightbox khi click vào meme
- Nút refresh để load meme mới
- Hiển thị views và likes
- Hover effects với zoom icon

**API Endpoint**: `GET /meme?page=0`

**Cách sử dụng**:
- Truy cập: `http://localhost:5173/memes`
- Scroll xuống để tự động load thêm
- Click vào meme để xem full size trong lightbox
- Click nút "Làm mới" để refresh danh sách

## Thiết kế và Styling

### Màu sắc (Color Palette)
- Background: Gradient từ gray-50 đến white (dark mode: gray-900 đến gray-800)
- Text chính: gray-900 (dark: gray-100)
- Text phụ: gray-600 (dark: gray-400)
- Border: gray-200 (dark: gray-700)
- Accent: Sử dụng màu từ category.backgroundColor

### Typography
- Font: System font stack (mặc định của Tailwind)
- Heading: font-light hoặc font-semibold
- Body: font-normal
- Size: Responsive với sm:, lg:, xl: breakpoints

### Responsive Breakpoints
- Mobile: < 640px (1 cột)
- Tablet: 640px - 1024px (2 cột)
- Desktop: > 1024px (3-4 cột)

### Animations
- Hover scale: `hover:scale-105`
- Hover shadow: `hover:shadow-xl`
- Transitions: `transition-all duration-300`
- Smooth scroll behavior

## Cấu trúc File

```
app/
├── routes/
│   ├── articles._index.tsx    # Trang danh sách bài viết
│   ├── category.index.tsx     # Trang danh mục
│   └── memes._index.tsx       # Trang meme gallery
├── api/
│   ├── posts.ts               # API calls cho posts
│   ├── categories.ts          # API calls cho categories
│   └── memes.ts               # API calls cho memes
├── types/
│   └── index.ts               # TypeScript type definitions
└── components/
    └── ui/                    # Reusable UI components
```

## Tính năng Kỹ thuật

### 1. Server-Side Rendering (SSR)
Tất cả 3 trang đều sử dụng loader function để fetch dữ liệu từ server trước khi render, giúp:
- SEO tốt hơn
- Performance tốt hơn
- User experience mượt mà hơn

### 2. Lazy Loading
- Hình ảnh sử dụng `loading="lazy"` attribute
- Infinite scroll cho memes page

### 3. Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), lg (1024px), xl (1280px)
- Flexible grid system

### 4. Dark Mode Support
- Tự động detect system preference
- Toggle manual (nếu có component)
- Consistent colors across themes

## Troubleshooting

### Lỗi kết nối API
Kiểm tra:
1. Backend server đã chạy chưa
2. URL trong `.env` đúng chưa
3. CORS đã được cấu hình chưa

### Hình ảnh không hiển thị
Kiểm tra:
1. URL của thumbnail/memeUrl có hợp lệ không
2. CORS policy cho images
3. Network tab trong DevTools

### Infinite scroll không hoạt động
Kiểm tra:
1. Browser có hỗ trợ Intersection Observer không
2. Console có lỗi JavaScript không
3. API có trả về đúng pagination data không

## Tối ưu hóa Performance

### 1. Image Optimization
- Sử dụng lazy loading
- Compress images trước khi upload
- Sử dụng CDN nếu có thể

### 2. Code Splitting
React Router tự động code split theo routes

### 3. Caching
- Browser caching cho static assets
- API response caching (nếu backend hỗ trợ)

## Liên hệ và Hỗ trợ
Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console logs
2. Xem network requests trong DevTools
3. Đọc error messages cẩn thận

## License
[Thêm license của bạn ở đây]
