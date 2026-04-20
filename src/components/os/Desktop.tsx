"use client";

import { useOSStore } from "@/store";

export default function Desktop() {
  const { apps, openApp, contextMenu, setContextMenu } = useOSStore();

  // Show all apps on the desktop except maybe those that shouldn't be there
  // but the user said "make all apps visible", so we'll show them all.
  const desktopApps = apps;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          label: "Change Wallpaper",
          action: () => {
            openApp("settings");
            setContextMenu(null);
          },
        },
        {
          label: "Open Terminal",
          action: () => {
            openApp("terminal");
            setContextMenu(null);
          },
        },
        {
          label: "Refresh",
          action: () => {
            setContextMenu(null);
          },
        },
      ],
    });
  };

  return (
    <div
      className="absolute inset-0 z-0"
      style={{ top: 28, bottom: 72 }}
      onContextMenu={handleContextMenu}
      onClick={() => contextMenu && setContextMenu(null)}
    >
      {/* Desktop icons */}
      <div className="p-4 grid grid-cols-1 grid-flow-col gap-4 w-fit h-fit max-h-full">
        {desktopApps.map((app) => (
          <button
            key={app.id}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors group w-20"
            onDoubleClick={() => openApp(app.id)}
          >
            <span className="text-3xl drop-shadow-lg">{app.icon}</span>
            <span className="text-[10px] text-white text-center leading-tight drop-shadow-md group-hover:text-blue-300 transition-colors break-words w-full">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="absolute bg-zinc-800/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-xl py-1 min-w-[180px] z-[9999]"
          style={{ left: contextMenu.x, top: contextMenu.y - 28 }}
        >
          {contextMenu.items.map((item, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10 transition-colors"
              onClick={item.action}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
