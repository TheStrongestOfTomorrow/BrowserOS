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
  onResize: (id: string, width: number, height: number) => void;
  onMove: (id: string, x: number, y: number) => void;
  onUpdate: (id: string, updates: Partial<WindowState>) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ 
  window, 
  onClose, 
  onMinimize, 
  onFocus, 
  onToggleMaximize,
  onResize,
  onMove,
  onUpdate,
  children 
}) => {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  const initialResizeState = useRef<{ x: number, y: number, width: number, height: number, mouseX: number, mouseY: number } | null>(null);

  const startResizing = (dir: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeDir(dir);
    initialResizeState.current = {
      x: window.x || 0,
      y: window.y || 0,
      width: window.width || 600,
      height: window.height || 400,
      mouseX: e.clientX,
      mouseY: e.clientY
    };
  };

  useEffect(() => {
    if (resizeDir) {
      const onMouseMove = (e: MouseEvent) => {
        if (!initialResizeState.current) return;
        const { x, y, width, height, mouseX, mouseY } = initialResizeState.current;
        const dx = e.clientX - mouseX;
        const dy = e.clientY - mouseY;
        
        let newX = x;
        let newY = y;
        let newWidth = width;
        let newHeight = height;

        if (resizeDir.includes('e')) newWidth = Math.max(300, width + dx);
        if (resizeDir.includes('s')) newHeight = Math.max(200, height + dy);
        if (resizeDir.includes('w')) {
          const possibleWidth = width - dx;
          if (possibleWidth > 300) {
            newWidth = possibleWidth;
            newX = x + dx;
          }
        }
        if (resizeDir.includes('n')) {
          const possibleHeight = height - dy;
          if (possibleHeight > 200) {
            newHeight = possibleHeight;
            newY = y + dy;
          }
        }

        onUpdate(window.id, { x: newX, y: newY, width: newWidth, height: newHeight });
      };

      const onMouseUp = () => {
        setResizeDir(null);
        initialResizeState.current = null;
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      
      const cursorMap: Record<string, string> = {
        n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize',
        nw: 'nwse-resize', se: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize'
      };
      document.body.style.cursor = cursorMap[resizeDir] || 'default';
      
      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = 'default';
      };
    }
  }, [resizeDir, window.id, onUpdate]);

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
      exit={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        "absolute glass rounded-2xl overflow-hidden flex flex-col window-shadow border border-white/20",
        window.isMaximized ? "rounded-none" : "rounded-2xl",
        isDragging ? "cursor-grabbing shadow-2xl scale-[1.01]" : "cursor-default"
      )}
      onMouseDown={() => onFocus(window.id)}
      drag={!window.isMaximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onMove(window.id, window.x + info.offset.x, window.y + info.offset.y);
      }}
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
        {isDragging && <div className="absolute inset-0 z-50" />}
        {resizeDir && <div className="absolute inset-0 z-50" />}
      </div>

      {/* Resize Handles */}
      {!window.isMaximized && (
        <>
          {/* Top handle */}
          <div 
            className="absolute top-0 left-0 w-full h-1.5 cursor-ns-resize z-[60] hover:bg-blue-500/20 transition-colors"
            onMouseDown={(e) => startResizing('n', e)}
          />
          {/* Bottom handle */}
          <div 
            className="absolute bottom-0 left-0 w-full h-1.5 cursor-ns-resize z-[60] hover:bg-blue-500/20 transition-colors"
            onMouseDown={(e) => startResizing('s', e)}
          />
          {/* Left handle */}
          <div 
            className="absolute top-0 left-0 w-1.5 h-full cursor-ew-resize z-[60] hover:bg-blue-500/20 transition-colors"
            onMouseDown={(e) => startResizing('w', e)}
          />
          {/* Right handle */}
          <div 
            className="absolute top-0 right-0 w-1.5 h-full cursor-ew-resize z-[60] hover:bg-blue-500/20 transition-colors"
            onMouseDown={(e) => startResizing('e', e)}
          />
          {/* Top-left handle */}
          <div 
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-[70] hover:bg-blue-500/40 transition-colors rounded-tl-sm"
            onMouseDown={(e) => startResizing('nw', e)}
          />
          {/* Top-right handle */}
          <div 
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-[70] hover:bg-blue-500/40 transition-colors rounded-tr-sm"
            onMouseDown={(e) => startResizing('ne', e)}
          />
          {/* Bottom-left handle */}
          <div 
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-[70] hover:bg-blue-500/40 transition-colors rounded-bl-sm"
            onMouseDown={(e) => startResizing('sw', e)}
          />
          {/* Bottom-right handle */}
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-[70] flex items-end justify-end p-0.5 group"
            onMouseDown={(e) => startResizing('se', e)}
          >
            <div className="w-2 h-2 border-r-2 border-b-2 border-white/20 group-hover:border-white/50 transition-colors rounded-br-sm" />
          </div>
        </>
      )}
    </motion.div>
  );
};
