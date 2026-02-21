import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { APPS } from '@/src/apps';
import { Settings as SettingsIcon, Search, Pin, PinOff, Play } from 'lucide-react';
import { ContextMenu } from './ContextMenu';

interface DockProps {
  onLaunch: (appId: string) => void;
  activeAppId?: string;
  pinnedAppIds: string[];
  onTogglePin: (appId: string) => void;
}

export const Dock: React.FC<DockProps> = ({ onLaunch, activeAppId, pinnedAppIds, onTogglePin }) => {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, appId: string } | null>(null);

  const filteredApps = useMemo(() => {
    return APPS.filter(app => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const dockApps = useMemo(() => {
    return APPS.filter(app => pinnedAppIds.includes(app.id));
  }, [pinnedAppIds]);

  const handleContextMenu = (e: React.MouseEvent, appId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, appId });
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-4">
      {/* Launcher Popup */}
      <AnimatePresence>
        {isLauncherOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass rounded-3xl p-6 w-[400px] mb-2 shadow-2xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Applications</h3>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input
                autoFocus
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div className="grid grid-cols-4 gap-6 max-h-[300px] overflow-y-auto no-scrollbar">
              {filteredApps.length > 0 ? (
                filteredApps.map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onLaunch(app.id);
                      setIsLauncherOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex flex-col items-center gap-2 group"
                    onContextMenu={(e) => handleContextMenu(e, app.id)}
                  >
                    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all">
                      <app.icon className="w-6 h-6 text-white/80 group-hover:text-white" />
                    </div>
                    <span className="text-[10px] text-white/60 group-hover:text-white truncate w-full text-center">{app.name}</span>
                  </button>
                ))
              ) : (
                <div className="col-span-4 py-8 text-center text-white/30 text-xs italic">
                  No apps found matching "{searchQuery}"
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold">U</div>
                <span className="text-xs font-medium">User</span>
              </div>
              <button 
                onClick={() => { onLaunch('settings'); setIsLauncherOpen(false); }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <SettingsIcon size={16} className="text-white/50" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="glass rounded-2xl px-3 py-2 flex items-center gap-2 shadow-2xl border border-white/20"
      >
        <motion.button
          whileHover={{ scale: 1.2, y: -10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLauncherOpen(!isLauncherOpen)}
          className={cn(
            "relative p-3 rounded-xl transition-all group",
            isLauncherOpen ? "bg-white/20" : "hover:bg-white/10"
          )}
        >
          <div className="grid grid-cols-2 gap-0.5 w-6 h-6 place-items-center">
            <div className="w-2 h-2 bg-white/70 rounded-sm" />
            <div className="w-2 h-2 bg-white/70 rounded-sm" />
            <div className="w-2 h-2 bg-white/70 rounded-sm" />
            <div className="w-2 h-2 bg-white/70 rounded-sm" />
          </div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
            {isLauncherOpen ? 'Close' : 'Apps'}
          </div>
        </motion.button>

        <div className="w-[1px] h-8 bg-white/10 mx-1" />

        {dockApps.map((app) => (
          <motion.button
            key={app.id}
            whileHover={{ scale: 1.2, y: -10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onLaunch(app.id)}
            onContextMenu={(e) => handleContextMenu(e, app.id)}
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

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          options={[
            { 
              label: pinnedAppIds.includes(contextMenu.appId) ? 'Unpin from Dock' : 'Pin to Dock', 
              icon: pinnedAppIds.includes(contextMenu.appId) ? <PinOff size={14} /> : <Pin size={14} />,
              onClick: () => onTogglePin(contextMenu.appId)
            },
            { label: 'Open App', icon: <Play size={14} />, onClick: () => onLaunch(contextMenu.appId) }
          ]}
        />
      )}
    </div>
  );
};
