import { Link } from "react-router";
import { Button } from "../ui/button";
import { useAuthStore } from "~/store/authStore";
import { useHydration } from "~/hooks/useHydration";
import { UserDropdown } from "./UserDropdown";
import { ThemeSwitch } from "../ui/ThemeToggle";

import NotificationCenter from "../notification/NotificationCenter";

export const Header = () => {
  const { user, isAuthenticated } = useAuthStore();
  const isHydrated = useHydration();

  // Prevent hydration mismatch by not showing auth state until hydrated
  const showAuthState = isHydrated && isAuthenticated;

  return (
    <header className="bg-white dark:bg-black shadow-sm dark:shadow-gray-900/20 border-b border-gray-200 dark:border-gray-700  ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {/* <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">BlogPlatform</h1> */}
            <img src="/blog_logo.png" className="w-52 h-full object-contain " />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/posts"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Bài viết
            </Link>
            <Link
              to="/series"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Series
            </Link>
            <Link
              to="/memes"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
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

            {/* <div className="flex items-center">
              <ThemeSwitch />
            </div> */}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/posts/new" className="">
              <Button
                variant={"ghost"}
                className="border border-dashed text-gray-700  
                            transition-colors dark:text-white"
              >
                Viết bài
              </Button>
            </Link>
              <ThemeSwitch />
            {showAuthState && user ? (
              <>
                <NotificationCenter />
                <UserDropdown user={user} />
              </>
            ) : (
              <div className="flex items-center space-x-2">
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
