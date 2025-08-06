import { useState } from "react";
import {
  uploadMeme,
  uploadMultipleMemes,
  getMemes,
  createRandomMemeStream,
} from "~/api/memes";
import { useAuth } from "~/hooks/useAuth";

export default function MemeTest() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const testUploadSingle = async () => {
    if (!user) {
      addResult("❌ Cần đăng nhập để test upload");
      return;
    }

    setLoading(true);
    try {
      // Create a test file
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = "#333";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Test Meme", 200, 150);
      }

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "test-meme.png", { type: "image/png" });
          const memeData = {
            title: `Test Meme ${Date.now()}`,
            userId: user.id,
          };

          try {
            const result = await uploadMeme(file, memeData);
            addResult(`✅ Upload single meme thành công: ${result.title}`);
          } catch (error) {
            addResult(`❌ Upload single meme thất bại: ${error}`);
          }
        }
      });
    } catch (error) {
      addResult(`❌ Lỗi tạo test file: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testUploadMultiple = async () => {
    if (!user) {
      addResult("❌ Cần đăng nhập để test upload");
      return;
    }

    setLoading(true);
    try {
      const files: File[] = [];
      const memesData = [];

      // Create 2 test files
      for (let i = 0; i < 2; i++) {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = i === 0 ? "#ffcccc" : "#ccffcc";
          ctx.fillRect(0, 0, 400, 300);
          ctx.fillStyle = "#333";
          ctx.font = "20px Arial";
          ctx.textAlign = "center";
          ctx.fillText(`Test Meme ${i + 1}`, 200, 150);
        }

        await new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `test-meme-${i + 1}.png`, {
                type: "image/png",
              });
              files.push(file);
              memesData.push({
                title: `Test Multiple Meme ${i + 1} - ${Date.now()}`,
                userId: user.id,
              });
            }
            resolve();
          });
        });
      }

      const results = await uploadMultipleMemes(files, memesData);
      addResult(`✅ Upload multiple memes thành công: ${results.length} memes`);
    } catch (error) {
      addResult(`❌ Upload multiple memes thất bại: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetMemes = async () => {
    setLoading(true);
    try {
      const result = await getMemes(0);
      addResult(
        `✅ Get memes thành công: ${result.content.length} memes, tổng ${result.totalElements}`
      );
    } catch (error) {
      addResult(`❌ Get memes thất bại: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testRandomStream = () => {
    try {
      const eventSource = createRandomMemeStream(
        (meme) => {
          addResult(`🎲 Nhận random meme: ${meme.name}`);
        },
        (error) => {
          addResult(`❌ Stream error: ${error.message}`);
        }
      );

      addResult(`✅ Random stream đã kết nối`);

      // Auto disconnect after 30 seconds for testing
      setTimeout(() => {
        eventSource.close();
        addResult(`🔌 Stream đã ngắt kết nối (auto after 30s)`);
      }, 30000);
    } catch (error) {
      addResult(`❌ Không thể kết nối stream: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Meme API Test</h1>

        {!user && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
            <p>⚠️ Bạn cần đăng nhập để test upload memes</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Test Buttons */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Functions</h2>

            <button
              onClick={testUploadSingle}
              disabled={loading || !user}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Test Upload Single Meme
            </button>

            <button
              onClick={testUploadMultiple}
              disabled={loading || !user}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Test Upload Multiple Memes
            </button>

            <button
              onClick={testGetMemes}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
            >
              Test Get Memes List
            </button>

            <button
              onClick={testRandomStream}
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400"
            >
              Test Random Stream (30s)
            </button>

            <button
              onClick={clearResults}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Results
            </button>
          </div>

          {/* API Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">API Endpoints</h2>
            <div className="text-sm space-y-2">
              <div className="p-3 bg-gray-100 rounded">
                <strong>Upload Single:</strong>
                <br />
                POST /api/v1/memes/upload
              </div>
              <div className="p-3 bg-gray-100 rounded">
                <strong>Upload Multiple:</strong>
                <br />
                POST /api/v1/memes/upload/multiple
              </div>
              <div className="p-3 bg-gray-100 rounded">
                <strong>Get List:</strong>
                <br />
                GET /api/v1/memes?page=0
              </div>
              <div className="p-3 bg-gray-100 rounded">
                <strong>Random Stream:</strong>
                <br />
                GET /api/v1/memes/random-stream
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">Test Results:</h3>
            {loading && <span className="text-yellow-400">⏳ Loading...</span>}
          </div>
          {testResults.length === 0 ? (
            <p className="text-gray-500">Chưa có kết quả test nào...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a
            href="/memes"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Đi đến Meme Hub →
          </a>
        </div>
      </div>
    </div>
  );
}
