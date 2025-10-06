import { useState } from "react";
import { Search, Plus, Edit, Trash2, MoreHorizontal, Shield, Mail, Calendar } from "lucide-react";
import AddUserModal from "~/components/admin/AddUserModal";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "~/api/admin";
import type { PaginatedResponse } from "~/types";
import UserAvatar from "~/components/ui/boring-avatar";
import { Meta } from "react-router";
import type { Route } from "./+types";


const roleColors = {
  ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  AUTHOR: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  USER: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
};

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
  banned: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

export function meta({ }: Route.MetaArgs) {
  return [{ title: "Blog app" }, { name: "description", content: "ffuck you" }];
}

export default function AdminUsers() {
  interface AdminUser {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
    postCount: number;
    commentCount: number;
    ratingCount: number;
    likeCount: number;
    bookmarkCount: number;
    roles: string[];
    banned: boolean;
    banReason: string | null;
    createdAt?: string;
    updatedAt?: string;
    lastLogin?: string;
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError } = useQuery<PaginatedResponse<AdminUser>>({
    queryKey: ["admin","users", page, pageSize],
    queryFn: () => adminApi.getUsers(page, pageSize),
  });

  const users: AdminUser[] = (data?.content ?? []) as AdminUser[];

  const totalPages: number = data?.totalPages ?? 0;
  const totalElements: number = data?.totalElements ?? users.length;
  const currentPage: number = data?.number ?? page;
  const currentSize: number = data?.size ?? pageSize;

  const normalizeRole = (role: string) => role.replace(/^ROLE_/i, "");

  const filteredUsers = users.filter((user: AdminUser) => {
    const matchesSearch = (user.username ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.roles?.some(r => normalizeRole(r) === selectedRole);
    const matchesStatus = selectedStatus === "all"
      || (selectedStatus === "banned" && user.banned)
      || (selectedStatus === "active" && !user.banned)
      || (selectedStatus === "inactive");
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = (userData: { name: string; email: string; role: string; password: string }) => {
    console.log("Adding user:", userData);
    // Handle add user logic here
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="text-gray-600 dark:text-gray-300">Đang tải người dùng...</div>
      )}
      {isError && (
        <div className="text-red-600 dark:text-red-400">Không thể tải danh sách người dùng.</div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý người dùng</h1>
          <p className="text-gray-600 dark:text-white">Quản lý tài khoản và quyền hạn người dùng</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            />
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="ADMIN">Admin</option>
            <option value="AUTHOR">Tác giả</option>
            <option value="USER">Người dùng</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="banned">Bị cấm</option>
          </select>

          <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
            Tổng: {totalElements} người dùng
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                 Đã lưu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user: AdminUser) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <UserAvatar 
                          src={user.avatar }
                          name={user.username}
                          size={40}
                          variant="marble"
                          colors={['#FF5733', '#FFC300', '#DAF7A6']}
                          alt={user.username}
                          />
                         
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[normalizeRole(user.roles?.[0] ?? "USER") as keyof typeof roleColors] || roleColors.USER}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {normalizeRole(user.roles?.[0] ?? "USER")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.banned ? statusColors.banned : statusColors.active}`}>
                      {user.banned ? 'Bị cấm' : 'Hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : ''}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-400">
                      Đăng nhập: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {user.postCount ?? 0} bài viết
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {user.bookmarkCount ?? 0} bài viết
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - bottom right*/}
{/* Pagination - bottom right */}
<div className="p-4 flex justify-end">  {/* 👈 CHUYỂN SANG BÊN PHẢI */}
  <div className="flex items-center space-x-2">
    <button
      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded disabled:opacity-50"
      onClick={() => setPage((p) => Math.max(0, p - 1))}
      disabled={isLoading || currentPage <= 0}
    >
      Trước
    </button>
    <span className="text-sm text-gray-600 dark:text-gray-300">
      Trang {currentPage + 1} / {Math.max(1, totalPages)}
    </span>
    <button
      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded disabled:opacity-50"
      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
      disabled={isLoading || currentPage >= totalPages - 1}
    >
      Sau
    </button>
    <div className="ml-4 flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">Hiển thị</span>
      <select
        className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        value={currentSize}
        onChange={(e) => {
          const newSize = Number(e.target.value);
          setPage(0);
          setPageSize(newSize);
        }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
      <span className="text-sm text-gray-600 dark:text-gray-300">mỗi trang</span>
    </div>
  </div>
</div>


      {/* Add User Modal */}
      {/* <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUser}
      /> */}
    </div>
  );
}