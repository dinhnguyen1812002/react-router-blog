# Backend: Fix Refresh Token Endpoint

## Problem

Frontend is getting 401 error: "Full authentication is required to access this resource"

This means your `/auth/refresh-token` endpoint is requiring an access token, but it shouldn't.

## Solution

### The Issue

Your refresh endpoint is protected with `@Secured` or similar authentication middleware that requires an access token. But the refresh endpoint should only need the refresh token cookie.

### The Fix

**Remove authentication requirement from refresh endpoint:**

```java
// ❌ WRONG - This requires access token
@PostMapping("/refresh-token")
@Secured("ROLE_USER")  // ← Remove this
public ResponseEntity<?> refreshToken(HttpServletRequest request) {
  // ...
}

// ✅ CORRECT - No authentication required
@PostMapping("/refresh-token")
public ResponseEntity<?> refreshToken(HttpServletRequest request) {
  // ...
}
```

### Complete Implementation

```java
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  @PostMapping("/refresh-token")
  public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
    try {
      // Get refresh token from cookie
      Cookie[] cookies = request.getCookies();
      String refreshToken = null;
      
      if (cookies != null) {
        for (Cookie cookie : cookies) {
          if ("refreshToken".equals(cookie.getName())) {
            refreshToken = cookie.getValue();
            break;
          }
        }
      }
      
      if (refreshToken == null) {
        return ResponseEntity.status(401).body(new ErrorResponse("No refresh token"));
      }
      
      // Validate refresh token
      try {
        Claims claims = Jwts.parserBuilder()
          .setSigningKey(Keys.hmacShaKeyFor(refreshTokenSecret.getBytes()))
          .build()
          .parseClaimsJws(refreshToken)
          .getBody();
        
        String userId = claims.getSubject();
        
        // Generate new access token
        String newAccessToken = Jwts.builder()
          .setSubject(userId)
          .setIssuedAt(new Date())
          .setExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15 min
          .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS256)
          .compact();
        
        // Optionally rotate refresh token
        String newRefreshToken = Jwts.builder()
          .setSubject(userId)
          .setIssuedAt(new Date())
          .setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000)) // 7 days
          .signWith(Keys.hmacShaKeyFor(refreshTokenSecret.getBytes()), SignatureAlgorithm.HS256)
          .compact();
        
        // Set new refresh token cookie
        Cookie newRefreshCookie = new Cookie("refreshToken", newRefreshToken);
        newRefreshCookie.setHttpOnly(true);
        newRefreshCookie.setSecure(true);
        newRefreshCookie.setPath("/");
        newRefreshCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        response.addCookie(newRefreshCookie);
        
        return ResponseEntity.ok(new TokenResponse(newAccessToken));
        
      } catch (JwtException e) {
        return ResponseEntity.status(401).body(new ErrorResponse("Invalid refresh token"));
      }
      
    } catch (Exception e) {
      return ResponseEntity.status(500).body(new ErrorResponse("Internal server error"));
    }
  }
}
```

## Key Points

1. **Remove `@Secured` or `@PreAuthorize` from refresh endpoint**
   - This endpoint should NOT require authentication
   - It only needs the refresh token cookie

2. **Keep authentication on other endpoints**
   - `/user/profile` - Requires access token
   - `/auth/logout` - Requires access token
   - Other protected endpoints - Require access token

3. **Refresh endpoint should only check refresh token cookie**
   - Not the Authorization header
   - Not any other authentication

## Example: Spring Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .cors()
      .and()
      .csrf().disable()
      .authorizeRequests()
        // Public endpoints - no auth required
        .antMatchers("/api/v1/auth/login").permitAll()
        .antMatchers("/api/v1/auth/register").permitAll()
        .antMatchers("/api/v1/auth/refresh-token").permitAll()  // ← Important
        .antMatchers("/api/v1/auth/forgot-password").permitAll()
        .antMatchers("/api/v1/auth/reset-password").permitAll()
        
        // Protected endpoints - auth required
        .antMatchers("/api/v1/user/**").authenticated()
        .antMatchers("/api/v1/posts/**").authenticated()
        
        // All other requests require auth
        .anyRequest().authenticated()
      .and()
      .addFilter(new JwtAuthenticationFilter(authenticationManager()))
      .addFilter(new JwtAuthorizationFilter(authenticationManager()))
      .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
  }
}
```

## Testing

### Before Fix
```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh-token \
  -b "refreshToken=..." \
  -v

# Response: 401 Unauthorized
# Message: "Full authentication is required to access this resource"
```

### After Fix
```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh-token \
  -b "refreshToken=..." \
  -v

# Response: 200 OK
# Body: { "accessToken": "eyJhbGc..." }
```

## Verification

1. **Check endpoint is public:**
   ```java
   .antMatchers("/api/v1/auth/refresh-token").permitAll()
   ```

2. **Check no `@Secured` annotation:**
   ```java
   @PostMapping("/refresh-token")  // ← No @Secured
   public ResponseEntity<?> refreshToken(...) {
   ```

3. **Check no `@PreAuthorize` annotation:**
   ```java
   @PostMapping("/refresh-token")  // ← No @PreAuthorize
   public ResponseEntity<?> refreshToken(...) {
   ```

4. **Test in browser console:**
   ```javascript
   import { authApi } from '~/api/auth';
   authApi.refreshToken()
     .then(r => console.log('✅ Success:', r))
     .catch(e => console.error('❌ Error:', e.response?.status));
   ```

## Summary

**The fix is simple:**
1. Remove authentication requirement from `/auth/refresh-token` endpoint
2. Keep it public (permitAll)
3. Only validate refresh token cookie
4. Return new access token

This is the standard OAuth2 pattern - refresh endpoints are public and only validate the refresh token.
