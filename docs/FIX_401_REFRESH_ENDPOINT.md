# Fix: 401 Error on Refresh Token Endpoint

## Problem

```
Refresh token request failed: 
{
  status: 401,
  message: "Full authentication is required to access this resource",
  url: "/auth/refresh-token"
}
```

## Root Cause

Your backend `/auth/refresh-token` endpoint is protected with authentication (e.g., `@Secured`, `@PreAuthorize`), but it shouldn't be.

The refresh endpoint should be **public** and only validate the refresh token cookie.

## Solution

### Backend Fix (Required)

**Remove authentication from refresh endpoint:**

```java
// ❌ WRONG
@PostMapping("/refresh-token")
@Secured("ROLE_USER")  // ← Remove this
public ResponseEntity<?> refreshToken(...) { }

// ✅ CORRECT
@PostMapping("/refresh-token")
public ResponseEntity<?> refreshToken(...) { }
```

**In Spring Security config:**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
      .antMatchers("/api/v1/auth/login").permitAll()
      .antMatchers("/api/v1/auth/register").permitAll()
      .antMatchers("/api/v1/auth/refresh-token").permitAll()  // ← Add this
      .antMatchers("/api/v1/auth/logout").authenticated()
      .antMatchers("/api/v1/user/**").authenticated()
      .anyRequest().authenticated();
  }
}
```

### Frontend Changes (Already Done ✅)

I've updated frontend to:
1. Check if refresh token cookie exists before trying to refresh
2. Send access token if available (for backward compatibility)
3. Better error logging

**Files updated:**
- `app/api/auth.ts` - Now sends access token if available
- `app/hooks/useAuthInit.ts` - Checks for refresh token cookie first

## Why This Matters

**OAuth2 Standard:**
- Login endpoint: Public (no auth required)
- Refresh endpoint: Public (no auth required, only validates refresh token)
- Protected endpoints: Require access token

Your refresh endpoint should follow this pattern.

## Testing

### Before Fix
```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh-token \
  -b "refreshToken=..." \
  -v

# Response: 401 Unauthorized
```

### After Fix
```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh-token \
  -b "refreshToken=..." \
  -v

# Response: 200 OK
# Body: { "accessToken": "eyJhbGc..." }
```

## Verification Checklist

- [ ] Refresh endpoint has no `@Secured` annotation
- [ ] Refresh endpoint has no `@PreAuthorize` annotation
- [ ] Refresh endpoint is in `permitAll()` in Spring Security config
- [ ] Refresh endpoint only validates refresh token cookie
- [ ] Refresh endpoint returns new access token
- [ ] Test in browser: `authApi.refreshToken()` succeeds

## Complete Example

See `docs/BACKEND_REFRESH_TOKEN_FIX.md` for complete implementation.

## Frontend is Ready ✅

No more frontend changes needed. Just fix the backend endpoint.

---

**Next Step:** Update your backend to make `/auth/refresh-token` public
