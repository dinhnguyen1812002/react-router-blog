export default function MemesBasic() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Memes Basic</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Basic Meme Page</h2>
        <p>This is the most basic meme page without any imports or complex logic.</p>
        
        <div className="mt-6 space-y-3">
          <a 
            href="/memes-debug" 
            className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
          >
            Go to Debug Page
          </a>
          
          <a 
            href="/memes" 
            className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
          >
            Try Full Memes Page
          </a>
        </div>
      </div>
    </div>
  );
}