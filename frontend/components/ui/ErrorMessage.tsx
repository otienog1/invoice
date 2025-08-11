import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  retry?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorMessage({ title = 'Error', message, onDismiss, retry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {retry && (
            <div className="mt-3">
              <button
                onClick={retry.onClick}
                className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
              >
                {retry.label}
              </button>
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-red-400 hover:text-red-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}