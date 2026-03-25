# Hướng dẫn Demo và Testing

## 🚀 Chạy Project

### Bước 1: Cài đặt Dependencies
```bash
npm install
```

### Bước 2: Cấu hình Environment
Đảm bảo file `.env` có:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Bước 3: Chạy Development Server
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5173`

---

## 🧪 Testing Scenarios

### Scenario 1: Test Trang Articles

#### Test Case 1.1: Load danh sách bài viết
1. Truy cập: `http://localhost:5173/articles`
2. **Expected**: Hiển thị danh sách bài viết với pagination
3. **Check**:
   - ✅ Thumbnail hiển thị đúng
   - ✅ Title, excerpt, author info
   - ✅ Reading time được tính
   - ✅ Stats (views, likes) hiển thị

#### Test Case 1.2: Pagination
1. Click nút "Sau" ở cuối trang
2. **Expected**: Load trang 2, URL thay đổi thành `?page=1`
3. **Check**:
   - ✅ Bài viết mới được load
   - ✅ Số trang active thay đổi
   - ✅ Nút "Trước" được enable

#### Test Case 1.3: Sort
1. Chọn "Xem nhiều nhất" trong dropdown
2. **Expected**: Bài viết được sắp xếp theo views
3. **Check**:
   - ✅ URL có `?sortBy=views`
   - ✅ Bài viết có views cao ở trên
   - ✅ Reset về page 0

#### Test Case 1.4: Filter by Category
1. Click vào category badge trên bài viết
2. **Expected**: Navigate đến `/articles?category={slug}`
3. **Check**:
   - ✅ Chỉ hiển thị bài viết của category đó
   - ✅ URL params đúng

#### Test Case 1.5: Hover Effects
1. Hover chuột lên article card
2. **Expected**: 
   - ✅ Shadow tăng lên
   - ✅ Border đậm hơn
   - ✅ Thumbnail zoom nhẹ
   - ✅ Transition mượt mà

#### Test Case 1.6: Responsive
1. Resize browser window
2. **Check**:
   - ✅ Mobile (< 640px): Stack vertical
   - ✅ Tablet (640-1024px): Thumbnail left
   - ✅ Desktop (> 1024px): Max-width centered

---

### Scenario 2: Test Trang Categories

#### Test Case 2.1: Load categories
1. Truy cập: `http://localhost:5173/categories`
2. **Expected**: Grid hiển thị tất cả categories
3. **Check**:
   - ✅ Color bar phía trên mỗi card
   - ✅ Icon với background màu
   - ✅ Title và description
   - ✅ Footer với arrow icon

#### Test Case 2.2: Grid Responsive
1. Resize browser window
2. **Check**:
   - ✅ Mobile: 1 column
   - ✅ Tablet: 2 columns
   - ✅ Desktop: 3 columns
   - ✅ Large: 4 columns

#### Test Case 2.3: Hover Effects
1. Hover lên category card
2. **Expected**:
   - ✅ Shadow tăng lên (shadow-2xl)
   - ✅ Card nâng lên (-translate-y-1)
   - ✅ Arrow icon dịch sang phải
   - ✅ Overlay gradient xuất hiện

#### Test Case 2.4: Navigation
1. Click vào category card
2. **Expected**: Navigate đến `/articles?category={slug}`
3. **Check**:
   - ✅ URL đúng
   - ✅ Articles được filter

#### Test Case 2.5: Empty State
1. Nếu không có category nào
2. **Expected**: Hiển thị message "Chưa có danh mục nào"

---

### Scenario 3: Test Trang Memes

#### Test Case 3.1: Load memes
1. Truy cập: `http://localhost:5173/memes`
2. **Expected**: Grid hiển thị memes
3. **Check**:
   - ✅ Images load với lazy loading
   - ✅ Grid responsive
   - ✅ Hover overlay với zoom icon

#### Test Case 3.2: Infinite Scroll
1. Scroll xuống cuối trang
2. **Expected**: Tự động load thêm memes
3. **Check**:
   - ✅ Loading indicator xuất hiện
   - ✅ Memes mới được append
   - ✅ Không bị duplicate
   - ✅ Smooth loading

#### Test Case 3.3: Lightbox
1. Click vào một meme
2. **Expected**: Lightbox mở với full size image
3. **Check**:
   - ✅ Backdrop blur
   - ✅ Image hiển thị full size
   - ✅ Info section với title, description
   - ✅ Stats (views, likes)

