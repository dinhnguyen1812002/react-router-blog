import { Upload } from "lucide-react";
import { useState } from "react";
import { uploadMeme, uploadMultipleMemes, type MemeUploadData } from "~/api/memes";
import { useAuth } from "~/hooks/useAuth";

export default function MemeUpload() {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'multiple'>('single');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setTitles(new Array(selectedFiles.length).fill(''));
  };

  const handleTitleChange = (index: number, title: string) => {
    const newTitles = [...titles];
    newTitles[index] = title;
    setTitles(newTitles);
  };

  const handleSingleUpload = async () => {
    if (!files[0] || !titles[0] || !user) return;

    setIsUploading(true);
    try {
      const memeData: MemeUploadData = {
        name: titles[0],
        userId: user.id
      };
      
      const result = await uploadMeme(files[0], memeData);
      alert('Meme uploaded successfully!');
      
      // Reset form
      setFiles([]);
      setTitles([]);
    } catch (error) {
      alert(`Upload failed: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleUpload = async () => {
    if (files.length === 0 || !user) return;

    const memesData: MemeUploadData[] = files.map((_, index) => ({
      name: titles[index] || `Meme ${index + 1}`,
      userId: user.id
    }));

    setIsUploading(true);
    try {
      const results = await uploadMultipleMemes(files, memesData);
      alert(`${results.length} memes uploaded successfully!`);
      
      // Reset form
      setFiles([]);
      setTitles([]);
    } catch (error) {
      alert(`Upload failed: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p>Bạn cần đăng nhập để upload meme.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Tạo Meme Mới
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Chia sẻ những khoảnh khắc hài hước với cộng đồng
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Upload Mode Toggle */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Chế độ upload:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                value="single"
                checked={uploadMode === 'single'}
                onChange={(e) => setUploadMode(e.target.value as 'single')}
                className="sr-only"
              />
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                uploadMode === 'single'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  uploadMode === 'single'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {uploadMode === 'single' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`font-medium ${
                  uploadMode === 'single'
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Upload một meme
                </span>
              </div>
            </label>
            
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                value="multiple"
                checked={uploadMode === 'multiple'}
                onChange={(e) => setUploadMode(e.target.value as 'multiple')}
                className="sr-only"
              />
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                uploadMode === 'multiple'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  uploadMode === 'multiple'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {uploadMode === 'multiple' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`font-medium ${
                  uploadMode === 'multiple'
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Upload nhiều meme
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="p-6">
          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Chọn file ảnh:
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple={uploadMode === 'multiple'}
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-700/50">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Kéo thả file vào đây hoặc click để chọn
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* Title Inputs */}
          {files.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tiêu đề meme:
              </label>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    <input
                      type="text"
                      placeholder={`Tiêu đề cho ${file.name}`}
                      value={titles[index] || ''}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={uploadMode === 'single' ? handleSingleUpload : handleMultipleUpload}
            disabled={isUploading || files.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang upload...
              </div>
            ) : (
              `🚀 Upload ${uploadMode === 'single' ? 'Meme' : `${files.length} Memes`}`
            )}
          </button>
        </div>

        {/* Preview */}
        {files.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Preview ({files.length} file{files.length > 1 ? 's' : ''}):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600">
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {index + 1}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                      {file.name}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {titles[index] || 'Chưa có tiêu đề'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}