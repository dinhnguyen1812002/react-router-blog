import { useState } from "react";
import { X, Send, Eye, Save, Loader2, Mail, Users } from "lucide-react";
import { toast } from "sonner";

interface NewsletterComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: NewsletterData) => Promise<void>;
  loading?: boolean;
}

interface NewsletterData {
  subject: string;
  content: string;
  recipientType: 'all' | 'active';
  scheduledAt?: string;
}

interface FormData {
  subject: string;
  content: string;
  recipientType: 'all' | 'active';
  scheduleType: 'now' | 'later';
  scheduledDate: string;
  scheduledTime: string;
}

export default function NewsletterComposeModal({
  isOpen,
  onClose,
  onSend,
  loading = false
}: NewsletterComposeModalProps) {
  const [activeTab, setActiveTab] = useState<'compose' | 'preview'>('compose');
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    content: '',
    recipientType: 'active',
    scheduleType: 'now',
    scheduledDate: '',
    scheduledTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      toast.error('Vui lòng nhập tiêu đề email');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('Vui lòng nhập nội dung email');
      return;
    }

    let scheduledAt: string | undefined;
    if (formData.scheduleType === 'later') {
      if (!formData.scheduledDate || !formData.scheduledTime) {
        toast.error('Vui lòng chọn ngày và giờ gửi');
        return;
      }
      scheduledAt = `${formData.scheduledDate}T${formData.scheduledTime}:00`;
    }

    const newsletterData: NewsletterData = {
      subject: formData.subject,
      content: formData.content,
      recipientType: formData.recipientType,
      scheduledAt
    };

    try {
      await onSend(newsletterData);
      handleClose();
      toast.success(
        formData.scheduleType === 'now' 
          ? 'Newsletter đã được gửi thành công!' 
          : 'Newsletter đã được lên lịch thành công!'
      );
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi newsletter');
    }
  };

  const handleClose = () => {
    setFormData({
      subject: '',
      content: '',
      recipientType: 'active',
      scheduleType: 'now',
      scheduledDate: '',
      scheduledTime: ''
    });
    setActiveTab('compose');
    onClose();
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderPreview = () => {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
          {/* Email Header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <Mail className="w-4 h-4" />
              <span>Newsletter Preview</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {formData.subject || 'Tiêu đề email...'}
            </h1>
          </div>
          
          {/* Email Content */}
          <div className="prose prose-sm max-w-none">
            {formData.content ? (
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: formData.content.replace(/\n/g, '<br>') 
                }}
              />
            ) : (
              <p className="text-gray-400 italic">Nội dung email sẽ hiển thị ở đây...</p>
            )}
          </div>
          
          {/* Email Footer */}
          <div className="border-t border-gray-200 pt-4 mt-6 text-xs text-gray-500">
            <p>Bạn nhận được email này vì đã đăng ký newsletter của chúng tôi.</p>
            <p>
              <a href="#" className="text-blue-600 hover:underline">Hủy đăng ký</a> | 
              <a href="#" className="text-blue-600 hover:underline ml-2">Cập nhật thông tin</a>
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Soạn Newsletter</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setActiveTab('compose')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'compose'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Soạn thảo
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'preview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Xem trước
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
              {activeTab === 'compose' ? (
                <div className="space-y-6">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề email *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => updateFormData({ subject: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tiêu đề email..."
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung email *
                    </label>
                    <textarea
                      required
                      rows={12}
                      value={formData.content}
                      onChange={(e) => updateFormData({ content: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập nội dung email..."
                    />
                  </div>

                  {/* Recipients */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Người nhận
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="recipientType"
                          value="active"
                          checked={formData.recipientType === 'active'}
                          onChange={(e) => updateFormData({ recipientType: e.target.value as 'active' | 'all' })}
                          className="mr-2"
                        />
                        <Users className="w-4 h-4 mr-1" />
                        Chỉ người đăng ký đã kích hoạt
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="recipientType"
                          value="all"
                          checked={formData.recipientType === 'all'}
                          onChange={(e) => updateFormData({ recipientType: e.target.value as 'active' | 'all' })}
                          className="mr-2"
                        />
                        <Users className="w-4 h-4 mr-1" />
                        Tất cả người đăng ký
                      </label>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian gửi
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="scheduleType"
                          value="now"
                          checked={formData.scheduleType === 'now'}
                          onChange={(e) => updateFormData({ scheduleType: e.target.value as 'now' | 'later' })}
                          className="mr-2"
                        />
                        Gửi ngay
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="scheduleType"
                          value="later"
                          checked={formData.scheduleType === 'later'}
                          onChange={(e) => updateFormData({ scheduleType: e.target.value as 'now' | 'later' })}
                          className="mr-2"
                        />
                        Lên lịch gửi
                      </label>
                      
                      {formData.scheduleType === 'later' && (
                        <div className="ml-6 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Ngày</label>
                            <input
                              type="date"
                              value={formData.scheduledDate}
                              onChange={(e) => updateFormData({ scheduledDate: e.target.value })}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Giờ</label>
                            <input
                              type="time"
                              value={formData.scheduledTime}
                              onChange={(e) => updateFormData({ scheduledTime: e.target.value })}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                renderPreview()
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Lưu nháp
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 inline mr-2" />
                      {formData.scheduleType === 'now' ? 'Gửi ngay' : 'Lên lịch'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
