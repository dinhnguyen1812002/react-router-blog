import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, FolderOpen, FileText, Calendar, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CategoryModal from "~/components/admin/CategoryModal";
import { categoriesApi } from "~/api/categories";
import type { Category } from "~/types";

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Fetch categories
  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Danh mục đã được tạo thành công!");
      setShowAddModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo danh mục");
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Danh mục đã được cập nhật thành công!");
      setShowEditModal(false);
      setSelectedCategory(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật danh mục");
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Danh mục đã được xóa thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa danh mục");
    },
  });

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowAddModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      deleteCategoryMutation.mutate(categoryId.toString());
    }
  };

  const handleSubmitCategory = (categoryData: Partial<Category>) => {
    if (selectedCategory) {
      // Update existing category
      updateCategoryMutation.mutate({
        id: selectedCategory.id.toString(),
        data: categoryData
      });
    } else {
      // Create new category
      createCategoryMutation.mutate(categoryData);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Đang tải danh mục...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">Không thể tải danh sách danh mục</p>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Thử lại</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600">Quản lý các danh mục bài viết trong hệ thống</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={handleAddCategory}
            disabled={createCategoryMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {createCategoryMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>Thêm danh mục</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng danh mục</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kết quả tìm kiếm</p>
              <p className="text-2xl font-bold text-gray-900">{filteredCategories.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Search className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang tải</p>
              <p className="text-2xl font-bold text-gray-900">
                {isFetching ? "..." : "✓"}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <RefreshCw className={`h-6 w-6 text-purple-600 ${isFetching ? 'animate-spin' : ''}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trạng thái</p>
              <p className="text-2xl font-bold text-gray-900">
                {error ? "Lỗi" : "OK"}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              {error ? (
                <AlertCircle className="h-6 w-6 text-red-600" />
              ) : (
                <Calendar className="h-6 w-6 text-yellow-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">
            Tìm thấy {filteredCategories.length} danh mục
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                  <span className="text-xs text-gray-500">{category.slug}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  disabled={updateCategoryMutation.isPending}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
                >
                  {updateCategoryMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Edit className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={deleteCategoryMutation.isPending}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                >
                  {deleteCategoryMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>ID: {category.id}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: category.backgroundColor || '#3B82F6',
                    width: '100%'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      <CategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitCategory}
        mode="add"
      />

      {/* Edit Category Modal */}
      <CategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitCategory}
        initialData={selectedCategory}
        mode="edit"
      />
    </div>
  );
}