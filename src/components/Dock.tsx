import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { APPS } from '@/src/apps';

interface DockProps {
  onLaunch: (appId: string) => void;
  activeAppId?: string;
}

export const Dock: React.FC<DockProps> = ({ onLaunch, activeAppId }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="glass rounded-2xl px-3 py-2 flex items-center gap-2"
      >
        {APPS.map((app) => (
          <motion.button
            key={app.id}
            whileHover={{ scale: 1.2, y: -10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onLaunch(app.id)}
            className={cn(
              "relative p-3 rounded-xl transition-all group",
              activeAppId === app.id ? "bg-white/10" : "hover:bg-white/5"
            )}
          >
            <app.icon className="w-6 h-6 text-white/80 group-hover:text-white" />
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
              {app.name}
            </div>

            {/* Indicator */}
            {activeAppId === app.id && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};
