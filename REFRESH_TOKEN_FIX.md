# Sửa lỗi Refresh Token - Frontend

## Những thay đổi đã thực hiện

### 1. Cập nhật API Auth (`app/api/auth.ts`)
- ✅ Sửa `refreshToken()` để chỉ sử dụng cookie, không gửi Authorization header
- ✅ Sửa `login()` để nhận refresh token cookie từ server
- ✅ Sửa `logout()` để không xóa sessionStorage
- ✅ Thêm debug logging chi tiết

### 2. Cập nhật Axios Interceptor (`app/config/axios.ts`)
- ✅ Thêm function `isRefreshTokenRequest()` để kiểm tra refresh token request
- ✅ Sửa request interceptor để không gửi Authorization header cho refresh token request
- ✅ Backend chỉ cần refresh token cookie, không cần access token

### 3. Cập nhật Auth Initialization (`app/hooks/useAuthInit.ts`)
- ✅ Bỏ kiểm tra sessionStorage
- ✅ Chỉ dựa vào refresh token cookie từ server

## Cách test

### 1. Test cơ bản
1. Login vào ứng dụng
2. Mở Developer Tools > Console
3. Chạy script test: `test-refresh-token.js`

### 2. Test tự động refresh
1. Login vào ứng dụng
2. Đợi access token hết hạn (hoặc xóa access token trong Zustand store)
3. Thực hiện một API call bất kỳ
4. Kiểm tra console logs để xem refresh token có được gọi tự động không

### 3. Kiểm tra cookies
```javascript
// Trong browser console
console.log('Current cookies:', document.cookie);
```

## Cấu trúc Backend mới

Backend endpoint: `POST /api/v1/auth/refresh-token`
- **Input**: Refresh token cookie (tự động gửi với `withCredentials: true`)
- **Output**: 
  ```json
  {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
  ```
- **Cookies**: Server tự động set refresh token cookie mới

## Debug

Nếu vẫn gặp lỗi 401, kiểm tra:

1. **Cookie có được set không?**
   ```javascript
   console.log(document.cookie);
   ```

2. **Request có gửi cookie không?**
   - Kiểm tra Network tab trong DevTools
   - Tìm request `/auth/refresh-token`
   - Xem Request Headers có `Cookie` không

3. **Backend có nhận được cookie không?**
   - Kiểm tra backend logs
   - Xem có log về refresh token cookie không

4. **CORS configuration**
   - Backend phải cho phép credentials: `Access-Control-Allow-Credentials: true`
   - Frontend phải set `withCredentials: true`

## Lỗi thường gặp

### 401 Unauthorized
- Refresh token cookie không tồn tại hoặc đã hết hạn
- CORS không cho phép credentials
- Cookie domain/path không đúng

### Network Error
- Backend không chạy
- URL không đúng
- CORS policy block

### No access token in response
- Backend trả về format khác
- Kiểm tra response structure trong console logs

## Debug Utilities

Đã tạo debug utilities trong `app/utils/debugRefreshToken.ts`:

```javascript
// Trong browser console (sau khi import)
debugRefreshToken.testFullFlow();
```

Hoặc test từng bước:
```javascript
// Kiểm tra cookies
debugRefreshToken.checkCookies();

// Kiểm tra auth state  
debugRefreshToken.checkAuthState();

// Test API trực tiếp
debugRefreshToken.testRefreshAPI();
```

## Tóm tắt

✅ **Đã sửa xong**: Frontend giờ đây tương thích với backend mới
- Sử dụng cookie-based refresh token
- Không gửi Authorization header cho refresh request
- Tự động debug logging
- Utilities để test và debug

🧪 **Cách test**: Login và kiểm tra console logs khi refresh token được gọi tự động