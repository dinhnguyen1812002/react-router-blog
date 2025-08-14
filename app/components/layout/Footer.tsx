export const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">BlogPlatform</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Nền tảng chia sẻ kiến thức và giải trí với blog và memes chất lượng cao.
            </p>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">Liên kết</h4>
            <ul className="space-y-2">
              <li><a href="/blog-frontend/public" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Trang chủ</a></li>
              <li><a href="/posts" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Bài viết</a></li>
              <li><a href="/memes" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Memes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">Liên hệ</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Email: contact@blogplatform.com<br />
              Phone: +84 123 456 789
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 BlogPlatform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};