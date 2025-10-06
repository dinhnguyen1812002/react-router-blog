# Tính năng Update Post (Cập nhật bài viết)

## Tổng quan
Tính năng update post cho phép người dùng chỉnh sửa bài viết đã tồn tại thông qua trang `/dashboard/posts/edit/:id`.

## Luồng hoạt động

### 1. Fetch dữ liệu bài viết (GET Post by ID)

**File:** `app/routes/dashboard/posts/edit.tsx`

```typescript
// Fetch post by ID for editing
const { 
  data: postResp, 
  isLoading: postLoading, 
  error: postError, 
  refetch: refetchPost 
} = useQuery({
  queryKey: ['post', id],
  queryFn: async () => {
    if (!id) throw new Error('Post ID is required');
    console.log('Fetching post with ID:', id);
    const response = await authorApi.getPostById(id);
    console.log('Post data received:', response.data);
    return response;
  },
  enabled: !!id,
  retry: 2,
  refetchOnWindowFocus: false,
});
```

**API Endpoint:** `GET /author/{postId}`

**Khi nào được gọi:**
- Khi component mount và có `id` từ URL params
- Khi người dùng click nút "Tải lại"
- `enabled: !!id` đảm bảo chỉ fetch khi có ID

### 2. Populate Form (Điền dữ liệu vào form)

```typescript
useEffect(() => {
  const post = postResp?.data;
  if (!post) return;
  
  console.log('Populating form with post data:', post);
  
  // Set post ID
  setPostId(post.id);
  
  // Populate form fields
  setValue('title', post.title || '');
  setValue('excerpt', post.summary || post.excerpt || '');
  setValue('summary', post.summary || '');
  setValue('content', post.content || '');
  
  // Set category (first category if exists)
  if (post.categories && post.categories.length > 0) {
    setValue('categoryId', String(post.categories[0].id));
  }
  
  // Set thumbnail
  setValue('thumbnailUrl', post.thumbnail || post.thumbnailUrl || '');
  
  // Set content type
  setValue('contentType', post.contentType || 'RICHTEXT');
  
  // Set status
  setValue('status', post.is_publish ? 'PUBLISHED' : 'DRAFT');
  
  // Set publish date
  if (post.public_date) {
    const dateStr = String(post.public_date).slice(0, 16);
    setValue('public_date', dateStr);
  }
  
  // Set tags
  const tagUuids = post.tags?.map((t: any) => t.uuid) || [];
  setSelectedTags(tagUuids);
  
  console.log('Form populated successfully');
}, [postResp, setValue]);
```

**Chức năng:**
- Tự động điền tất cả field của form khi dữ liệu post được load
- Xử lý các trường hợp null/undefined
- Convert dữ liệu sang đúng format (ví dụ: date string)

### 3. Update Post (Cập nhật bài viết)

#### 3.1. Auto-save (Tự động lưu)

```typescript
const autoSave = useCallback(async () => {
  if (!contentValue || !titleValue || !postId) return;
  
  setAutoSaveStatus('saving');
  try {
    const formData = getValues();
    const payload: CreateAuthorPostRequest = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      categories: [Number(formData.categoryId)],
      tags: selectedTags,
      thumbnail: formData.thumbnailUrl || undefined,
      public_date: formData.public_date || undefined,
      is_publish: formData.status === 'PUBLISHED',
    };
    
    await authorApi.updatePost(String(postId), payload);
    setAutoSaveStatus('saved');
    setLastSaved(new Date());
  } catch (error) {
    console.error('Auto-save error:', error);
    setAutoSaveStatus('error');
  }
}, [contentValue, titleValue, postId, getValues, selectedTags]);

// Auto-save every 30 seconds
useEffect(() => {
  const interval = setInterval(autoSave, 30000);
  return () => clearInterval(interval);
}, [autoSave]);

// Debounced auto-save when user stops typing (3 seconds)
useEffect(() => {
  if (!postId || !contentValue || !titleValue) return;
  
  const timeoutId = setTimeout(() => {
    autoSave();
  }, 3000);

  return () => clearTimeout(timeoutId);
}, [contentValue, titleValue, autoSave, postId]);
```

**Khi nào auto-save được trigger:**
- Mỗi 30 giây
- 3 giây sau khi người dùng ngừng typing

#### 3.2. Manual Save (Lưu thủ công - nút "Lưu ngay")

```typescript
<Button
  type="button"
  variant="secondary"
  onClick={async () => {
    if (!postId) {
      alert('Chưa có ID bài viết để lưu');
      return;
    }
    
    setAutoSaveStatus('saving');
    
    try {
      const formData = getValues();
      
      // Validate required fields
      if (!formData.title || !formData.content || !formData.categoryId) {
        alert('Vui lòng điền đầy đủ tiêu đề, nội dung và danh mục');
        setAutoSaveStatus('error');
        return;
      }
      
      const payload: CreateAuthorPostRequest = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        categories: [Number(formData.categoryId)],
        tags: selectedTags,
        thumbnail: formData.thumbnailUrl || undefined,
        public_date: formData.public_date || undefined,
        is_publish: formData.status === 'PUBLISHED',
      };
      
      await authorApi.updatePost(String(postId), payload);
      
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      
      // Show success toast
      // ...
    } catch (error: any) {
      console.error('Save error:', error);
      setAutoSaveStatus('error');
      alert(error.response?.data?.message || 'Lỗi khi lưu bài viết');
    }
  }}
>
  <Save className="w-4 h-4 mr-2" />
  Lưu ngay
</Button>
```

