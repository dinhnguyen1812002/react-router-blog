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



## 7. Tìm kiếm bài viết

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/post/search`
- **Authorization:** Không bắt buộc (API công khai).
- **Query Params:**
    -   `title`: Tiêu đề bài viết.
    -   `categoryId`: ID của danh mục.


example for seach


http://localhost:8080/api/v1/post/search?title=java&categoryId=1
[
    {
        "id": "62af4add-7b9a-4216-bf7f-735a08380a37",
        "user": {
            "id": "193c6e38-59a3-4c5f-b41c-5c020b0d6188",
            "username": "yyyy",
            "email": "yyy@email.com",
            "avatar": null,
            "roles": null
        },
        "title": "test 1hfdhffh",
        "slug": "test-1hfdhffh",
        "excerpt": null,
        "createdAt": "2025-08-08T02:35:48.078+00:00",
        "featured": false,
        "content": null,
        "thumbnail": "http://localhost:8888/uploads/thumbnail/638902163329370000_wallpaper2.jpg",
        "categories": [
            {
                "id": 1,
                "category": "cooking",
                "backgroundColor": "#FFFF66"
            }
        ],
        "tags": [
            {
                "uuid": "c4408bd9-3934-44d6-b8f2-26d30ce152c1",
                "name": "Go",
                "slug": "go",
                "description": "Ngôn ngữ hiệu quả từ Google",
                "color": "#00ADD8"
            }
        ],
        "commentCount": 0,
        "viewCount": 1,
        "likeCount": 0,
        "averageRating": 0.0,
        "isLikedByCurrentUser": false,
        "isSavedByCurrentUser": false,
        "userRating": null,
        "comments": null
    }
]