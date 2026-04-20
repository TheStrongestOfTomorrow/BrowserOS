"use client";

import { useOSStore } from "@/store";
import { builtInApps } from "@/lib/apps";

export default function Dock() {
  const { windows, openApp, focusWindow, minimizeWindow, settings, apps } = useOSStore();

  // Filter dock apps: built-in ones + any app currently running
  const dockApps = apps.filter((app) =>
    app.isBuiltIn || windows.some(w => w.appId === app.id)
  );

  const dockScale = settings.dockSize === "small" ? 0.8 : settings.dockSize === "large" ? 1.2 : 1;

  const handleAppClick = (appId: string) => {
    const appWindows = windows.filter((w) => w.appId === appId);
    if (appWindows.length > 0) {
      const lastWin = appWindows[appWindows.length - 1];
      if (lastWin.isMinimized) {
        focusWindow(lastWin.id);
      } else {
        // Toggle minimize if it's already focused, or focus if not
        const activeWinId = windows.find(w => !w.isMinimized && w.zIndex === Math.max(...windows.map(win => win.zIndex)))?.id;
        if (activeWinId === lastWin.id) {
          minimizeWindow(lastWin.id);
        } else {
          focusWindow(lastWin.id);
        }
      }
    } else {
      openApp(appId);
    }
  };

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[9998]">
      <div
        className="flex items-end gap-1 px-2 py-1.5 bg-black/50 backdrop-blur-2xl rounded-2xl border border-white/10"
        style={{ transform: `scale(${dockScale})` }}
      >
        {dockApps.map((app) => {
          const isRunning = windows.some((w) => w.appId === app.id);
          const isMinimized = isRunning && windows.every(w => w.appId === app.id ? w.isMinimized : true);

          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="relative group flex flex-col items-center"
              title={app.name}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl transition-all duration-200 ${
                  isRunning
                    ? "bg-white/15 ring-1 ring-white/20"
                    : "bg-white/5 hover:bg-white/10"
                } hover:scale-110 active:scale-95`}
              >
                {app.icon}
              </div>
              {isRunning && (
                <div className={`absolute -bottom-0.5 w-1 h-1 rounded-full ${isMinimized ? 'bg-zinc-500' : 'bg-blue-400'}`} />
              )}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
                {app.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
