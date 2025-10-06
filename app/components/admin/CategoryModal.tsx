import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

import { ColorPicker, ColorPickerSelection, ColorPickerEyeDropper, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from "src/components/ui/shadcn-io/color-picker";

interface CategoryData {
  id?: number;
  category: string;
  slug: string;
  description: string;
  backgroundColor: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryData: CategoryData) => void;
  initialData?: CategoryData | null;
  mode: 'add' | 'edit';
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}: CategoryModalProps) {


  const slugify = (value: string): string =>
    value
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const [formData, setFormData] = useState<CategoryData>({
    category: "",
    slug: "",
    description: "",
    backgroundColor: "#3B82F6",
  });

  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        id: initialData.id,
        category: initialData.category,
        slug: initialData.slug || slugify(initialData.category || ""),
        description: initialData.description,
        backgroundColor: initialData.backgroundColor,
      });
    } else {
      setFormData({
        category: "",
        slug: "",
        description: "",
        backgroundColor: "#3B82F6",
      });
    }
  }, [initialData, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      category: "",
      slug: "",
      description: "",
      backgroundColor: "#3B82F6",
    });
    setShowColorPicker(false);
    onClose();
  };



  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">
            {mode === 'add' ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên danh mục
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => {
                  const nextCategory = e.target.value;
                  const currentDerivedSlug = slugify(prev.category);
                  const isSlugUntouched = !prev.slug || prev.slug === currentDerivedSlug;
                  return {
                    ...prev,
                    category: nextCategory,
                    slug: isSlugUntouched ? slugify(nextCategory) : prev.slug,
                  };
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Nhập tên danh mục"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: slugify(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="vi-du-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Nhập mô tả danh mục"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Màu nền
              </label>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-md border-2 border-gray-300 dark:border-slate-700 cursor-pointer shadow-sm"
                  style={{ backgroundColor: formData.backgroundColor }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              
              {showColorPicker && (
              <ColorPicker className="max-w-sm rounded-md border dark:border-slate-700 bg-background p-4 shadow-sm">
               <ColorPickerSelection />
               <div className="flex items-center gap-4">
                 <ColorPickerEyeDropper />
                 <div className="grid w-full gap-1">
                   <ColorPickerHue />
                   <ColorPickerAlpha />
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <ColorPickerOutput />
                 <ColorPickerFormat />
               </div>
             </ColorPicker>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Thêm danh mục' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}