import { useState } from "react";
import MemeListSimple from "~/components/meme/MemeListSimple";

export default function MemesDebug() {
  const [activeTab, setActiveTab] = useState<'simple' | 'info'>('simple');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Memes Debug</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 flex">
            <button
              onClick={() => setActiveTab('simple')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'simple'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Simple List
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'info'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Debug Info
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'simple' && <MemeListSimple />}
          
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
                <div className="space-y-2 text-sm">
                  <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL}/memes</p>
                  <p><strong>Expected Response:</strong> MemeResponse interface</p>
                  <p><strong>Current Route:</strong> /memes-debug</p>
                  <p><strong>Main Route:</strong> /memes</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
                <ul className="space-y-2 text-sm">
                  <li>• Backend server not running on port 8888</li>
                  <li>• CORS issues between frontend and backend</li>
                  <li>• API endpoint not implemented</li>
                  <li>• Network connectivity issues</li>
                  <li>• Type mismatch in response data</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Quick Tests</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      fetch(`${import.meta.env.VITE_API_BASE_URL}/memes?page=0`)
                        .then(res => {
                          console.log('Status:', res.status);
                          return res.json();
                        })
                        .then(data => {
                          console.log('Data:', data);
                          alert('Check console for API response');
                        })
                        .catch(err => {
                          console.error('Error:', err);
                          alert(`Error: ${err.message}`);
                        });
                    }}
                    className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Test API Call (Check Console)
                  </button>
                  
                  <a
                    href={`${import.meta.env.VITE_API_BASE_URL}/memes?page=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
                  >
                    Open API in New Tab
                  </a>
                  
                  <a
                    href="/memes"
                    className="block w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-center"
                  >
                    Try Full Memes Page
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}