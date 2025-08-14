import { useState } from "react";
import { Search, Plus, Edit, Trash2, FolderOpen, FileText, Calendar } from "lucide-react";
import CategoryModal from "~/components/admin/CategoryModal";
import type { Category } from "~/types";

const categories = [
  {
    id: 1,
    name: "Technology",
    description: "Các bài viết về công nghệ, lập trình, và phát triển phần mềm",
    postCount: 45,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    status: "active"
  },
  {
    id: 2,
    name: "Lifestyle",
    description: "Chia sẻ về cuộc sống, sức khỏe, và phong cách sống",
    postCount: 23,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-19",
    status: "active"
  },
  {
    id: 3,
    name: "Business",
    description: "Kinh doanh, khởi nghiệp, và phát triển sự nghiệp",
    postCount: 12,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
    status: "active"
  },
  {
    id: 4,
    name: "Travel",
    description: "Du lịch, khám phá, và trải nghiệm",
    postCount: 8,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    status: "inactive"
  },
];

export default function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    status: "active"
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowAddModal(true);
  };

  const handleEditCategory = (category : Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      // Handle delete logic here
      console.log("Delete category:", categoryId);
    }
  };

  const handleSubmitCategory = (categoryData) => {
    console.log("Submit category:", categoryData);
    // Handle form submission logic here
    setShowAddModal(false);
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600">Quản lý các danh mục bài viết trong hệ thống</p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm danh mục</span>
        </button>
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
              <p className="text-sm font-medium text-gray-600">Danh mục hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FolderOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, c) => sum + c.postCount, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trung bình bài viết</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(categories.reduce((sum, c) => sum + c.postCount, 0) / categories.length)}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <FileText className="h-6 w-6 text-yellow-600" />
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
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEditCategory(category)}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>{category.postCount} bài viết</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(category.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Cập nhật: {new Date(category.updatedAt).toLocaleDateString('vi-VN')}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Xem bài viết →
                </button>
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