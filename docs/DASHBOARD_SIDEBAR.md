# Dashboard Sidebar Navigation

## Tổng quan

Sidebar navigation cho dashboard user đã được thiết kế lại với giao diện hiện đại và nhiều tính năng mới. Sidebar này cung cấp trải nghiệm người dùng tốt hơn với các tính năng như tìm kiếm, phân loại, phím tắt và responsive design.

## Tính năng chính

### 1. **Responsive Design**
- Tự động thu gọn trên màn hình nhỏ
- Overlay trên mobile
- Toggle collapse/expand trên desktop

### 2. **Tìm kiếm Menu**
- Tìm kiếm real-time trong các menu items
- Hỗ trợ tìm kiếm theo tên và mô tả
- Phím tắt: `⌘K`

### 3. **Phân loại Menu**
- Nhóm menu theo categories:
  - **Chính**: Dashboard tổng quan
  - **Nội dung**: Quản lý bài viết, viết bài mới, bookmarks
  - **Thống kê**: Analytics và báo cáo
  - **Tài khoản**: Hồ sơ và cài đặt

### 4. **Phím tắt**
- `⌘1`: Tổng quan
- `⌘2`: Bài viết của tôi
- `⌘3`: Bài viết đã lưu
- `⌘4`: Thống kê
- `⌘5`: Hồ sơ
- `⌘6`: Cài đặt
- `⌘N`: Viết bài mới
- `⌘B`: Thu gọn sidebar
- `⌘K`: Tìm kiếm
- `⌘?`: Hiển thị phím tắt

### 5. **Badges và Indicators**
- Badge số lượng cho các menu items
- Indicator "Mới" cho tính năng mới
- Badge "Pro" cho tính năng premium
- Online status indicator

### 6. **Quick Stats**
- Hiển thị thống kê nhanh (số bài viết, lượt xem)
- Chỉ hiển thị khi sidebar mở rộng

## Cấu trúc Component

### DashboardSidebar
```typescript
interface DashboardSidebarProps {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  onToggleCollapse: () => void;
  onToggleTheme: () => void;
  onCloseSidebar: () => void;
}
```

### Navigation Items
```typescript
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: number;
  shortcut?: string;
  category?: string;
  isNew?: boolean;
  isPro?: boolean;
}
```

## Sử dụng

### 1. **Import Component**
```typescript
import { DashboardSidebar } from '~/components/layout/DashboardSidebar';
```

### 2. **Sử dụng trong Layout**
```typescript
<DashboardSidebar
  sidebarOpen={sidebarOpen}
  sidebarCollapsed={sidebarCollapsed}
  darkMode={actualTheme === 'dark'}
  onToggleCollapse={toggleSidebarCollapse}
  onToggleTheme={toggleTheme}
  onCloseSidebar={() => setSidebarOpen(false)}
/>
```

### 3. **Thêm Menu Item Mới**
```typescript
const navigation: NavItem[] = [
  // ... existing items
  {
    name: 'Tên Menu',
    href: '/dashboard/path',
    icon: IconComponent,
    description: 'Mô tả menu',
    shortcut: '⌘X',
    category: 'content',
    isNew: true, // optional
    isPro: true, // optional
    badge: 5 // optional
  }
];
```

## Styling

### CSS Classes
- `.sidebar-item`: Base class cho menu items
- `.card-hover`: Hiệu ứng hover cho cards
- `.animate-fade-in`: Animation fade in
- `.animate-slide-in-top`: Animation slide từ trên xuống
- `.animate-slide-in-bottom`: Animation slide từ dưới lên

### Theme Support
- Hỗ trợ dark/light mode
- Gradient backgrounds
- Smooth transitions
- Responsive breakpoints

## Accessibility

### Keyboard Navigation
- Tab navigation
- Enter/Space để activate
- Arrow keys để navigate
- Escape để close modal

### Screen Reader Support
- ARIA labels
- Semantic HTML
- Focus management
- Screen reader announcements

## Performance

### Optimizations
- Lazy loading cho icons
- Memoized components
- Debounced search
- Efficient re-renders

### State Management
- Local state cho search và filters
- Persistent sidebar collapse state
- Theme preference storage

## Troubleshooting

### Common Issues

1. **Sidebar không hiển thị**
   - Kiểm tra `sidebarOpen` state
   - Verify CSS z-index
   - Check responsive breakpoints

2. **Search không hoạt động**
   - Verify search input binding
   - Check filter logic
   - Ensure proper state updates

3. **Keyboard shortcuts không hoạt động**
   - Check event listener setup
   - Verify key combinations
   - Ensure focus management

### Debug Tips
- Use browser dev tools
- Check console for errors
- Verify component props
- Test responsive behavior

## Future Enhancements

### Planned Features
- [ ] Drag and drop menu reordering
- [ ] Custom menu categories
- [ ] Menu item pinning
- [ ] Advanced search filters
- [ ] Menu item analytics
- [ ] Custom themes
- [ ] Menu item shortcuts customization

### Performance Improvements
- [ ] Virtual scrolling for large menus
- [ ] Image optimization
- [ ] Bundle size reduction
- [ ] Caching strategies

## Contributing

Khi thêm tính năng mới cho sidebar:

1. Update interface definitions
2. Add proper TypeScript types
3. Include accessibility features
4. Add unit tests
5. Update documentation
6. Test responsive behavior
7. Verify keyboard navigation
8. Check theme compatibility 