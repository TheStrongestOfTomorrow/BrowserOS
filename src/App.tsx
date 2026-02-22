import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Window } from './components/Window';
import { Dock } from './components/Dock';
import { ContextMenu } from './components/ContextMenu';
import { LoginScreen } from './components/LoginScreen';
import { useAuth } from './context/AuthContext';
import { APPS } from './apps';
import { WindowState, WindowId } from './types';
import { Monitor, Battery, Wifi, Volume2, Search, Calendar, RefreshCw, Wallpaper, Info, User as UserIcon, LogOut } from 'lucide-react';

export default function App() {
  const { user, profile, loading, signOut } = useAuth();
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedId, setFocusedId] = useState<WindowId | null>(null);
  const [time, setTime] = useState(new Date());
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('browseros-wallpaper') || 'https://picsum.photos/id/10/1920/1080');
  const [pinnedAppIds, setPinnedAppIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('browseros-pinned-apps');
    return saved ? JSON.parse(saved) : ['nexus', 'terminal', 'explorer', 'browser'];
  });
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, options: any[] } | null>(null);

  useEffect(() => {
    localStorage.setItem('browseros-pinned-apps', JSON.stringify(pinnedAppIds));
  }, [pinnedAppIds]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleWallpaper = () => {
      setWallpaper(localStorage.getItem('browseros-wallpaper') || 'https://picsum.photos/id/10/1920/1080');
    };
    window.addEventListener('wallpaper-change', handleWallpaper);
    return () => {
      clearInterval(timer);
      window.removeEventListener('wallpaper-change', handleWallpaper);
    };
  }, []);

  const launchApp = useCallback((appId: string) => {
    const app = APPS.find(a => a.id === appId);
    if (!app) return;

    // If already open, just focus it
    const existing = windows.find(w => w.id === appId);
    if (existing) {
      if (existing.isMinimized) {
        setWindows(prev => prev.map(w => 
          w.id === appId ? { ...w, isMinimized: false, zIndex: Math.max(...prev.map(p => p.zIndex), 0) + 1 } : w
        ));
      }
      setFocusedId(appId);
      return;
    }

    const newWindow: WindowState = {
      id: appId,
      title: app.name,
      icon: appId,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: Math.max(...windows.map(w => w.zIndex), 0) + 1,
      type: 'app',
      content: <app.component onLaunch={launchApp} />,
      width: app.defaultWidth || 600,
      height: app.defaultHeight || 400,
      x: 100 + windows.length * 30,
      y: 100 + windows.length * 30,
    };

    setWindows(prev => [...prev, newWindow]);
    setFocusedId(appId);
  }, [windows]);

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (focusedId === id) setFocusedId(null);
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setFocusedId(null);
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const focusWindow = (id: string) => {
    setFocusedId(id);
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
    });
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  };

  const resizeWindow = (id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  };

  const updateWindow = (id: string, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const togglePin = (appId: string) => {
    setPinnedAppIds(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      options: [
        { label: 'Refresh', icon: <RefreshCw size={14} />, onClick: () => window.location.reload() },
        { label: 'Change Wallpaper', icon: <Wallpaper size={14} />, onClick: () => launchApp('settings') },
        { label: 'System Info', icon: <Info size={14} />, onClick: () => launchApp('system') },
      ]
    });
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Initializing browserOS...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center transition-all duration-1000" 
      style={{ backgroundImage: `url("${wallpaper}?blur=2")` }}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Desktop Background Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 glass flex items-center justify-between px-4 z-[10000] text-[11px] font-medium text-white/90">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => launchApp('settings')}
            className="flex items-center gap-2 font-bold tracking-tighter text-sm hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
          >
            <Monitor size={14} />
            <span>browserOS</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            <button 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setContextMenu({
                  x: rect.left,
                  y: rect.bottom + 8,
                  options: [
                    { label: `Logged in as ${profile?.username || 'User'}`, icon: <UserIcon size={14} />, onClick: () => {} },
                    { label: 'Sign Out', icon: <LogOut size={14} />, onClick: signOut },
                  ]
                });
              }}
              className="flex items-center gap-2 hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
            >
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                alt="Avatar" 
                className="w-4 h-4 rounded-full"
              />
              <span>{profile?.username || 'User'}</span>
            </button>
          </div>
          <div className="flex items-center gap-3 opacity-80">
            <Wifi size={14} />
            <Volume2 size={14} />
            <Battery size={14} className="rotate-90" />
            <Search size={14} />
          </div>
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <Calendar size={14} />
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Desktop Icons */}
      <div className="absolute inset-0 p-12 pt-20 grid grid-flow-col grid-rows-6 gap-4 w-fit">
        {APPS.slice(0, 4).map(app => (
          <motion.button 
            key={app.id}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => launchApp(app.id)}
            className="flex flex-col items-center gap-1 w-20 p-2 rounded-lg group transition-all"
          >
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center transition-transform">
              <app.icon className="w-6 h-6 text-white/80" />
            </div>
            <span className="text-[10px] text-white font-medium text-center drop-shadow-md">{app.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 pt-8 pb-20 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          <AnimatePresence>
            {windows.map((win) => (
              <Window
                key={win.id}
                window={win}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onFocus={focusWindow}
                onToggleMaximize={toggleMaximize}
                onResize={resizeWindow}
                onMove={moveWindow}
                onUpdate={updateWindow}
              >
                {win.content}
              </Window>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Dock */}
      <Dock 
        onLaunch={launchApp} 
        activeAppId={focusedId || undefined} 
        pinnedAppIds={pinnedAppIds}
        onTogglePin={togglePin}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
