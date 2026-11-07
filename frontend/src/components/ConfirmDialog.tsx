import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const btnStyles = {
    danger: 'bg-[#B96F50] hover:bg-[#9C5538] text-white shadow-sm',
    warning: 'bg-[#C3A66B] hover:bg-[#B09252] text-white shadow-sm',
    primary: 'bg-[#263D32] hover:bg-[#192A23] text-white shadow-sm',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div className="p-3.5 bg-[#F9ECE7] border border-[#E8C5B8] dark:bg-[#382119] dark:border-[#5C3326] text-[#B96F50] dark:text-[#F0A892] rounded-2xl mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <p className="text-sm text-[#52544E] dark:text-[#EAE5D8] mb-6 leading-relaxed">{message}</p>
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#DDD6C6] dark:border-[#334D40] text-[#52544E] dark:text-[#EAE5D8] font-medium hover:bg-[#DDD6C6]/40 dark:hover:bg-white/5 transition-colors disabled:opacity-50 text-sm"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all shadow-sm disabled:opacity-50 text-sm ${btnStyles[variant]}`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
