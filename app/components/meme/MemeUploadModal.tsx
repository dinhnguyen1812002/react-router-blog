import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { MemeUpload } from './MemeUpload';
import { Upload } from 'lucide-react';

interface MemeUploadModalProps {
  trigger?: React.ReactNode;
}

export const MemeUploadModal = ({ trigger }: MemeUploadModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    // TODO: Show success toast
  };

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Upload className="w-5 h-5 mr-2" />
            Tải lên meme của bạn
          </Button>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <MemeUpload
              onSuccess={handleSuccess}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
