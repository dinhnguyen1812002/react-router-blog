import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { Series, CreateSeriesRequest, UpdateSeriesRequest } from "~/types";

const seriesSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(200, "Tiêu đề không được quá 200 ký tự"),
  slug: z.string().min(1, "Slug là bắt buộc").max(200, "Slug không được quá 200 ký tự").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"),
  description: z.string().min(1, "Mô tả là bắt buộc").max(500, "Mô tả không được quá 500 ký tự"),
});

type SeriesForm = z.infer<typeof seriesSchema>;

interface SeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSeriesRequest | UpdateSeriesRequest) => Promise<void>;
  series?: Series | null;
  loading?: boolean;
}

export const SeriesModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  series, 
  loading = false 
}: SeriesModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SeriesForm>({
    resolver: zodResolver(seriesSchema),
    defaultValues: {
      title: series?.title || "",
      slug: series?.slug || "",
      description: series?.description || "",
    },
  });

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setValue("slug", slug);
  };

  const handleFormSubmit = async (data: SeriesForm) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting series:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-300">
            {series ? "Chỉnh sửa Series" : "Tạo Series Mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tiêu đề Series
            </label>
            <Input
              id="title"
              {...register("title", {
                onChange: handleTitleChange,
              })}
              placeholder="Nhập tiêu đề series..."
              className={errors.title ? 
                "border-red-500 dark:border-red-400 dark:text-gray-300" : 
                "dark:text-gray-300"
              }
            />
            {errors.title && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug
            </label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="slug-tu-dong-tao"
              className={errors.slug ? 
                "border-red-500 dark:border-red-400 dark:text-gray-300" : 
                "dark:text-gray-300"
              }
            />
            {errors.slug && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả Series
            </label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Nhập mô tả series..."
              rows={4}
              className={errors.description ? 
                "border-red-500 dark:border-red-400 dark:text-gray-300" : 
                "dark:text-gray-300"
              }
            />
            {errors.description && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {series ? "Cập nhật" : "Tạo Series"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
