import { useState, useEffect } from "react";

export default function MemeListSimple() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching memes...');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/memes?page=0`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('API Result:', result);
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">Loading memes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 rounded p-4">
        <h3 className="font-bold text-red-800">Error Loading Memes</h3>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Memes (Simple)</h2>
      
      {data ? (
        <div className="bg-green-100 border border-green-400 rounded p-4">
          <h3 className="font-bold text-green-800">API Success!</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>Total Elements: {data.totalElements || 0}</p>
            <p>Total Pages: {data.totalPages || 0}</p>
            <p>Current Page: {data.pageNumber || 0}</p>
            <p>Content Length: {data.content?.length || 0}</p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 rounded p-4">
          <p className="text-yellow-700">No data received</p>
        </div>
      )}

      {data?.content && data.content.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.content.map((meme: any, index: number) => (
            <div key={meme.id || index} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{meme.name || 'Unnamed Meme'}</h3>
              {meme.description && (
                <p className="text-gray-600 text-sm mt-1">{meme.description}</p>
              )}
              {meme.memeUrl && (
                <img 
                  src={meme.memeUrl} 
                  alt={meme.name || 'Meme'} 
                  className="w-full h-32 object-cover mt-2 rounded"
                  onError={(e) => {
                    console.error('Image load error:', meme.memeUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}