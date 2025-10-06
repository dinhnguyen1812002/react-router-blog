import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/Avatar';
import { Button } from '~/components/ui/button';
import { upload, getFilePreview, cleanupPreview } from '~/api/uploads';
import { userApi } from '~/api/user';
import { useAuthStore } from '~/store/authStore';
import { cn } from '~/lib/utils';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  fallbackText: string;
  onSuccess?: (avatarUrl: string) => void;
  className?: string;
}

interface ImageValidation {
  valid: boolean;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSIONS = 100;
const MAX_DIMENSIONS = 2000;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

export function AvatarUpload({ 
  currentAvatarUrl, 
  fallbackText, 
  onSuccess,
  className 
}: AvatarUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<ImageValidation>({ valid: true });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        cleanupPreview(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateImage = useCallback(async (file: File): Promise<ImageValidation> => {
    // File type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${ALLOWED_TYPES.map(type => type.split('/')[1].toUpperCase()).join(', ')}`
      };
    }

    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File quá lớn. Kích thước tối đa: ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`
      };
    }

    // Image dimensions validation
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < MIN_DIMENSIONS || img.height < MIN_DIMENSIONS) {
          resolve({
            valid: false,
            error: `Ảnh quá nhỏ. Kích thước tối thiểu: ${MIN_DIMENSIONS}x${MIN_DIMENSIONS}px`
          });
        } else if (img.width > MAX_DIMENSIONS || img.height > MAX_DIMENSIONS) {
          resolve({
            valid: false,
            error: `Ảnh quá lớn. Kích thước tối đa: ${MAX_DIMENSIONS}x${MAX_DIMENSIONS}px`
          });
        } else {
          resolve({ valid: true });
        }
      };
      img.onerror = () => {
        resolve({
          valid: false,
          error: 'Không thể đọc file ảnh'
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const compressImage = useCallback((file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    // Clear previous validation
    setValidation({ valid: true });
    
    // Validate file
    const validationResult = await validateImage(file);
    if (!validationResult.valid) {
      setValidation(validationResult);
      return;
    }

    // Compress image if needed
    let processedFile = file;
    if (file.size > 2 * 1024 * 1024) { // Compress if larger than 2MB
      processedFile = await compressImage(file);
    }

    setSelectedFile(processedFile);
    setPreviewUrl(getFilePreview(processedFile));
  }, [validateImage, compressImage]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Upload file using uploads API
      const avatarUrl = await upload(file, (progress) => {
        setUploadProgress(progress.percentage);
      });
      
      // Update user profile with new avatar URL using existing updateProfile API
      const response = await userApi.updateProfile({ avatarUrl });
      return { avatarUrl, ...response.data };
    },
    onSuccess: (updatedUser) => {
      // Update user in auth store by calling login with updated user data
      const currentToken = useAuthStore.getState().token;
      if (currentToken) {
        // Create a proper User object with required fields
        const userData = {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          roles: user?.roles || [],
          avatar: updatedUser.avatarUrl,
          socialMediaLinks: user?.socialMediaLinks || []
        };
        useAuthStore.getState().login(userData, currentToken);
      }
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      onSuccess?.(updatedUser.avatarUrl || '');
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      setIsUploading(false);
    },
    onError: (error: any) => {
      setValidation({
        valid: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra khi tải lên ảnh'
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  });

  const handleUpload = useCallback(() => {
    if (selectedFile && validation.valid) {
      uploadAvatarMutation.mutate(selectedFile);
    }
  }, [selectedFile, validation.valid, uploadAvatarMutation]);

  const handleCancel = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      cleanupPreview(previewUrl);
      setPreviewUrl(null);
    }
    setValidation({ valid: true });
  }, [previewUrl]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const displayAvatarUrl = previewUrl || currentAvatarUrl;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Avatar Display */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex-shrink-0">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-lg">
            {/* <AvatarImage src={displayAvatarUrl} alt="User avatar" /> */}
            <AvatarFallback className="text-xl sm:text-2xl">
              {fallbackText}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900">Ảnh đại diện</h3>
          <p className="text-sm text-gray-600 mb-4">
            Tải lên ảnh JPG, PNG hoặc GIF. Kích thước tối đa 5MB, tối thiểu 100x100px.
          </p>
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Upload progress: ${uploadProgress}%`}
              />
            </div>
          )}
          
          {isUploading && (
            <p className="text-sm text-blue-600" role="status" aria-live="polite">
              Đang tải lên... {uploadProgress}%
            </p>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          validation.valid ? "" : "border-red-500 bg-red-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload avatar image"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerFileInput();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Select avatar image file"
        />
        
        <div className="space-y-3 sm:space-y-4">
          <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <div className="space-y-2">
            <p className="text-base sm:text-lg font-medium text-gray-900">
              {selectedFile ? 'Ảnh đã chọn' : 'Kéo thả ảnh vào đây'}
            </p>
            <p className="text-sm text-gray-600">
              hoặc{' '}
              <button
                type="button"
                onClick={triggerFileInput}
                className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
                disabled={isUploading}
                aria-describedby="file-requirements"
              >
                chọn file từ máy tính
              </button>
            </p>
            <p id="file-requirements" className="text-xs text-gray-500">
              JPG, PNG, GIF • Tối đa 5MB • Tối thiểu 100x100px
            </p>
          </div>
          
          {selectedFile && (
            <div className="text-sm text-gray-500 bg-gray-50 rounded-md p-3">
              <p className="font-medium">File đã chọn:</p>
              <p className="truncate" title={selectedFile.name}>
                {selectedFile.name}
              </p>
              <p>Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {!validation.valid && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
          <p className="text-sm text-red-600">{validation.error}</p>
        </div>
      )}

      {/* Action Buttons */}
      {selectedFile && validation.valid && !isUploading && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleUpload}
            className="flex-1"
            aria-label="Upload selected image"
          >
            Tải lên ảnh
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 sm:flex-none"
            aria-label="Cancel upload and remove selected file"
          >
            Hủy
          </Button>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Xem trước:</h4>
          <div className="flex justify-center">
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Preview of selected image"
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
