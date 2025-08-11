import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { upload, validateFile, getFilePreview, cleanupPreview, type UploadProgress } from '~/api/uploads';
import { Button } from './button';
import { 
  Upload as UploadIcon, 
  X, 
  Image as ImageIcon, 
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react';

interface ThumbnailUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  className?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

export default function ThumbnailUpload({
  value,
  onChange,
  onRemove,
  className = '',
  maxSize = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}: ThumbnailUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => upload(file, setUploadProgress),
    onSuccess: (url: string) => {
      onChange(url);
      handleCleanup();
      setUploadProgress(null);
    },
    onError: (error: any) => {
      console.error('Upload failed:', error);
      setValidationError('Upload thất bại. Vui lòng thử lại.');
      setUploadProgress(null);
    },
  });

  const handleCleanup = () => {
    if (previewUrl) {
      cleanupPreview(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setValidationError(null);
  };

  const handleFileSelect = (file: File) => {
    // Validate file
    const validation = validateFile(file, {
      maxSize: maxSize * 1024 * 1024,
      allowedTypes
    });

    if (!validation.valid) {
      setValidationError(validation.error || 'File không hợp lệ');
      return;
    }

    // Clean up previous preview
    if (previewUrl) {
      cleanupPreview(previewUrl);
    }

    // Set new file and preview
    setSelectedFile(file);
    setPreviewUrl(getFilePreview(file));
    setValidationError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleCancel = () => {
    handleCleanup();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onRemove();
    handleCleanup();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current uploaded image */}
      {value && !selectedFile && (
        <div className="relative group">
          <img 
            src={value} 
            alt="Thumbnail" 
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Xóa ảnh
            </Button>
          </div>
        </div>
      )}

      {/* Upload area */}
      {!value && !selectedFile && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept={allowedTypes.join(',')}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Kéo thả ảnh vào đây
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                hoặc click để chọn file
              </p>
            </div>
            
            <div className="text-xs text-gray-400 dark:text-gray-500">
              <p>Hỗ trợ: JPG, PNG, GIF, WebP</p>
              <p>Kích thước tối đa: {maxSize}MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Preview and upload controls */}
      {selectedFile && previewUrl && (
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600" 
            />
            
            {/* Upload progress overlay */}
            {uploadMutation.isPending && uploadProgress && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-sm font-medium">Đang upload...</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {uploadProgress.percentage}% ({formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)})
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* File info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400">Hợp lệ</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
              className="flex-1"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang upload...
                </>
              ) : (
                <>
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload ảnh
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={uploadMutation.isPending}
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Error message */}
      {validationError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
        </div>
      )}
    </div>
  );
}