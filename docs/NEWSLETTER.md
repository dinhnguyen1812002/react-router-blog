# Hướng dẫn Test API Newsletter

Tài liệu này mô tả chi tiết các API để quản lý việc đăng ký nhận tin (Newsletter).

## 1. Luồng hoạt động

1.  **Người dùng đăng ký:** Người dùng cung cấp email để đăng ký.
2.  **Gửi email xác nhận:** Hệ thống gửi một email chứa liên kết xác nhận đến địa chỉ email đã đăng ký.
3.  **Người dùng xác nhận:** Người dùng nhấp vào liên kết trong email để xác thực địa chỉ email và kích hoạt việc nhận tin.
4.  **Hủy đăng ký:** Người dùng có thể hủy đăng ký bất cứ lúc nào thông qua một liên kết được cung cấp trong mỗi email newsletter.

---

## 2. API cho người dùng

### 2.1. Đăng ký nhận tin

API này cho phép người dùng đăng ký nhận bản tin. Một email xác nhận sẽ được gửi đi sau khi gọi API này thành công.

-   **Method:** `POST`
-   **URL:** `http://localhost:8888/api/v1/newsletter/subscribe`
-   **Authorization:** Không bắt buộc.
-   **Body:** `raw` - `JSON`

    ```json
    {
      "email": "new.subscriber@example.com",
      "name": "Tên Người Đăng Ký" 
    }
    ```
    *Lưu ý: Trường `name` là không bắt buộc.*

-   **Phản hồi thành công (200 OK):**

    ```json
    {
        "message": "Subscription successful. Please check your email to confirm."
    }
    ```

### 2.2. Xác nhận đăng ký

API này được dùng để xác nhận địa chỉ email của người đăng ký. Token xác nhận được gửi qua email sau khi người dùng đăng ký.

-   **Method:** `GET`
-   **URL:** `http://localhost:8888/api/v1/newsletter/confirm`
-   **Authorization:** Không bắt buộc.
-   **Query Param:**
    -   `token`: Token xác nhận nhận được từ email.
-   **Ví dụ:** `http://localhost:8888/api/v1/newsletter/confirm?token=your_confirmation_token`

-   **Phản hồi thành công (200 OK):**

    ```json
    {
        "message": "Subscription confirmed successfully."
    }
    ```

### 2.3. Hủy đăng ký

API này cho phép người dùng hủy đăng ký nhận bản tin.

-   **Method:** `GET`
-   **URL:** `http://localhost:8888/api/v1/newsletter/unsubscribe`
-   **Authorization:** Không bắt buộc.
-   **Query Param:**
    -   `token`: Token hủy đăng ký, thường được tìm thấy trong các email newsletter đã nhận.
-   **Ví dụ:** `http://localhost:8888/api/v1/newsletter/unsubscribe?token=your_unsubscribe_token`

-   **Phản hồi thành công (200 OK):**

    ```json
    {
        "message": "Unsubscribed successfully."
    }
    ```

---



### 3.1. Lấy danh sách tất cả người đăng ký

Lấy danh sách tất cả người đã đăng ký, bao gồm cả những người chưa xác nhận, được phân trang.

-   **Method:** `GET`
-   **URL:** `http://localhost:8888/api/v1/newsletter/subscribers`
-   **Authorization:** Bắt buộc (Token của Admin).
-   **Query Params:**
    -   `page`: Số trang (mặc định: `0`).
    -   `size`: Kích thước trang (mặc định: `10`).
-   **Ví dụ:** `http://localhost:8888/api/v1/newsletter/subscribers?page=0&size=20`

-   **Phản hồi thành công (200 OK):**

    ```json
        {
            "content": [
                {
                    "id": "ad30c81b-a67f-4daa-bc77-a7e1ae927968",
                    "email": "test@gmail.com",
                    "name": null,
                    "isActive": true,
                    "isConfirmed": false,
                    "subscribedAt": "2025-08-07T01:15:22.722936",
                    "confirmedAt": null,
                    "unsubscribedAt": null
                },
                {
                    "id": "dd09238c-8bd3-48ed-a47e-9f21c8076ae7",
                    "email": "ngdev@gmail.com",
                    "name": "ngdev",
                    "isActive": true,
                    "isConfirmed": false,
                    "subscribedAt": "2025-07-15T09:13:07.992467",
                    "confirmedAt": null,
                    "unsubscribedAt": null
                },
                {
                    "id": "fce2c073-1c09-43f1-9358-514e1e8df91c",
                    "email": "dinhnguyen1812002@gmail.com",
                    "name": "Nguyễn Văn B",
                    "isActive": true,
                    "isConfirmed": false,
                    "subscribedAt": "2025-08-16T10:09:30.146799",
                    "confirmedAt": null,
                    "unsubscribedAt": null
                }
            ],
            "pageable": {
                "pageNumber": 0,
                "pageSize": 10,
                "sort": {
                    "empty": true,
                    "sorted": false,
                    "unsorted": true
                },
                "offset": 0,
                "paged": true,
                "unpaged": false
            },
            "last": true,
            "totalElements": 3,
            "totalPages": 1,
            "first": true,
            "size": 10,
            "number": 0,
            "sort": {
                "empty": true,
                "sorted": false,
                "unsorted": true
            },
            "numberOfElements": 3,
            "empty": false
        }
    ```

---


### 3.2. Lấy danh sách người đăng ký đã kích hoạt

Chỉ lấy danh sách những người đăng ký đã xác nhận email và đang ở trạng thái hoạt động.

-   **Method:** `GET`
-   **URL:** `http://localhost:8888/api/v1/newsletter/subscribers/active`
-   **Authorization:** Bắt buộc (Token của Admin).
-   **Query Params:**
    -   `page`: Số trang (mặc định: `0`).
    -   `size`: Kích thước trang (mặc định: `10`).

### 3.3. Lấy tổng số người đăng ký đã kích hoạt

Trả về tổng số lượng người đăng ký đang ở trạng thái hoạt động.

-   **Method:** `GET`
-   **URL:** `http://localhost:8888/api/v1/newsletter/subscribers/count`
-   **Authorization:** Bắt buộc (Token của Admin).
-   **Phản hồi thành công (200 OK):**

    ```json
    125
    ```
    (Trả về một con số duy nhất).