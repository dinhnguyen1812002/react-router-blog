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





[
    {
        "id": "2072c388-da93-4081-adb2-022751dcfe8d",
        "user": {
            "id": "193c6e38-59a3-4c5f-b41c-5c020b0d6188",
            "username": "yyyy",
            "email": "yyy@email.com",
            "avatar": null,
            "roles": null
        },
        "title": "this is fuck abc",
        "slug": "this-is-fuck-abc",
        "createdAt": "2025-08-08T02:29:35.495+00:00",
        "featured": true,
        "content": "this is fuck abc",
        "thumbnail": null,
        "categories": [
            {
                "id": 2,
                "category": "travle",
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
        "isLikedByCurrentUser": null,
        "isSavedByCurrentUser": null,
        "userRating": null,
        "comments": null
    },
    
    {
        "id": "50deb4bf-8616-4879-9bc0-acb589a5beaf",
        "user": {
            "id": "193c6e38-59a3-4c5f-b41c-5c020b0d6188",
            "username": "yyyy",
            "email": "yyy@email.com",
            "avatar": null,
            "roles": null
        },
        "title": "java virtual thread ",
        "slug": "java-virtual-thread-",
        "createdAt": "2025-08-08T02:34:16.981+00:00",
        "featured": true,
        "content": "java virtual thread  là gì",
        "thumbnail": null,
        "categories": [
            {
                "id": 2,
                "category": "travle",
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
        "viewCount": 0,
        "likeCount": 0,
        "averageRating": 0.0,
        "isLikedByCurrentUser": null,
        "isSavedByCurrentUser": null,
        "userRating": null,
        "comments": null
    },
   
    {
        "id": "d9d34b24-119c-4a6f-8fe4-a097e65ed939",
        "user": {
            "id": "193c6e38-59a3-4c5f-b41c-5c020b0d6188",
            "username": "yyyy",
            "email": "yyy@email.com",
            "avatar": null,
            "roles": null
        },
        "title": "test 1",
        "slug": "test-1",
        "createdAt": "2025-08-08T02:35:07.424+00:00",
        "featured": false,
        "content": "tetst 123 alo alo ",
        "thumbnail": null,
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
        "viewCount": 0,
        "likeCount": 0,
        "averageRating": 0.0,
        "isLikedByCurrentUser": null,
        "isSavedByCurrentUser": null,
        "userRating": null,
        "comments": null
    }
]