#### 3.3. Submit & Publish (Xuất bản)

```typescript
const updatePostMutation = useMutation({
  mutationFn: async (data: PostForm) => {
    if (!postId) {
      throw new Error('Không tìm thấy ID bài viết');
    }
    
    const payload: CreateAuthorPostRequest = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      categories: [Number(data.categoryId)],
      tags: selectedTags,
      thumbnail: data.thumbnailUrl || undefined,
      public_date: data.public_date || undefined,
      is_publish: data.status === 'PUBLISHED',
    };
    
    const response = await authorApi.updatePost(String(postId), payload);
    return response;
  },
  onSuccess: (response) => {
    setAutoSaveStatus('saved');
    setLastSaved(new Date());
    
    // Show success notification
    // Navigate to content page after 2 seconds
    setTimeout(() => {
      navigate('/dashboard/content');
    }, 2000);
  },
  onError: (error: any) => {
    const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
    setSubmitError(errorMessage);
    setAutoSaveStatus('error');
  },
});

// Nút "Xuất bản"
<Button
  type="submit"
  onClick={() => {
    setValue('status', 'PUBLISHED', { shouldValidate: true });
    handleSubmit(onSubmit)();
  }}
>
  <Send className="w-4 h-4 mr-2" />
  Xuất bản
</Button>
```

## API Endpoints

### Get Post by ID
```
GET /author/{postId}
Response: ApiResponse<Post>
```

### Update Post
```
PUT /author/{postId}
Body: CreateAuthorPostRequest
Response: ApiResponse<Post>
```

### Request DTO
```typescript
interface CreateAuthorPostRequest {
  title: string;
  excerpt: string;
  content: string;
  categories: number[];    // category IDs
  tags: string[];          // tag UUIDs
  thumbnail?: string;      // thumbnail URL
  public_date?: string;    // ISO date string
  is_publish?: boolean;    // true = PUBLISHED, false = DRAFT
}
```

## States & Loading

### Loading States
- `postLoading`: Đang fetch dữ liệu bài viết
- `updatePostMutation.isPending`: Đang update bài viết
- `autoSaveStatus`: 'saved' | 'saving' | 'error'

### Error Handling
- `postError`: Lỗi khi fetch bài viết → Hiển thị error screen với nút "Thử lại"
- `submitError`: Lỗi khi update → Hiển thị toast notification
- Auto-save error → Hiển thị indicator màu đỏ

## UI/UX Features

### 1. Auto-save Indicator
- **Đang lưu**: Chấm xanh nhấp nháy + "Đang lưu..."
- **Đã lưu**: Chấm xanh + "Đã lưu {time}"
- **Lỗi**: Chấm đỏ + "Lỗi lưu"

### 2. Writing Stats
- Số từ
- Thời gian đọc ước tính (~200 từ/phút)
- Số ký tự

### 3. Buttons
- **Hủy**: Quay về `/dashboard/content`
- **Xem trước**: Mở preview modal
- **Lưu ngay**: Manual save (không navigate)
- **Tải lại**: Refetch dữ liệu từ server
- **Xuất bản**: Update và navigate về content page

### 4. Focus Mode
- Ẩn sidebar
- Tối đa hóa không gian viết
- Toggle bằng nút Focus

## Debugging

### Console Logs
Tất cả các bước quan trọng đều có console.log:
- Fetching post
- Post data received
- Populating form
- Updating post
- Update response
- Errors

### Kiểm tra
1. Mở DevTools Console
2. Navigate đến `/dashboard/posts/edit/{id}`
3. Xem logs để debug từng bước

## Best Practices

1. **Validation**: Validate form trước khi submit
2. **Error Handling**: Hiển thị lỗi rõ ràng cho user
3. **Loading States**: Disable buttons khi đang xử lý
4. **Auto-save**: Tránh mất dữ liệu khi user quên save
5. **Optimistic Updates**: Cập nhật UI trước khi API response
6. **Toast Notifications**: Feedback tức thì cho user actions

## Troubleshooting

### Vấn đề: Form không được populate
- Kiểm tra `postResp?.data` có dữ liệu không
- Kiểm tra console logs "Populating form with post data"
- Verify API response structure

### Vấn đề: Update không hoạt động
- Kiểm tra `postId` có giá trị không
- Verify payload structure
- Kiểm tra API response trong Network tab
- Xem error message trong console

### Vấn đề: Auto-save quá thường xuyên
- Tăng debounce time (hiện tại: 3 giây)
- Tăng interval time (hiện tại: 30 giây)
