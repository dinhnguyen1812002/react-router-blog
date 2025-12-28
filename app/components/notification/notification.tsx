import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';


const notificationVariants = cva(
  'relative flex w-full max-w-md gap-4 rounded-lg border px-4 py-3 transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        success: 'border-green-500/30 bg-green-500/10 text-green-800 dark:text-green-200',
        error: 'border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-200',
        warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-800 dark:text-yellow-200',
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-200',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

interface NotificationProps extends VariantProps<typeof notificationVariants> {
  title: string;
  description?: string;
  onClose?: () => void;
  autoClose?: boolean;
}

export function Notification({
  variant,
  title,
  description,
  onClose,
  autoClose,
}: NotificationProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />,
    error: <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />,
    warning: <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />,
    info: <Info className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />,
  };

  return (
    <div className={cn(notificationVariants({ variant }))}>
      <div className="flex flex-shrink-0 items-center">{icons[variant || 'info']}</div>
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-semibold">{title}</p>
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex flex-shrink-0 items-center justify-center rounded p-1 hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
