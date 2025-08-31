import { useLoaderData, useParams } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { userApi } from '~/api/user';
import { ProfileHeader } from '~/components/profile/ProfileHeader';
import { MarkdownRenderer } from '~/components/profile/MarkdownRenderer';
import { Card } from '~/components/ui/Card';

export async function loader({ params }: LoaderFunctionArgs) {
  const { username } = params;
  try {
    const response = await userApi.getPublicProfile(username || '');
    return json({ user: response.data });
  } catch (error) {
    throw new Response('Profile not found', { status: 404 });
  }
}

export default function PublicProfilePage() {
  const { user } = useLoaderData<typeof loader>();
  const { username } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <ProfileHeader user={user} isOwnProfile={false} />

        {/* Bio Section */}
        {user.bio && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
          </Card>
        )}

        {/* Website Link */}
        {user.website && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-semibold mb-4">Website</h2>
            <a 
              href={user.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {user.website}
            </a>
          </Card>
        )}

        {/* Social Media Links */}
        {user.socialMediaLinks && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-semibold mb-4">Connect</h2>
            <div className="flex flex-wrap gap-4">
              {user.socialMediaLinks.GITHUB && (
                <a 
                  href={user.socialMediaLinks.GITHUB} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </a>
              )}
              {user.socialMediaLinks.TWITTER && (
                <a 
                  href={user.socialMediaLinks.TWITTER} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </a>
              )}
              {/* Add other social media icons as needed */}
            </div>
          </Card>
        )}

        {/* Custom Profile Content */}
        {user.customProfileMarkdown && (
          <Card className="mt-6 p-6">
            <MarkdownRenderer content={user.customProfileMarkdown} />
          </Card>
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Profile Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
