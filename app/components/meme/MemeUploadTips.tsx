import { Card, CardContent } from '~/components/ui/Card';
import { Lightbulb, Image, FileText, Zap } from 'lucide-react';

export const MemeUploadTips = () => {
  const tips = [
    {
      icon: <Image className="w-5 h-5 text-blue-500" />,
      title: "Chất lượng hình ảnh",
      description: "Sử dụng hình ảnh có độ phân giải cao (ít nhất 800x600px) để có chất lượng tốt nhất."
    },
    {
      icon: <FileText className="w-5 h-5 text-green-500" />,
      title: "Tiêu đề hấp dẫn",
      description: "Đặt tiêu đề thú vị, dễ hiểu và liên quan đến nội dung meme."
    },
    {
      icon: <Zap className="w-5 h-5 text-purple-500" />,
      title: "Nội dung phù hợp",
      description: "Đảm bảo meme không vi phạm quy định cộng đồng và phù hợp với mọi lứa tuổi."
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      title: "Sáng tạo",
      description: "Hãy sáng tạo và độc đáo! Meme hay nhất thường là những ý tưởng mới lạ."
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Mẹo tải lên meme hiệu quả
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {tip.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {tip.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-white/60 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Lưu ý:</strong> Mỗi file tối đa 10MB. Hỗ trợ định dạng: JPG, PNG, GIF. 
            Bạn có thể tải lên nhiều file cùng lúc.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
