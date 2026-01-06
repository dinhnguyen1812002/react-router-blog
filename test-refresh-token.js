// Test script để kiểm tra refresh token functionality
// Chạy trong browser console sau khi login

async function testRefreshToken() {
  console.log('🧪 Testing refresh token functionality...');
  
  try {
    // Gọi API refresh token
    const response = await fetch('http://localhost:8080/api/v1/auth/refresh-token', {
      method: 'POST',
      credentials: 'include', // Gửi cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });

 
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Refresh token successful:', data);
      
      // Kiểm tra xem có accessToken không
      if (data.accessToken || data.token) {
        console.log('✅ New access token received');
      } else {
        console.log('❌ No access token in response');
      }
      
      // Kiểm tra xem có set cookie mới không
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        console.log('✅ New cookies set:', setCookieHeader);
      }
    } else {
      const errorData = await response.text();
      console.log('❌ Refresh token failed:', errorData);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Chạy test
testRefreshToken();