# Hướng dẫn Test API Meme

Tài liệu này mô tả các API liên quan đến việc quản lý và truy xuất Meme.

---

## 1. Upload Meme

### 1.1. Upload một Meme

API này cho phép upload một file ảnh kèm theo thông tin (dưới dạng JSON) để tạo thành một meme.

-   **Method:** `POST`
-   **URL:** `http://localhost:8080/api/memes/upload`
-   **Authorization:** Yêu cầu xác thực (tùy theo cấu hình security của bạn).
-   **Body:** `form-data`
    -   **Key 1:** `file`
        -   **Value:** Chọn một file hình ảnh từ máy của bạn.
    -   **Key 2:** `meme`
        -   **Value:** Một chuỗi JSON chứa thông tin của meme. Ví dụ:
            ```json
            {
              "title": "Khi bạn fix được bug lúc nửa đêm",
              "userId": "uuid-cua-user"
            }
            ```

-   **Phản hồi thành công (200 OK):** Trả về chi tiết của meme vừa được tạo.

### 1.2. Upload nhiều Meme

Cho phép upload nhiều file và thông tin tương ứng trong cùng một request.

-   **Method:** `POST`
-   **URL:** `http://localhost:8080/api/memes/upload/multiple`
-   **Authorization:** Yêu cầu xác thực.
-   **Body:** `form-data`
    -   **Key 1:** `file`
        -   **Value:** Chọn nhiều file hình ảnh.
    -   **Key 2:** `memes`
        -   **Value:** Một mảng các đối tượng JSON, mỗi đối tượng tương ứng với một file theo đúng thứ tự. Ví dụ:
            ```json
            [
                {
                    "title": "Meme thứ nhất",
                    "userId": "uuid-user-1"
                },
                {
                    "title": "Meme thứ hai",
                    "userId": "uuid-user-2"
                }
            ]
            ```

-   **Phản hồi thành công (200 OK):** Trả về một danh sách các meme vừa được tạo.

---

## 2. Lấy thông tin Meme

### 2.1. Lấy danh sách Meme (phân trang)

Lấy danh sách các meme trong hệ thống, có phân trang.

-   **Method:** `GET`
-   **URL:** `http://localhost:8888/api/v1/memes`
-   **Authorization:** Không bắt buộc.
-   **Query Param:**
    -   `page`: Số trang (mặc định: `0`).
-   **Ví dụ:** `http://localhost:8080/api/memes?page=1`

-   **Phản hồi thành công (200 OK):** Trả về một đối tượng chứa danh sách meme và thông tin phân trang.
 ```json

  "content": [
    {
      "id": "17a8ae76-c92e-4a28-b42a-9a1348e5898b",
      "name": "meme 3",
      "description": "A funny cat",
      "memeUrl": "uploads/21a43dcc-e24d-483a-8971-94b49c73403e_YUNZII YZ87 75_ Gasket Mechanical Keyboard.jpg",
      "slug": "meme-3"
    },
    {
      "id": "206b441f-83ce-4312-8098-24c8b3275653",
      "name": "hdgfhkjhdsfg",
      "description": "A funny cat",
      "memeUrl": "uploads/462f1874-14db-481e-aecc-eda4ba4f73d1_jpg.jpg",
      "slug": "hdgfhkjhdsfg"
    },
    {
      "id": "5f479fb8-a3ee-4f72-9fff-eb922187db6d",
      "name": "meme 2",
      "description": "A funny cat",
      "memeUrl": "uploads/e7ef3151-f9a8-4bec-aace-c46ce86f9687_Thinkpad X Series chính hãng giá rẻ _ Nhật Minh Laptop.jpg",
      "slug": "meme-2"
    },
    {
      "id": "fa4d85ab-909a-452a-a32e-5f699efdb7ed",
      "name": "mevvv",
      "description": "A funny cat",
      "memeUrl": "uploads/3ab4e7b9-1c90-483c-84b1-087e8fa99ab0_jpg.jpg",
      "slug": "mevvv"
    }
  ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 4,
  "totalPages": 1,
  "last": true
}

```
### 2.2. Lấy Meme theo Slug

Lấy thông tin chi tiết của một meme dựa vào `slug` của nó.

-   **Method:** `GET`
-   **URL:** `http://localhost:8080/api/memes/{slug}`
-   **Authorization:** Không bắt buộc.
-   **Path Variable:**
    -   `slug`: Slug của meme (ví dụ: `khi-ban-fix-duoc-bug-luc-nua-dem`).
-   **Ví dụ:** `http://localhost:8080/api/memes/khi-ban-fix-duoc-bug-luc-nua-dem`

-   **Phản hồi thành công (200 OK):** Trả về chi tiết của meme.

---

## 3. Stream Meme ngẫu nhiên (Server-Sent Events)

API này sử dụng công nghệ Server-Sent Events (SSE) để đẩy (push) một meme ngẫu nhiên tới client mỗi 5 phút. Client chỉ cần kết nối một lần và sẽ liên tục nhận được dữ liệu mới.

-   **Method:** `GET`
-   **URL:** `http://localhost:8080/api/memes/random-stream`
-   **Authorization:** Không bắt buộc.
-   **Media Type:** `text/event-stream`

**Cách test:**

Bạn có thể dùng `curl` hoặc kết nối trực tiếp từ trình duyệt:

```bash
curl -N http://localhost:8080/api/memes/random-stream
```

Client sẽ giữ kết nối mở và mỗi 5 phút, một sự kiện tên là `random-meme` chứa dữ liệu của một meme ngẫu nhiên sẽ được gửi về.