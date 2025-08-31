import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Save, X, Eye, Edit3 } from 'lucide-react';

import { authApi } from '~/api/auth';
import { userApi } from '~/api/user';
import { ProfileSkeleton } from '~/components/skeleton/ProfileSkeleton';
import { ProfileHeader } from '~/components/profile/ProfileHeader';
import { MarkdownRenderer } from '~/components/profile/MarkdownRenderer';
import { ThemedInput, ThemedTextarea } from '~/components/ui/ThemedInput';
import { ThemedButton } from '~/components/ui/ThemedButton';
import { validateMarkdownContent } from '~/utils/markdown';
import type { ProfileUser } from '~/types';

// Form validation schema
const profileUpdateSchema = z.object({
  username: z.string().min(3, 'Tên người dùng phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  avatar: z.string().url('URL ảnh đại diện không hợp lệ').optional(),
  bio: z.string().max(500, 'Giới thiệu không quá 500 ký tự').optional(),
  website: z.string().url('URL website không hợp lệ').optional(),
  socialMediaLinks: z.object({
    LINKEDIN: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
    TWITTER: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
    INSTAGRAM: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
    FACEBOOK: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
    GITHUB: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  }).optional(),
  customProfileMarkdown: z.string().max(10000, 'Nội dung không quá 10000 ký tự').optional(),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// API service for profile data
const apiService = {
  profile: async (): Promise<ApiResponse<ProfileUser>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await authApi.profile();
    return response;
  }
};

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPreview, setShowPreview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: apiService.profile,
    staleTime: 1000 * 60 * 5,
  });

  const defaultValues = {
    username: response?.data?.username || '',
    email: response?.data?.email || '',
    avatar: response?.data?.avatar || '',
    bio: response?.data?.bio || '',
    website: response?.data?.website || '',
    socialMediaLinks: {
      LINKEDIN: response?.data?.socialMediaLinks?.LINKEDIN || '',
      TWITTER: response?.data?.socialMediaLinks?.TWITTER || '',
      INSTAGRAM: response?.data?.socialMediaLinks?.INSTAGRAM || '',
      FACEBOOK: response?.data?.socialMediaLinks?.FACEBOOK || '',
      GITHUB: response?.data?.socialMediaLinks?.GITHUB || '',
    },
    customProfileMarkdown: response?.data?.customProfileMarkdown || '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues,
  });

  // Reset form when data loads
  useEffect(() => {
    if (response?.data) {
      const data = response.data;
      reset({
        username: data.username || '',
        email: data.email || '',
        avatar: data.avatar || '',
        bio: data.bio || '',
        website: data.website || '',
        customProfileMarkdown: data.customProfileMarkdown || '',
        socialMediaLinks: {
          LINKEDIN: data.socialMediaLinks?.LINKEDIN || '',
          TWITTER: data.socialMediaLinks?.TWITTER || '',
          INSTAGRAM: data.socialMediaLinks?.INSTAGRAM || '',
          FACEBOOK: data.socialMediaLinks?.FACEBOOK || '',
          GITHUB: data.socialMediaLinks?.GITHUB || '',
        },
      });
    }
  }, [response?.data, reset]);

  const markdownContent = watch('customProfileMarkdown');

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateForm) => {
      // Construct request body according to new API spec
      const requestBody = {
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        bio: data.bio,
        website: data.website,
        socialMediaLinks: data.socialMediaLinks,
      };

      // Call update profile API
      return await authApi.updateProfile(requestBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigate('/dashboard/profile');
    },
    onError: (error: any) => {
      setSubmitError(error.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data: ProfileUpdateForm) => {
    setSubmitError(null);

    // Validate markdown content before submission
    if (data.customProfileMarkdown) {
      const validation = validateMarkdownContent(data.customProfileMarkdown);
      if (!validation.isValid) {
        setSubmitError(validation.errors.join(', '));
        return;
      }
    }

    updateProfileMutation.mutate(data);
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/dashboard/profile');
      }
    } else {
      navigate('/dashboard/profile');
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  
  if (error) return <div>Error loading profile</div>;
  
  if (!response?.data) return <div>No profile data found</div>;

  const user = response.data;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <ProfileHeader user={user} isOwnProfile={true} showEditButton={false} />

      {/* Edit Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Thông tin cá nhân</h2>
          
          <div className="space-y-4">
            <ThemedInput
              label="Tên người dùng"
              {...register('username')}
              error={errors.username?.message}
              placeholder="Nhập tên người dùng"
              required
            />
            <ThemedInput
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="Nhập email"
              required
            />
            <ThemedInput
              label="Ảnh đại diện (URL)"
              {...register('avatar')}
              error={errors.avatar?.message}
              placeholder="https://example.com/avatar.png"
            />
            <ThemedInput
              label="Website cá nhân"
              {...register('website')}
              error={errors.website?.message}
              placeholder="https://example.com"
              helperText="Đường dẫn đến website cá nhân của bạn"
            />
            <ThemedTextarea
              label="Giới thiệu bản thân"
              {...register('bio')}
              error={errors.bio?.message}
              placeholder="Giới thiệu ngắn gọn về bản thân..."
              rows={3}
              helperText="Mô tả ngắn gọn về bản thân (tối đa 500 ký tự)"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white dark:bg-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Social Media Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ThemedInput
              label="LinkedIn"
              {...register('socialMediaLinks.LINKEDIN')}
              error={errors.socialMediaLinks?.LINKEDIN?.message}
              placeholder="https://linkedin.com/in/username"
            />
            <ThemedInput
              label="Twitter"
              {...register('socialMediaLinks.TWITTER')}
              error={errors.socialMediaLinks?.TWITTER?.message}
              placeholder="https://twitter.com/username"
            />
            <ThemedInput
              label="Instagram"
              {...register('socialMediaLinks.INSTAGRAM')}
              error={errors.socialMediaLinks?.INSTAGRAM?.message}
              placeholder="https://instagram.com/username"
            />
            <ThemedInput
              label="GitHub"
              {...register('socialMediaLinks.GITHUB')}
              error={errors.socialMediaLinks?.GITHUB?.message}
              placeholder="https://github.com/username"
            />
          </div>
        </div>

        {/* Custom Profile Content */}
        <div className="bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Custom Profile Content</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  !showPreview
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Edit3 className="w-4 h-4 inline mr-1" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  showPreview
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Preview
              </button>
            </div>
          </div>

          {showPreview ? (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[300px]">
              <MarkdownRenderer content={markdownContent || ''} />
            </div>
          ) : (
            <ThemedTextarea
              {...register('customProfileMarkdown')}
              error={errors.customProfileMarkdown?.message}
              placeholder="# Welcome to my profile!

I'm a passionate developer who loves working on open source projects.

## Skills
- **Languages:** JavaScript, TypeScript, Python
- **Frameworks:** React, Node.js, Express

## Latest Posts
{{latest_posts}}

**Total Posts:** {{post_count}}"
              rows={12}
              helperText="Use Markdown to customize your profile. You can use placeholders like {{latest_posts}} and {{post_count}} for dynamic content."
            />
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <ThemedButton
            type="button"
            variant="outline"
            onClick={handleCancel}
            icon={<X className="w-4 h-4" />}
          >
            Cancel
          </ThemedButton>
          <ThemedButton
            type="submit"
            loading={updateProfileMutation.isPending}
            disabled={!isDirty}
            icon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </ThemedButton>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{submitError}</p>
          </div>
        )}
      </form>
    </div>
  );
}
