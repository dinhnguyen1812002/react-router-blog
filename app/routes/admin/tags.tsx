import { useState } from "react";
import { Search, Plus, Edit, Trash2, Tags, FileText, TrendingUp, Hash, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TagModal from "~/components/admin/TagModal";
import { tagsApi } from "~/api/tags";
import type { Tag } from "~/types";

export default function AdminTags() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  // Fetch tags
  const {
    data: tags = [],
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: tagsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success("Thẻ đã được tạo thành công!");
      setShowAddModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo thẻ");
    },
  });

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tag> }) =>
      tagsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success("Thẻ đã được cập nhật thành công!");
      setShowEditModal(false);
      setSelectedTag(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thẻ");
    },
  });

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: tagsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success("Thẻ đã được xóa thành công!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa thẻ");
    },
  });
  // Filter tags based on search term
  const filteredTags = tags.filter(tag =>
    tag.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTag = () => {
    setSelectedTag(null);
    setShowAddModal(true);
  };

  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag);
    setShowEditModal(true);
  };

  const handleDeleteTag = (tagId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thẻ này?")) {
      deleteTagMutation.mutate(tagId);
    }
  };

  const handleSubmitTag = (tagData: Partial<Tag>) => {
    if (selectedTag) {
      // Update existing tag
      updateTagMutation.mutate({
        id: selectedTag.uuid,
        data: tagData
      });
    } else {
      // Create new tag
      createTagMutation.mutate(tagData);
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
        <span className="ml-2 text-gray-600">Đang tải thẻ...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">Không thể tải danh sách thẻ</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thẻ</h1>
          <p className="text-gray-600">Quản lý các thẻ để phân loại bài viết</p>
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
            onClick={handleAddTag}
            disabled={createTagMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {createTagMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>Thêm thẻ</span>
          </button>
        </div>
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
              <p className="text-sm font-medium text-gray-600">Kết quả tìm kiếm</p>
              <p className="text-2xl font-bold text-gray-900">{filteredTags.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
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
                <Hash className="h-6 w-6 text-yellow-600" />
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
              placeholder="Tìm kiếm thẻ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">
            Tìm thấy {filteredTags.length} thẻ
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      {filteredTags.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Tags className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "Không tìm thấy thẻ" : "Chưa có thẻ nào"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? `Không có thẻ nào phù hợp với "${searchTerm}"`
              : "Hãy tạo thẻ đầu tiên để bắt đầu"
            }
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddTag}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo thẻ đầu tiên</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTags.map((tag) => (
            <div key={tag.uuid} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">#{tag.name}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditTag(tag)}
                    disabled={updateTagMutation.isPending}
                    className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-50"
                  >
                    {updateTagMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Edit className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag.uuid)}
                    disabled={deleteTagMutation.isPending}
                    className="text-gray-400 hover:text-red-600 p-1 disabled:opacity-50"
                  >
                    {deleteTagMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tag.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Hash className="h-3 w-3" />
                  <span>{tag.slug}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: tag.color,
                      width: '100%'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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