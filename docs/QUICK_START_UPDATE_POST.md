# Quick Start: Update Post Feature

## Cách sử dụng tính năng Update Post

### 1. Truy cập trang chỉnh sửa

```
URL: /dashboard/posts/edit/:id
```

Ví dụ: `/dashboard/posts/edit/123`

### 2. Các bước thực hiện

#### Bước 1: Load bài viết
- Khi vào trang, hệ thống tự động fetch dữ liệu bài viết từ API
- Form sẽ được điền tự động với dữ liệu hiện có

#### Bước 2: Chỉnh sửa nội dung
- **Tiêu đề**: Nhập tiêu đề bài viết (5-200 ký tự)
- **Nội dung**: Viết nội dung bằng Rich Text hoặc Markdown
- **Tóm tắt**: Viết tóm tắt ngắn gọn (5-200 ký tự)
- **Danh mục**: Chọn danh mục từ dropdown
- **Tags**: Click vào tags để chọn/bỏ chọn
- **Ảnh đại diện**: Upload hoặc paste URL ảnh
- **Ngày xuất bản**: Chọn ngày giờ xuất bản

#### Bước 3: Lưu bài viết

Có 3 cách để lưu:

1. **Auto-save (Tự động)**
   - Tự động lưu mỗi 30 giây
   - Tự động lưu sau 3 giây khi ngừng typing
   - Xem trạng thái ở góc trên bên phải

2. **Lưu ngay (Manual Save)**
   - Click nút "Lưu ngay"
   - Lưu ngay lập tức mà không rời khỏi trang
   - Hiển thị thông báo khi lưu thành công

3. **Xuất bản (Publish)**
   - Click nút "Xuất bản"
   - Lưu và chuyển trạng thái thành PUBLISHED
   - Tự động chuyển về trang danh sách sau 2 giây

### 3. Các tính năng bổ sung

#### Xem trước (Preview)
- Click nút "Xem trước" để xem bài viết như người đọc
- Hỗ trợ cả Rich Text và Markdown

#### Tải lại (Reload)
- Click nút "Tải lại" để fetch lại dữ liệu từ server
- Hữu ích khi muốn hủy các thay đổi chưa lưu

#### Focus Mode
- Click icon Focus để vào chế độ tập trung
- Ẩn sidebar, tối đa hóa không gian viết

#### Writing Stats
- Số từ
- Thời gian đọc ước tính
- Số ký tự

## API Flow

```
1. GET /author/{postId}
   ↓
2. Populate form with data
   ↓
3. User edits content
   ↓
4. PUT /author/{postId} (auto-save hoặc manual)
   ↓
5. Success → Show notification
```

## Troubleshooting

### Lỗi: "Không thể tải bài viết"
- Kiểm tra ID bài viết có đúng không
- Kiểm tra quyền truy cập (chỉ author mới edit được bài của mình)
- Click "Thử lại" để fetch lại

### Lỗi: "Có lỗi xảy ra khi cập nhật"
- Kiểm tra kết nối internet
- Kiểm tra các trường bắt buộc đã điền chưa
- Xem chi tiết lỗi trong console (F12)

### Auto-save không hoạt động
- Kiểm tra có đang ở chế độ edit (có postId) không
- Kiểm tra đã điền tiêu đề và nội dung chưa
- Xem trạng thái auto-save ở header

## Code Example

### Sử dụng custom hook `usePostEditor`

```typescript
import { usePostEditor } from '~/hooks/usePostEditor';

function EditPostPage() {
  const { id } = useParams();
  
  const {
    form,
    selectedTags,
    setSelectedTags,
    post,
    postLoading,
    postError,
    onSubmit,
    manualSave,
    autoSaveStatus,
    lastSaved,
  } = usePostEditor({
    postId: id,
    onSuccess: () => {
      console.log('Post updated successfully!');
    },
    onError: (error) => {
      console.error('Update failed:', error);
    },
  });

  if (postLoading) return <div>Loading...</div>;
  if (postError) return <div>Error loading post</div>;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      <button type="button" onClick={manualSave}>
        Lưu ngay
      </button>
      <button type="submit">
        Xuất bản
      </button>
    </form>
  );
}
```

## Best Practices

1. ✅ **Luôn validate** trước khi submit
2. ✅ **Sử dụng auto-save** để tránh mất dữ liệu
3. ✅ **Kiểm tra console logs** khi debug
4. ✅ **Test trên nhiều trường hợp**: tạo mới, update, publish
5. ✅ **Handle errors gracefully** với thông báo rõ ràng

## Keyboard Shortcuts (Future)

- `Ctrl + S`: Lưu ngay
- `Ctrl + P`: Xem trước
- `Ctrl + Enter`: Xuất bản
- `F11`: Focus mode

---

**Lưu ý**: Tính năng này yêu cầu người dùng đã đăng nhập và có quyền author.
