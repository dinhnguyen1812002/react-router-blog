import { useState } from "react";
import { Search, Plus, Edit, Trash2, Tags, FileText, TrendingUp, Hash } from "lucide-react";
import TagModal from "~/components/admin/TagModal";

const tags = [
  {
    id: 1,
    name: "React",
    description: "Thư viện JavaScript để xây dựng giao diện người dùng",
    postCount: 25,
    color: "#61DAFB",
    createdAt: "2024-01-15",
    trending: true
  },
  {
    id: 2,
    name: "JavaScript",
    description: "Ngôn ngữ lập trình phổ biến cho web development",
    postCount: 32,
    color: "#F7DF1E",
    createdAt: "2024-01-10",
    trending: true
  },
  {
    id: 3,
    name: "TypeScript",
    description: "Superset của JavaScript với static typing",
    postCount: 18,
    color: "#3178C6",
    createdAt: "2024-01-12",
    trending: false
  },
  {
    id: 4,
    name: "Node.js",
    description: "Runtime environment cho JavaScript",
    postCount: 15,
    color: "#339933",
    createdAt: "2024-01-18",
    trending: false
  },
  {
    id: 5,
    name: "CSS",
    description: "Cascading Style Sheets cho styling",
    postCount: 22,
    color: "#1572B6",
    createdAt: "2024-01-08",
    trending: true
  },
  {
    id: 6,
    name: "HTML",
    description: "HyperText Markup Language",
    postCount: 20,
    color: "#E34F26",
    createdAt: "2024-01-05",
    trending: false
  },
  {
    id: 7,
    name: "Vue.js",
    description: "Progressive JavaScript framework",
    postCount: 12,
    color: "#4FC08D",
    createdAt: "2024-01-20",
    trending: false
  },
  {
    id: 8,
    name: "Python",
    description: "Ngôn ngữ lập trình đa năng",
    postCount: 8,
    color: "#3776AB",
    createdAt: "2024-01-22",
    trending: false
  }
];

const colorOptions = [
  "#61DAFB", "#F7DF1E", "#3178C6", "#339933", "#1572B6", "#E34F26", 
  "#4FC08D", "#3776AB", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"
];

export default function AdminTags() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("postCount");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [newTag, setNewTag] = useState({
    name: "",
    description: "",
    color: colorOptions[0]
  });

  const filteredTags = tags
    .filter(tag =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "postCount") return b.postCount - a.postCount;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "createdAt") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const trendingTags = tags.filter(tag => tag.trending);
  const totalPosts = tags.reduce((sum, tag) => sum + tag.postCount, 0);

  const handleAddTag = () => {
    setSelectedTag(null);
    setShowAddModal(true);
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setShowEditModal(true);
  };

  const handleDeleteTag = (tagId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thẻ này?")) {
      console.log("Delete tag:", tagId);
    }
  };

  const handleSubmitTag = (tagData) => {
    console.log("Submit tag:", tagData);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thẻ</h1>
          <p className="text-gray-600">Quản lý các thẻ để phân loại bài viết</p>
        </div>
        <button 
          onClick={handleAddTag}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm thẻ</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng thẻ</p>
              <p className="text-2xl font-bold text-gray-900">{tags.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Tags className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Thẻ trending</p>
              <p className="text-2xl font-bold text-gray-900">{trendingTags.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
              <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trung bình/thẻ</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(totalPosts / tags.length)}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Hash className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Trending Tags */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
          Thẻ đang trending
        </h2>
        <div className="flex flex-wrap gap-3">
          {trendingTags.map(tag => (
            <div
              key={tag.id}
              className="flex items-center space-x-2 px-3 py-2 rounded-full border-2 border-dashed"
              style={{ borderColor: tag.color, backgroundColor: `${tag.color}20` }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <span className="text-sm font-medium text-gray-700">{tag.name}</span>
              <span className="text-xs text-gray-500">({tag.postCount})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thẻ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="postCount">Sắp xếp theo số bài viết</option>
            <option value="name">Sắp xếp theo tên</option>
            <option value="createdAt">Sắp xếp theo ngày tạo</option>
          </select>
          <div className="text-sm text-gray-500">
            {filteredTags.length} thẻ
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTags.map((tag) => (
          <div key={tag.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <h3 className="text-lg font-semibold text-gray-900">#{tag.name}</h3>
                {tag.trending && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handleEditTag(tag)}
                  className="text-gray-400 hover:text-blue-600 p-1"
                >
                  <Edit className="h-3 w-3" />
                </button>
                <button 
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-gray-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tag.description}</p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-gray-500">
                <FileText className="h-3 w-3" />
                <span>{tag.postCount} bài viết</span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(tag.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    backgroundColor: tag.color,
                    width: `${Math.min((tag.postCount / Math.max(...tags.map(t => t.postCount))) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Tag Modal */}
      <TagModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitTag}
        mode="add"
      />

      {/* Edit Tag Modal */}
      <TagModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitTag}
        initialData={selectedTag}
        mode="edit"
      />
    </div>
  );
}