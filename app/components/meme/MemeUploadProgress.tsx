import { CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface MemeUploadProgressProps {
  isUploading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: string;
  fileCount: number;
}

export const MemeUploadProgress = ({
  isUploading,
  isSuccess,
  isError,
  error,
  fileCount
}: MemeUploadProgressProps) => {
  if (!isUploading && !isSuccess && !isError) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {/* Uploading State */}
      {isUploading && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Upload className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                Đang tải lên meme...
              </h4>
              <p className="text-xs text-gray-500">
                {fileCount} file đang được xử lý
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      )}

      {/* Success State */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-900">
                Tải lên thành công!
              </h4>
              <p className="text-xs text-green-700">
                {fileCount} meme đã được thêm vào thư viện
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-900">
                Lỗi tải lên
              </h4>
              <p className="text-xs text-red-700">
                {error || 'Có lỗi xảy ra khi tải lên meme'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
