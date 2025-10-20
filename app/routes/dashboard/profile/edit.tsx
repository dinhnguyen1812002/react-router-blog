import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { 
  Save, 
  X, 
  Eye, 
  Edit3, 
  User, 
  Mail, 
  Globe, 
  FileText, 
  Link, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Facebook,
  ArrowLeft,
  Camera,
  Settings,
  Palette
} from 'lucide-react';

import { authApi } from '~/api/auth';
import { userApi } from '~/api/user';
import { ProfileSkeleton } from '~/components/skeleton/ProfileSkeleton';
import { ProfileHeader } from '~/components/profile/ProfileHeader';
import { MarkdownRenderer } from '~/components/profile/MarkdownRenderer';
import { AvatarUpload } from '~/components/profile/AvatarUpload';
import { ThemedInput, ThemedTextarea } from '~/components/ui/ThemedInput';
import { ThemedButton } from '~/components/ui/ThemedButton';
import { validateMarkdownContent } from '~/utils/markdown';
import type { ProfileUser } from '~/types';

// Form validation schema
const profileUpdateSchema = z.object({
  username: z.string().min(3, 'Tên người dùng phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  avatar: z.string().optional(),
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
      // Construct request body for userApi.updateProfile
      const requestBody = {
        displayName: data.username,
        email: data.email,
        avatarUrl: data.avatar,
        bio: data.bio,
        websiteUrl: data.website,
        githubUrl: data.socialMediaLinks?.GITHUB,
      };

      // Call update profile API using userApi
      return await userApi.updateProfile(requestBody);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="p-2 rounded-lg bg-white dark:bg-black shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Settings className="w-8 h-8 text-blue-600" />
                Edit Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Customize your profile information and appearance
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Avatar & Basic Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Avatar Section */}
              <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Camera className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Picture</h2>
                </div>
                <AvatarUpload
                  currentAvatarUrl={user.avatar}
                  fallbackText={user.username.charAt(0).toUpperCase()}
                  onSuccess={(avatarUrl) => {
                    setValue('avatar', avatarUrl, { shouldDirty: true });
                  }}
                />
                {errors.avatar && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errors.avatar.message}</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Profile Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Posts</span>
                    <span className="font-semibold">{user.postsCount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Comments</span>
                    <span className="font-semibold">{user.commentsCount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Saved</span>
                    <span className="font-semibold">{user.savedPostsCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4" />
                      Username
                    </label>
                    <ThemedInput
                      {...register('username')}
                      error={errors.username?.message}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <ThemedInput
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Globe className="w-4 h-4" />
                    Website
                  </label>
                  <ThemedInput
                    {...register('website')}
                    error={errors.website?.message}
                    placeholder="https://yourwebsite.com"
                    helperText="Your personal website or portfolio"
                  />
                </div>

                <div className="mt-6 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FileText className="w-4 h-4" />
                    Bio
                  </label>
                  <ThemedTextarea
                    {...register('bio')}
                    error={errors.bio?.message}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    helperText="A brief description about yourself (max 500 characters)"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Link className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Social Media</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      LinkedIn
                    </label>
                    <ThemedInput
                      {...register('socialMediaLinks.LINKEDIN')}
                      error={errors.socialMediaLinks?.LINKEDIN?.message}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Twitter className="w-4 h-4 text-blue-400" />
                      Twitter
                    </label>
                    <ThemedInput
                      {...register('socialMediaLinks.TWITTER')}
                      error={errors.socialMediaLinks?.TWITTER?.message}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      Instagram
                    </label>
                    <ThemedInput
                      {...register('socialMediaLinks.INSTAGRAM')}
                      error={errors.socialMediaLinks?.INSTAGRAM?.message}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Github className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                      GitHub
                    </label>
                    <ThemedInput
                      {...register('socialMediaLinks.GITHUB')}
                      error={errors.socialMediaLinks?.GITHUB?.message}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Profile Content */}
              <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Palette className="w-6 h-6 text-orange-600" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Custom Profile</h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPreview(false)}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                        !showPreview
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPreview(true)}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                        showPreview
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>

                {showPreview ? (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 min-h-[400px] bg-gray-50 dark:bg-black">
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <ThemedButton
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-8 py-3 text-lg"
              icon={<X className="w-5 h-5" />}
            >
              Cancel
            </ThemedButton>
            <ThemedButton
              type="submit"
              loading={updateProfileMutation.isPending}
              disabled={!isDirty}
              className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              icon={<Save className="w-5 h-5" />}
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </ThemedButton>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-600 dark:text-red-400">{submitError}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
