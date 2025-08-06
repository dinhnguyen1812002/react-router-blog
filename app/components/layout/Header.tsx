import { Link } from 'react-router';
import { Button } from '../ui/button';
import { useAuthStore } from '~/store/authStore';
import { useHydration } from '~/hooks/useHydration';
import { UserDropdown } from './UserDropdown';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Header = () => {
  const { user, isAuthenticated } = useAuthStore();
  const isHydrated = useHydration();

  // Prevent hydration mismatch by not showing auth state until hydrated
  const showAuthState = isHydrated && isAuthenticated;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">BlogPlatform</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Trang chủ
            </Link>
            <Link to="/posts" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Bài viết
            </Link>
            <Link to="/memes" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Memes
            </Link>
            {/*<Link to="/comment-test" className="text-gray-700 hover:text-blue-600 transition-colors">*/}
            {/*  Comment Test*/}
            {/*</Link>*/}
            {/*<Link to="/post-actions-test" className="text-gray-700 hover:text-blue-600 transition-colors">*/}
            {/*  Like & Rating Test*/}
            {/*</Link>*/}
            {/*<Link to="/responsive-test" className="text-gray-700 hover:text-blue-600 transition-colors">*/}
            {/*  Responsive Test*/}
            {/*</Link>*/}


          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {showAuthState && user ? (
              <UserDropdown user={user} />
            ) : (
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};