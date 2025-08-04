import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/Card';
import { MemeUploadProgress } from './MemeUploadProgress';
import { MemeUploadTips } from './MemeUploadTips';

import { Upload, X, Image, Plus, Check } from 'lucide-react';
import { memesApi } from '~/api/memes';


interface MemeUploadProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

interface FileWithPreview extends File {
  preview?: string;
  title?: string;
}

export const MemeUpload = ({ onSuccess, onClose }: MemeUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Debug logging
  console.log('MemeUpload - files.length:', files.length);

  const uploadMutation = useMutation({
    mutationFn: async (data: { files: File[]; titles: string[] }) => {
      // TODO: Implement upload logic when authentication is ready
      console.log('Upload data:', data);

      // Simulate upload for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 2000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memes'] });
      setFiles([]);
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles)
      .filter(file => file.type.startsWith('image/'))
      .map(file => {
        const fileWithPreview = file as FileWithPreview;
        fileWithPreview.preview = URL.createObjectURL(file);
        fileWithPreview.title = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
        return fileWithPreview;
      });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateTitle = (index: number, title: string) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles[index].title = title;
      return newFiles;
    });
  };

  const handleUpload = () => {
    if (files.length === 0) return;

    const titles = files.map(file => file.title || file.name);
    uploadMutation.mutate({ files, titles });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main Upload Card */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-2xl font-bold">Tải lên Meme</h2>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Upload Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-blue-800 text-sm">
              📤 Sẵn sàng tải lên meme. Chọn file để bắt đầu!
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 cursor-pointer'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">
            Kéo thả file hoặc click để chọn
          </h3>
          <p className="text-gray-500 mb-4">
            Hỗ trợ: JPG, PNG, GIF (tối đa 10MB mỗi file)
          </p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Chọn file
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {/* File Preview */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              File đã chọn ({files.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((file, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Tiêu đề meme:
                      </label>
                      <input
                        type="text"
                        value={file.title || ''}
                        onChange={(e) => updateTitle(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tiêu đề cho meme..."
                      />
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {files.length > 0 && (
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setFiles([])}
              disabled={uploadMutation.isPending}
            >
              Xóa tất cả
            </Button>

            <Button
              onClick={handleUpload}
              disabled={uploadMutation.isPending || files.length === 0}
              className="min-w-[120px]"
            >
              {uploadMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tải...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Tải lên ({files.length})</span>
                </div>
              )}
            </Button>
          </div>
        )}

        {/* Upload Progress */}
        <MemeUploadProgress
          isUploading={uploadMutation.isPending}
          isSuccess={uploadMutation.isSuccess}
          isError={uploadMutation.isError}
          error={uploadMutation.error?.message}
          fileCount={files.length}
        />
        </CardContent>
      </Card>

      {/* Tips Card */}
      <MemeUploadTips />
    </div>
  );
};
