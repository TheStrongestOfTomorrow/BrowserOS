import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ContextMenuOption {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuOption[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position if menu goes off screen
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - (options.length * 40 + 20));

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed z-[100000] glass rounded-xl py-1.5 w-48 shadow-2xl border border-white/20 overflow-hidden"
        style={{ left: adjustedX, top: adjustedY }}
      >
        {options.map((option, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              option.onClick();
              onClose();
            }}
            className={cn(
              "w-full px-4 py-2 text-left text-xs font-medium flex items-center gap-3 transition-colors",
              option.variant === 'danger' 
                ? "text-red-400 hover:bg-red-500/20" 
                : "text-white/80 hover:bg-white/10 hover:text-white"
            )}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
