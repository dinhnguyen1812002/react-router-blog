# Hướng dẫn Test API Bài viết (Posts)

## 1. Lấy danh sách bài viết

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/posts`
- **Authorization:** Không bắt buộc (API công khai).
- 
## 2. Lấy bài viết nổi bật (Featured)

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/posts/featured`
- **Authorization:** Không bắt buộc (API công khai).
- **Description:** Trả về danh sách 5 bài viết được đánh dấu là nổi bật, sắp xếp theo ngày tạo mới nhất.

## 3. Tạo bài viết mới

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/v1/posts`
- **Authorization:** **Bắt buộc**. Cần token của user có vai trò `ROLE_AUTHOR` hoặc `ROLE_ADMIN`.
- **Body:** `raw` - `JSON`

```json
{
  "title": "Bài viết mới từ Postman",
  "content": "Đây là nội dung chi tiết của bài viết.",
  "categoryId": "uuid-cua-category",
  "tagIds": ["uuid-cua-tag-1", "uuid-cua-tag-2"]
}
```

## 4. Like một bài viết

-   **Method:** `POST`
-   **URL:** `http://localhost:8080/api/v1/posts/{postId}/like`
-   **Authorization:** Bắt buộc.
-   **Path Variable:** `postId` - ID của bài viết bạn muốn like.

## 5. Đánh giá (rating) một bài viết

-   **Method:** `POST`
-   **URL:** `http://localhost:8080/api/v1/posts/{postId}/rate`
-   **Authorization:** Bắt buộc.
-   **Path Variable:** `postId` - ID của bài viết.
-   **Body:** `raw` - `JSON`

```json
{
  "score": 5
}
```
(Điểm số `score` từ 1 đến 5)

## 6. Lọc bài viết theo Category hoặc Tag

-   **Method:** `GET`
-   **URL:** `http://localhost:8080/api/v1/posts`
-   **Query Params:**
    -   `category`: `uuid-cua-category`
    -   `tag`: `uuid-cua-tag`
-   **Ví dụ:** `http://localhost:8080/api/v1/posts?category=uuid-cua-category`

