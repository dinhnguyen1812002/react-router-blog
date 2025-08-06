export default function MemesSimple() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Memes Simple Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Basic Rendering</h2>
        <p>Nếu bạn thấy trang này, nghĩa là routing cơ bản hoạt động.</p>
        
        <div className="mt-4 space-y-2">
          <p><strong>Route:</strong> /memes-simple</p>
          <p><strong>Status:</strong> ✅ Working</p>
        </div>
        
        <div className="mt-6">
          <a 
            href="/memes" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Full Memes Page
          </a>
        </div>
      </div>
      
      {/* Test API Connection */}
      <div className="mt-6 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">API Test</h2>
        <button
          onClick={async () => {
            try {
              console.log('Testing API connection...');
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/memes?page=0`);
              console.log('API Response Status:', response.status);
              
              if (response.ok) {
                const data = await response.json();
                console.log('API Data:', data);
                alert(`API OK: Found ${data.totalElements || 0} memes`);
              } else {
                console.error('API Error:', response.statusText);
                alert(`API Error: ${response.status} ${response.statusText}`);
              }
            } catch (error) {
              console.error('Network Error:', error);
              alert(`Network Error: ${error}`);
            }
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test API Connection
        </button>
      </div>
    </div>
  );
}