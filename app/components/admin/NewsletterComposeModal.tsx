import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface NewsletterComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (newsletterData: {
    subject: string;
    content: string;
    recipientType: 'all' | 'active';
  }) => void;
}

export default function NewsletterComposeModal({ 
  isOpen, 
  onClose, 
  onSend 
}: NewsletterComposeModalProps) {
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    recipientType: "active" as 'all' | 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(formData);
    setFormData({
      subject: "",
      content: "",
      recipientType: "active"
    });
  };

  const handleClose = () => {
    setFormData({
      subject: "",
      content: "",
      recipientType: "active"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Soạn Newsletter</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3  py-2 border border-gray-300 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề newsletter"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Người nhận
              </label>
              <select
                value={formData.recipientType}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientType: e.target.value as 'all' | 'active' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Chỉ người đã kích hoạt</option>
                <option value="all">Tất cả người đăng ký</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung
              </label>
              <textarea
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập nội dung newsletter (hỗ trợ HTML)..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Bạn có thể sử dụng HTML để định dạng nội dung
              </p>
            </div>

            {/* Preview section */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Xem trước:</h4>
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50 max-h-40 overflow-y-auto">
                <div className="text-sm">
                  <div className="font-semibold mb-2">{formData.subject || "Tiêu đề newsletter"}</div>
                  <div 
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.content || "Nội dung newsletter sẽ hiển thị ở đây..." 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit">
              Gửi Newsletter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}