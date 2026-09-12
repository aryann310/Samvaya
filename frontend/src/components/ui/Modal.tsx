import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0C0F]/80 backdrop-blur-md p-4">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`w-full ${sizeClasses[size]} bg-[#1B2028] border border-[#323A46] rounded-2xl relative z-10 animate-scale-in flex flex-col max-h-[90vh] shadow-2xl text-[#DFE6EF]`}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#323A46]">
          <h2 id="modal-title" className="font-heading text-xl font-bold text-[#DFE6EF]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[#7E8A99] hover:text-[#DFE6EF] transition-colors p-1.5 rounded-lg hover:bg-[#11141A]"
            aria-label={t('close')}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto font-body text-[#A4B0BE] flex-1">
          {children}
        </div>
        {footer && (
          <div className="p-5 border-t border-[#323A46] bg-[#11141A]/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