#### Test Case 3.4: Close Lightbox
1. Click backdrop hoặc nút X
2. **Expected**: Lightbox đóng
3. **Check**:
   - ✅ Smooth fade out
   - ✅ Scroll position preserved

#### Test Case 3.5: Refresh
1. Click nút "Làm mới"
2. **Expected**: Load lại memes từ đầu
3. **Check**:
   - ✅ Icon spin animation
   - ✅ Memes được replace
   - ✅ Reset về page 0

#### Test Case 3.6: End State
1. Scroll đến hết tất cả memes
2. **Expected**: Message "Bạn đã xem hết tất cả meme"
3. **Check**:
   - ✅ Không load thêm nữa
   - ✅ Message hiển thị

---

## 🔍 Debug Tips

### Check Network Requests
```javascript
// Mở Chrome DevTools → Network tab
// Filter: XHR
// Check:
- Request URL đúng chưa?
- Response status 200?
- Response data đúng format?
```

### Check Console Logs
```javascript
// Mở Chrome DevTools → Console tab
// Tìm:
- Error messages
- Warning messages
- API call logs
```

### Check React DevTools
```javascript
// Install React DevTools extension
// Check:
- Component props
- State values
- Re-render counts
```

### Performance Profiling
```javascript
// Chrome DevTools → Performance tab
// Record → Interact → Stop
// Check:
- Long tasks
- Layout shifts
- Paint times
```

---

## 📊 Performance Benchmarks

### Target Metrics
```
First Contentful Paint (FCP):  < 1.5s
Largest Contentful Paint (LCP): < 2.5s
Time to Interactive (TTI):      < 3.5s
Cumulative Layout Shift (CLS):  < 0.1
```

### Optimization Checklist
- [x] Image lazy loading
- [x] Code splitting by route
- [x] Efficient re-renders
- [x] Debounced search
- [x] Pagination/Infinite scroll
- [ ] Image optimization (WebP)
- [ ] CDN for static assets
- [ ] Service Worker caching

---

## 🎬 Demo Scenarios

### Demo 1: Browse Articles
```
1. Vào /articles
2. Scroll qua danh sách
3. Hover vào các card
4. Click "Xem nhiều nhất"
5. Click vào một bài viết
```

### Demo 2: Explore Categories
```
1. Vào /categories
2. Xem grid layout
3. Hover vào các category
4. Click vào một category
5. Xem articles được filter
```

### Demo 3: View Memes
```
1. Vào /memes
2. Scroll xuống (infinite scroll)
3. Click vào một meme (lightbox)
4. Đóng lightbox
5. Click "Làm mới"
6. Scroll đến hết
```

---

## 🔗 API Endpoints Reference

### Articles
```
GET /post?page=0&size=10&sortBy=newest
GET /post?page=0&size=10&categorySlug=tech
GET /post?page=0&size=10&sortBy=views
```

### Categories
```
GET /category
```

### Memes
```
GET /meme?page=0
GET /meme/{slug}
```

---

## 💡 Tips & Tricks

### Tip 1: Fast Refresh
Khi edit code, page tự động reload nhờ Vite HMR

### Tip 2: Debug với React Query DevTools
```tsx
// Thêm vào root.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Tip 3: Test Dark Mode
```javascript
// Toggle trong browser console
document.documentElement.classList.toggle('dark');
```

### Tip 4: Test Responsive
```
Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
Chọn device preset hoặc custom size
```

### Tip 5: Performance Testing
```bash
# Build production
npm run build

# Serve production build
npx serve build

# Test với Lighthouse
```

---

## 🎓 Learning Resources

### React Router v7
- [Official Docs](https://reactrouter.com/start/framework/installation)
- [Data Loading](https://reactrouter.com/start/framework/data-loading)
- [Routing](https://reactrouter.com/start/framework/routing)

### Tailwind CSS
- [Utility Classes](https://tailwindcss.com/docs/utility-first)
- [Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Dark Mode](https://tailwindcss.com/docs/dark-mode)

### TypeScript
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)
- [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)

---

## 📞 Support

Nếu gặp vấn đề:
1. Check console logs
2. Check network requests
3. Read error messages
4. Search documentation
5. Ask for help

---

**Happy Coding! 🚀**
