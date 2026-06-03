import { useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/helpers';
import { HiX } from 'react-icons/hi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => document.body.style.overflow = '';
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return createPortal(
    <Fragment>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      {/* Modal Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={cn(
          "bg-white w-full rounded-2xl shadow-large flex flex-col max-h-[90vh] animate-slide-up",
          sizeClasses[size]
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-100">
            <h2 className="text-xl font-bold text-surface-900">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition">
              <HiX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6 overflow-y-auto flex-grow">
            {children}
          </div>
        </div>
      </div>
    </Fragment>,
    document.body
  );
};

export default Modal;