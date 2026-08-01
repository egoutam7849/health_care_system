import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function SlideOverPanel({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  footer,
  width = 'max-w-2xl'
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-canvas/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel Drawer */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
        <div className={`w-screen ${width} pointer-events-auto animate-slide-in-right`}>
          <div className="flex h-full flex-col bg-dark-section shadow-2xl border-l border-white/[0.08]">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/[0.08] bg-dark-shell shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-black text-txt-primary leading-tight">{title}</h2>
                  {subtitle && <p className="text-xs text-txt-muted mt-1 font-medium">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-txt-muted hover:text-txt-primary hover:bg-dark-hover transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="relative flex-1 px-6 py-6 overflow-y-auto bg-dark-section">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-white/[0.08] bg-dark-shell shrink-0">
                {footer}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
