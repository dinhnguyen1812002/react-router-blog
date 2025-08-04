# Hướng dẫn Test API Bình luận (Comments)

## 1. Thêm bình luận vào bài viết

-   **Method:** `POST`
-   **URL:** `http://localhost:8888/api/v1/posts/{postId}/comments`
-   **Authorization:** Bắt buộc.
-   **Path Variable:** `postId` - ID của bài viết.
-   **Body:** `raw` - `JSON`

```json
{
  "content": "Nội dung bình luận.",
  "parentId": null 
}
```
(Để `parentId` là `null` nếu là bình luận gốc, hoặc điền ID của bình luận cha nếu là trả lời).

## 2. Lấy bình luận của bài viết

-   **Method:** `GET`
-   **URL:** `http://localhost:8888/api/v1/posts/{postId}/comments`
-   **Authorization:** Không bắt buộc.
-   **Path Variable:** `postId` - ID của bài viết.
