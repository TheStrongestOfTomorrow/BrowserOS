"use client";

import { useOSStore } from "@/store";
import { builtInApps } from "@/lib/apps";

export default function Dock() {
  const { windows, openApp, focusWindow, minimizeWindow, settings } = useOSStore();

  const dockApps = builtInApps.filter((app) =>
    ["terminal", "files", "browser", "code-editor", "chat", "settings", "app-gallery"].includes(app.id)
  );

  const dockScale = settings.dockSize === "small" ? 0.8 : settings.dockSize === "large" ? 1.2 : 1;

  const handleAppClick = (appId: string) => {
    const appWindows = windows.filter((w) => w.appId === appId);
    if (appWindows.length > 0) {
      const lastWin = appWindows[appWindows.length - 1];
      if (lastWin.isMinimized) {
        focusWindow(lastWin.id);
      } else if (windows.find((w) => w.id === lastWin.id && !w.isMinimized)) {
        minimizeWindow(lastWin.id);
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
                <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-blue-400" />
              )}
              <span className="text-[9px] text-zinc-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity max-w-[56px] truncate text-center">
                {app.name}
              </span>
            </button>
          );
        })}
        <div className="w-px h-10 bg-white/10 mx-1" />
        {windows
          .filter((w) => {
            const app = builtInApps.find((a) => a.id === w.appId);
            return !app || !dockApps.find((d) => d.id === w.appId);
          })
          .map((win) => (
            <button
              key={win.id}
              onClick={() => focusWindow(win.id)}
              className="relative group flex flex-col items-center"
              title={win.title}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl bg-blue-500/20 hover:bg-blue-500/30 transition-all hover:scale-110 active:scale-95">
                {win.icon || "📱"}
              </div>
              <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-blue-400" />
            </button>
          ))}
      </div>
    </div>
  );
}
