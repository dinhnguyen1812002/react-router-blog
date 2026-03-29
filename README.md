# Blog Platform Frontend

Frontend cho Blog Platform được xây dựng với React Router v7, TypeScript và TailwindCSS.

## Tính năng

- 🚀 Server-side rendering với React Router v7
- 🎨 UI hiện đại với TailwindCSS
- 🔐 Xác thực người dùng với JWT
- 📱 Responsive design
- 🔍 Tìm kiếm và lọc bài viết
- 📝 Hỗ trợ Rich Text và Markdown
- 🖼️ Chia sẻ memes
- ⚡ State management với Zustand
- 🔄 Data fetching với TanStack Query

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
npm run install-deps
```

2. Chạy development server:

```bash
npm run dev
```

3. Build cho production:

```bash
npm run build
npm start
```

## Cấu trúc thư mục

```
app/
├── api/              # API services
├── components/       # React components
│   ├── ui/          # UI components
│   ├── layout/      # Layout components
│   ├── post/        # Post-related components
│   └── auth/        # Auth components
├── config/          # Configuration files
├── store/           # Zustand stores
├── types/           # TypeScript types
└── routes/          # Route components
```

## API Integration

Frontend kết nối với Spring Boot backend qua:

- Base URL: `http://localhost:8080/api/v1`
- Authentication: Cookie-based với JWT
- File uploads: Multipart form data

## Các trang chính

- `/` - Trang chủ
- `/posts` - Danh sách bài viết
- `/posts/:slug` - Chi tiết bài viết
- `/memes` - Trang memes
- `/login` - Đăng nhập
- `/register` - Đăng ký

## Development

Để phát triển thêm tính năng:

1. Tạo components trong `app/components/`
2. Thêm API services trong `app/api/`
3. Tạo routes mới trong `app/routes/`
4. Cập nhật types trong `app/types/`
