export const ProfileSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 rounded-t-lg"></div>
    <div className="bg-white p-6 rounded-b-lg shadow-lg">
      <div className="flex items-start gap-6 -mt-16">
        <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white"></div>
        <div className="flex-1 mt-16">
          <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mb-4"></div>
          <div className="flex gap-4">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);