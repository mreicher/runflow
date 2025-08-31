import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'default' | 'fullscreen';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'default' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    default: 'max-w-lg max-h-[90vh]',
    fullscreen: 'w-full h-full max-w-full max-h-full rounded-none',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-0 md:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`bg-white shadow-2xl m-auto flex flex-col ${size === 'default' ? 'rounded-2xl' : ''} ${sizeClasses[size]}`}
        onClick={e => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            <i className="fas fa-times"></i>
          </button>
        </header>
        <main className="flex-1 p-2 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Modal;