import { useState } from "react";
import { Shield, Plus, Edit, Trash2, Users, Check, X } from "lucide-react";
import AddRoleModal from "~/components/admin/AddRoleModal";

const roles = [
  {
    id: 1,
    name: "ADMIN",
    displayName: "Quản trị viên",
    description: "Có toàn quyền quản lý hệ thống",
    userCount: 2,
    permissions: [
      "Quản lý người dùng",
      "Quản lý bài viết",
      "Quản lý danh mục",
      "Quản lý thẻ",
      "Xem thống kê",
      "Cài đặt hệ thống"
    ],
    color: "red"
  },
  {
    id: 2,
    name: "AUTHOR",
    displayName: "Tác giả",
    description: "Có thể tạo và quản lý bài viết của mình",
    userCount: 15,
    permissions: [
      "Tạo bài viết",
      "Chỉnh sửa bài viết của mình",
      "Xóa bài viết của mình",
      "Quản lý hồ sơ cá nhân"
    ],
    color: "blue"
  },
  {
    id: 3,
    name: "USER",
    displayName: "Người dùng",
    description: "Có thể đọc và tương tác với bài viết",
    userCount: 234,
    permissions: [
      "Đọc b��i viết",
      "Bình luận",
      "Thích bài viết",
      "Lưu bài viết",
      "Quản lý hồ sơ cá nhân"
    ],
    color: "gray"
  }
];

const allPermissions = [
  { id: "manage_users", name: "Quản lý người dùng", category: "Quản lý" },
  { id: "manage_posts", name: "Quản lý bài viết", category: "Nội dung" },
  { id: "manage_categories", name: "Quản lý danh mục", category: "Nội dung" },
  { id: "manage_tags", name: "Quản lý thẻ", category: "Nội dung" },
  { id: "create_posts", name: "Tạo bài viết", category: "Nội dung" },
  { id: "edit_own_posts", name: "Chỉnh sửa bài viết của mình", category: "Nội dung" },
  { id: "delete_own_posts", name: "Xóa bài viết của mình", category: "Nội dung" },
  { id: "view_analytics", name: "Xem thống kê", category: "Báo cáo" },
  { id: "system_settings", name: "Cài đặt hệ thống", category: "Hệ thống" },
  { id: "read_posts", name: "Đọc bài viết", category: "Cơ bản" },
  { id: "comment", name: "Bình luận", category: "Tương tác" },
  { id: "like_posts", name: "Thích bài viết", category: "Tương tác" },
  { id: "save_posts", name: "Lưu bài viết", category: "Tương tác" },
  { id: "manage_profile", name: "Quản lý hồ sơ cá nhân", category: "Cá nhân" },
];

const colorClasses = {
  red: "bg-red-100 text-red-800 border-red-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  gray: "bg-gray-100 text-gray-800 border-gray-200",
  green: "bg-green-100 text-green-800 border-green-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function AdminRoles() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    displayName: "",
    description: "",
    permissions: [],
    color: "blue"
  });

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleAddRole = () => {
    setShowAddModal(true);
  };

  const handleSubmitRole = (roleData: { name: string; displayName: string; description: string; permissions: string[]; color: string }) => {
    console.log("Adding role:", roleData);
    // Handle add role logic here
    setShowAddModal(false);
  };

  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý vai trò</h1>
          <p className="text-gray-600">Quản lý vai trò và quyền hạn trong hệ thống</p>
        </div>
        <button 
          onClick={handleAddRole}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm vai trò</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className={`bg-white rounded-lg shadow-md border-l-4 ${colorClasses[role.color]} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${colorClasses[role.color]}`}>
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.displayName}</h3>
                  <p className="text-sm text-gray-500">{role.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEditRole(role)}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{role.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{role.userCount} người dùng</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Quyền hạn:</h4>
              <div className="space-y-1">
                {role.permissions.slice(0, 3).map((permission, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>{permission}</span>
                  </div>
                ))}
                {role.permissions.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{role.permissions.length - 3} quyền khác
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan quyền hạn</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Quyền hạn</th>
                {roles.map(role => (
                  <th key={role.id} className="text-center py-3 px-4 font-medium text-gray-700">
                    {role.displayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <>
                  <tr key={category} className="bg-gray-50">
                    <td colSpan={roles.length + 1} className="py-2 px-4 font-medium text-gray-800 text-sm">
                      {category}
                    </td>
                  </tr>
                  {permissions.map(permission => (
                    <tr key={permission.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-700">{permission.name}</td>
                      {roles.map(role => (
                        <td key={role.id} className="text-center py-3 px-4">
                          {role.permissions.includes(permission.name) ? (
                            <Check className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitRole}
        allPermissions={allPermissions}
      />
    </div>
  );
}