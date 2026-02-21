import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { WindowState } from '@/src/types';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onToggleMaximize: (id: string) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ 
  window, 
  onClose, 
  onMinimize, 
  onFocus, 
  onToggleMaximize,
  children 
}) => {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  if (window.isMinimized) return null;

  return (
    <motion.div
      initial={window.isMaximized ? false : { scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        width: window.isMaximized ? '100%' : window.width,
        height: window.isMaximized ? 'calc(100% - 48px)' : window.height,
        x: window.isMaximized ? 0 : window.x,
        y: window.isMaximized ? 0 : window.y,
        zIndex: window.zIndex,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        "absolute glass rounded-xl overflow-hidden flex flex-col window-shadow",
        window.isMaximized ? "rounded-none" : "rounded-xl",
        isDragging ? "cursor-grabbing" : "cursor-default"
      )}
      onMouseDown={() => onFocus(window.id)}
      drag={!window.isMaximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {/* Title Bar */}
      <div 
        className="h-10 flex items-center justify-between px-4 bg-white/5 border-b border-white/10 select-none cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => controls.start(e)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/70 uppercase tracking-widest">{window.title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onMinimize(window.id)}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/50 hover:text-white"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={() => onToggleMaximize(window.id)}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/50 hover:text-white"
          >
            <Square size={12} />
          </button>
          <button 
            onClick={() => onClose(window.id)}
            className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors text-white/50"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative bg-black/20">
        {children}
        {/* Focus Overlay for iframes when not focused */}
        {/* This is a trick to allow dragging over iframes */}
        {isDragging && <div className="absolute inset-0 z-50" />}
      </div>
    </motion.div>
  );
};
