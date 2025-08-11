
import { apiClient } from './client';
import { apiEndpoints } from '~/utils/api';
import type { Upload } from '~/types';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  contentType: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Upload single file with progress tracking
export const upload = async (
  file: File, 
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post<Upload>(
    '/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage
          });
        }
      }
    }
  );
  
  return response.data.url;
};

// Upload multiple files
export const uploadMultiple = async (
  files: File[],
  onProgress?: (progress: UploadProgress) => void
): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });
  
  const response = await apiClient.post<{ urls: string[] }>(
    '/upload/multiple',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage
          });
        }
      }
    }
  );
  
  return response.data.urls;
};

// Validate file before upload
export const validateFile = (file: File, options?: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}): { valid: boolean; error?: string } => {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] } = options || {};
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File quá lớn. Kích thước tối đa: ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`
    };
  }
  
  return { valid: true };
};

// Get file preview URL
export const getFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

// Clean up preview URL
export const cleanupPreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
