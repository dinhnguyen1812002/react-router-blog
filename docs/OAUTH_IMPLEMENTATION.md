# OAuth Implementation Guide

Tài liệu này mô tả bản triển khai OAuth hoàn chỉnh theo kiến trúc hiện tại của dự án: React Router v7 ở frontend, backend làm OAuth broker, JWT access token ở memory, refresh token trong cookie `HttpOnly`, và đồng bộ thông tin người dùng từ API hiện có.

## Flow đang dùng trong dự án

1. Người dùng nhấn `Continue with Google/GitHub/Discord`.
2. Frontend redirect sang backend:
   - `GET {BACKEND_BASE_URL}/oauth2/authorization/google`
   - `GET {BACKEND_BASE_URL}/oauth2/authorization/github`
   - `GET {BACKEND_BASE_URL}/oauth2/authorization/discord`
3. Backend chuyển hướng tới provider, xác thực người dùng, nhận `code`, đổi `code` lấy token/provider profile.
4. Backend tạo hoặc cập nhật bản ghi `users` và `oauth_accounts`, sinh JWT access token + refresh token.
5. Backend redirect về frontend:
   - `GET {FRONTEND_URL}/oauth2/redirect?token={JWT}`
   - hoặc `GET {FRONTEND_URL}/oauth2/redirect?error={message}`
6. Frontend route `/oauth2/redirect`:
   - lưu access token vào `zustand` memory store
   - gọi `GET /api/v1/user/profile`
   - đồng bộ `user` vào store
   - điều hướng về trang ban đầu

## Các file đã tích hợp ở frontend

- `app/hooks/useOAuthLogin.ts`
  - lưu `returnTo` vào `sessionStorage`
  - redirect sang backend OAuth endpoint
- `app/routes/oauth2.redirect.tsx`
  - nhận `token/error`
  - gọi `authApi.finalizeOAuthLogin()`
- `app/api/auth.ts`
  - chuẩn hóa user response
  - tạo `getOAuthAuthorizationUrl()`
  - tạo `finalizeOAuthLogin()`
- `app/components/auth/OAuthButtons.tsx`
  - dùng redirect flow cho Google, GitHub, Discord
- `app/routes/login.tsx`
  - hiển thị banner lỗi/thành công từ OAuth callback
- `app/routes/auth.callback.$provider.tsx`
  - route tương thích ngược cho cấu hình callback cũ

## Environment cần cấu hình

Frontend:

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_BACKEND_BASE_URL=http://localhost:8080
```

Backend:

```bash
FRONTEND_URL=http://localhost:5173
JWT_ACCESS_SECRET=replace_me
JWT_REFRESH_SECRET=replace_me
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
```

## Mô hình dữ liệu khuyến nghị ở backend

```sql
create table users (
  id uuid primary key,
  email varchar(255) not null unique,
  username varchar(100) not null unique,
  slug varchar(120) not null unique,
  avatar varchar(500),
  password_hash varchar(255),
  provider varchar(50),
  created_at timestamp not null,
  updated_at timestamp not null
);

create table oauth_accounts (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  provider varchar(50) not null,
  provider_user_id varchar(255) not null,
  provider_email varchar(255),
  access_token varchar(2000),
  refresh_token varchar(2000),
  token_expires_at timestamp,
  created_at timestamp not null,
  updated_at timestamp not null,
  unique (provider, provider_user_id)
);
```

## Code mẫu backend

Ví dụ service xử lý callback:

```java
public AuthResult handleOAuthLogin(OAuthProvider provider, OAuthProfile profile) {
    OAuthAccount account = oauthAccountRepository
        .findByProviderAndProviderUserId(provider.name(), profile.providerUserId())
        .orElse(null);

    User user;
    if (account != null) {
        user = account.getUser();
        user.setAvatar(profile.avatarUrl());
    } else {
        user = userRepository.findByEmail(profile.email())
            .map(existing -> linkExistingUser(existing, provider, profile))
            .orElseGet(() -> createOAuthUser(provider, profile));
    }

    String accessToken = jwtService.issueAccessToken(user);
    String refreshToken = jwtService.issueRefreshToken(user);
    refreshTokenService.rotate(user.getId(), refreshToken);

    return new AuthResult(user, accessToken, refreshToken);
}
```

Ví dụ redirect success:

```java
String redirectUrl = UriComponentsBuilder
    .fromUriString(frontendUrl + "/oauth2/redirect")
    .queryParam("token", accessToken)
    .build(true)
    .toUriString();

response.addCookie(refreshTokenCookie(refreshToken));
response.sendRedirect(redirectUrl);
```

Ví dụ endpoint current user:

```java
@GetMapping("/api/v1/user/profile")
public UserProfileResponse me(@AuthenticationPrincipal JwtUser principal) {
    User user = userService.requireById(principal.userId());
    return UserProfileResponse.from(user);
}
```

## Cấu hình provider

Google:

- Redirect URI backend: `http://localhost:8080/login/oauth2/code/google`
- Scope: `openid email profile`

GitHub:

- Redirect URI backend: `http://localhost:8080/login/oauth2/code/github`
- Scope: `read:user user:email`

Discord:

- Redirect URI backend: `http://localhost:8080/login/oauth2/code/discord`
- Scope: `identify email`

## Bảo mật bắt buộc

- Không lưu access token vào `localStorage`.
- Refresh token phải ở cookie `HttpOnly`, `Secure`, `SameSite=Lax` hoặc `SameSite=None` nếu khác site.
- Whitelist chính xác `FRONTEND_URL`.
- Backend phải verify email/provider account trước khi link tài khoản hiện có.
- Không tin dữ liệu trả về từ frontend callback, chỉ tin dữ liệu backend đã xác minh với provider.
- Luôn rotate refresh token sau refresh hoặc đăng nhập mới.
- Nên mã hóa `access_token` và `refresh_token` của provider trước khi lưu DB, hoặc chỉ lưu khi thực sự cần gọi API provider về sau.
- Nếu hỗ trợ link nhiều provider cho một user, áp unique `(provider, provider_user_id)` và audit log thao tác link/unlink.

## Tích hợp với kiến trúc hiện tại

- `zustand` vẫn là nguồn state cho `user`, `token`, `isAuthenticated`.
- `axios` interceptor tiếp tục gắn `Authorization: Bearer <token>` và tự refresh khi gặp `401`.
- `useAuthInit()` vẫn chịu trách nhiệm phục hồi session bằng refresh token cookie khi app mount.
- Login/password và OAuth dùng chung cùng một auth store nên route guard hiện có không cần viết lại.

## Kiểm thử khuyến nghị

1. Đăng nhập Google/GitHub/Discord từ `/login`.
2. Xác nhận backend set cookie `refresh-token`.
3. Xác nhận frontend gọi được `/api/v1/user/profile`.
4. Reload trang, kiểm tra `useAuthInit()` phục hồi session.
5. Giả lập access token hết hạn, kiểm tra interceptor tự refresh.
6. Giả lập callback lỗi, xác nhận redirect về `/login` với thông báo lỗi.
