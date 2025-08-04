# Hướng dẫn Test API Xác thực (Authentication)

## 1. Đăng ký tài khoản (`/api/v1/auth/register`)

- **Method:** `POST`
- **URL:** `http://localhost:8888/api/v1/auth/register`
- **Authorization:** Không bắt buộc.
- **Body:** `raw` - `JSON`

```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Response thành công:**
```json
{
  "id": "2489d3e0-df7a-4d7e-b719-7270a5af3644",
  "username": "testuser",
  "email": "testuser@example.com",
  "avatar": null,
  "roles": [
    "ROLE_USER"
  ]
}
```

## 2. Đăng nhập (`/api/v1/auth/login`)

- **Method:** `POST`
- **URL:** `http://localhost:8888/api/v1/auth/login`
- **Authorization:** Không bắt buộc.
- **Body:** `raw` - `JSON`

```json
{
  "email": "toilanguyen@gmail.com",
  "password": "123#Hklmn"
}
```

**Response thành công:**
```json
{
  "id": "f865c9ea-bb30-4ac8-82d4-52cf46c08525",
  "username": "tôi là nguyen",
  "email": "toilanguyen@gmail.com",
  "roles": [
    "ROLE_USER"
  ],
  "tokenType": "Bearer ",
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmODY1YzllYS1iYjMwLTRhYzgtODJkNC01MmNmNDZjMDg1MjUiLCJlbWFpbCI6InRvaWxhbmd1eWVuQGdtYWlsLmNvbSIsImlhdCI6MTc1NDExMDAwOCwiZXhwIjoxNzU0MTk2NDA4fQ.7wAQib5SBuIQOC_wxZ2Q-T6DoFpdmI46Eij5YmAE6tE"
}
```

## 3. Lấy thông tin người dùng hiện tại (`/api/v1/users/me`)

- **Method:** `GET`
- **URL:** `http://localhost:8888/api/v1/users/me`
- **Authorization:** **Bắt buộc** - Bearer Token

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Lấy thông tin thành công",
  "data": {
    "id": "user-id",
    "username": "testuser",
    "email": "testuser@example.com",
    "roles": ["USER"],
    "createdAt": "2024-01-01T00:00:00Z",
    "avatar": "avatar-url"
  }
}
```

## 4. Quên mật khẩu (`/api/v1/auth/forgot-password`)

- **Method:** `POST`
- **URL:** `http://localhost:8888/api/v1/auth/forgot-password`
- **Authorization:** Không bắt buộc.
- **Body:** `raw` - `JSON`

```json
{
  "email": "testuser@example.com"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Email đặt lại mật khẩu đã được gửi"
}
```

## 5. Đặt lại mật khẩu (`/api/v1/auth/reset-password`)

- **Method:** `POST`
- **URL:** `http://localhost:8888/api/v1/auth/reset-password`
- **Authorization:** Không bắt buộc.
- **Body:** `raw` - `JSON`

```json
{
  "token": "reset-token-from-email",
  "newPassword": "newPassword123"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Mật khẩu đã được đặt lại thành công"
}
```

## 6. Cập nhật mật khẩu (`/api/v1/users/update-password`)

- **Method:** `POST`
- **URL:** `http://localhost:8888/api/v1/users/update-password`
- **Authorization:** **Bắt buộc** - Bearer Token
- **Body:** `raw` - `JSON`

```json
{
  "oldPassword": "password123",
  "newPassword": "newPassword456"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Mật khẩu đã được cập nhật thành công"
}
```

## 7. Đăng xuất (`/api/v1/auth/logout`)

- **Method:** `POST`
- **URL:** `http://localhost:8888/api/v1/auth/logout`
- **Authorization:** **Bắt buộc** - Bearer Token

**Response thành công:**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

## Xử lý lỗi

### Lỗi xác thực (401 Unauthorized)
```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn",
  "error": "UNAUTHORIZED"
}
```

### Lỗi validation (400 Bad Request)
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "username": "Tên đăng nhập đã tồn tại",
    "email": "Email không hợp lệ"
  }
}
```

### Lỗi server (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Lỗi server nội bộ",
  "error": "INTERNAL_SERVER_ERROR"
}
```

## Sử dụng Token

Sau khi đăng nhập thành công, bạn sẽ nhận được một JWT token. Token này cần được gửi kèm trong header `Authorization` cho tất cả các API yêu cầu xác thực:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token có thời gian hết hạn, khi hết hạn bạn cần đăng nhập lại để lấy token mới.

## Test với curl

### Đăng ký
```bash
curl -X POST http://localhost:8888/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123"
}'
```

### Đăng nhập
```bash
curl -X POST http://localhost:8888/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "testuser@example.com",
  "password": "password123"
}'
```

### Lấy thông tin user (với token)
```bash
TOKEN="your-jwt-token-here"

curl -X GET http://localhost:8888/api/v1/users/me \
-H "Authorization: Bearer $TOKEN"
```
