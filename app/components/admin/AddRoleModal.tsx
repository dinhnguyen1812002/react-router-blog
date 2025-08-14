import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface Permission {
  id: string;
  name: string;
  category: string;
}

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roleData: {
    name: string;
    displayName: string;
    description: string;
    permissions: string[];
    color: string;
  }) => void;
  allPermissions: Permission[];
}

const colorOptions = [
  "red", "blue", "gray", "green", "purple", "yellow", "pink", "indigo"
];

const colorClasses = {
  red: "bg-red-100 text-red-800 border-red-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  gray: "bg-gray-100 text-gray-800 border-gray-200",
  green: "bg-green-100 text-green-800 border-green-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pink: "bg-pink-100 text-pink-800 border-pink-200",
  indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

export default function AddRoleModal({ isOpen, onClose, onSubmit, allPermissions }: AddRoleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    permissions: [] as string[],
    color: "blue"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      displayName: "",
      description: "",
      permissions: [],
      color: "blue"
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      displayName: "",
      description: "",
      permissions: [],
      color: "blue"
    });
    onClose();
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm vai trò mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên vai trò
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: MODERATOR"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Người kiểm duyệt"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả vai trò và trách nhiệm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màu sắc
              </label>
              <div className="flex space-x-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-gray-800' : 'border-gray-300'
                    } ${colorClasses[color as keyof typeof colorClasses]}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quyền hạn
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">{category}</h4>
                    <div className="space-y-2 ml-4">
                      {permissions.map(permission => (
                        <label key={permission.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit">
              Tạo vai trò
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}