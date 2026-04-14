"use client";

import { useCallback, useRef, useState } from "react";
import { useOSStore } from "@/store";
import {
  X,
  Minus,
  Square,
  Maximize2,
} from "lucide-react";

interface WindowManagerProps {
  children: (windowId: string, appId: string) => React.ReactNode;
}

export default function WindowManager({ children }: WindowManagerProps) {
  const {
    windows,
    activeWindowId,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindow,
  } = useOSStore();

  const dragRef = useRef<{
    windowId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const resizeRef = useRef<{
    windowId: string;
    startX: number;
    startY: number;
    origW: number;
    origH: number;
    origX: number;
    origY: number;
    direction: string;
  } | null>(null);

  const handleMouseDownDrag = useCallback(
    (e: React.MouseEvent, windowId: string) => {
      e.preventDefault();
      const win = windows.find((w) => w.id === windowId);
      if (!win || win.isMaximized) return;
      focusWindow(windowId);
      dragRef.current = {
        windowId,
        startX: e.clientX,
        startY: e.clientY,
        origX: win.x,
        origY: win.y,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        updateWindow(dragRef.current.windowId, {
          x: dragRef.current.origX + dx,
          y: Math.max(28, dragRef.current.origY + dy),
        });
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [windows, focusWindow, updateWindow]
  );

  const handleMouseDownResize = useCallback(
    (e: React.MouseEvent, windowId: string, direction: string) => {
      e.preventDefault();
      e.stopPropagation();
      const win = windows.find((w) => w.id === windowId);
      if (!win || win.isMaximized) return;
      focusWindow(windowId);
      resizeRef.current = {
        windowId,
        startX: e.clientX,
        startY: e.clientY,
        origW: win.width,
        origH: win.height,
        origX: win.x,
        origY: win.y,
        direction,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!resizeRef.current) return;
        const r = resizeRef.current;
        const dx = ev.clientX - r.startX;
        const dy = ev.clientY - r.startY;
        const updates: Partial<{ width: number; height: number; x: number; y: number }> = {};

        if (r.direction.includes("e")) updates.width = Math.max(win.minWidth, r.origW + dx);
        if (r.direction.includes("s")) updates.height = Math.max(win.minHeight, r.origH + dy);
        if (r.direction.includes("w")) {
          const newW = Math.max(win.minWidth, r.origW - dx);
          updates.width = newW;
          updates.x = r.origX + (r.origW - newW);
        }
        if (r.direction.includes("n")) {
          const newH = Math.max(win.minHeight, r.origH - dy);
          updates.height = newH;
          updates.y = Math.max(28, r.origY + (r.origH - newH));
        }

        updateWindow(r.windowId, updates);
      };

      const handleMouseUp = () => {
        resizeRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [windows, focusWindow, updateWindow]
  );

  const [maximizedState, setMaximizedState] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});

  const handleDoubleClickTitle = useCallback(
    (windowId: string) => {
      const win = windows.find((w) => w.id === windowId);
      if (!win) return;

      if (win.isMaximized) {
        const prev = maximizedState[windowId];
        if (prev) {
          updateWindow(windowId, {
            isMaximized: false,
            x: prev.x,
            y: prev.y,
            width: prev.width,
            height: prev.height,
          });
        }
      } else {
        setMaximizedState((prev) => ({
          ...prev,
          [windowId]: { x: win.x, y: win.y, width: win.width, height: win.height },
        }));
        updateWindow(windowId, {
          isMaximized: true,
          x: 0,
          y: 28,
          width: window.innerWidth,
          height: window.innerHeight - 28 - 72,
        });
      }
    },
    [windows, maximizedState, updateWindow]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ top: 28 }}>
      {windows.map((win) => {
        if (win.isMinimized) return null;
        const isActive = activeWindowId === win.id;
        return (
          <div
            key={win.id}
            className={`absolute flex flex-col rounded-lg overflow-hidden shadow-2xl border transition-shadow duration-150 pointer-events-auto ${
              isActive
                ? "shadow-black/40 border-white/20"
                : "shadow-black/20 border-white/10"
            }`}
            style={{
              left: win.x,
              top: win.y - 28,
              width: win.width,
              height: win.height,
              zIndex: win.zIndex,
            }}
            onMouseDown={() => focusWindow(win.id)}
          >
            {/* Title bar */}
            <div
              className={`flex items-center h-9 px-3 gap-2 select-none shrink-0 ${
                isActive
                  ? "bg-zinc-800/95 text-white"
                  : "bg-zinc-800/80 text-zinc-400"
              }`}
              onMouseDown={(e) => handleMouseDownDrag(e, win.id)}
              onDoubleClick={() => handleDoubleClickTitle(win.id)}
            >
              <span className="text-sm mr-1">{win.icon}</span>
              <span className="text-xs font-medium truncate flex-1">{win.title}</span>
              <div className="flex items-center gap-1">
                <button
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    minimizeWindow(win.id);
                  }}
                >
                  <Minus size={12} />
                </button>
                <button
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoubleClickTitle(win.id);
                  }}
                >
                  {win.isMaximized ? <Square size={10} /> : <Maximize2 size={10} />}
                </button>
                <button
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(win.id);
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-zinc-900">
              {children(win.id, win.appId)}
            </div>

            {/* Resize handles */}
            {!win.isMaximized && (
              <>
                <div className="absolute top-0 left-0 right-0 h-1 cursor-n-resize" onMouseDown={(e) => handleMouseDownResize(e, win.id, "n")} />
                <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize" onMouseDown={(e) => handleMouseDownResize(e, win.id, "s")} />
                <div className="absolute top-0 left-0 bottom-0 w-1 cursor-w-resize" onMouseDown={(e) => handleMouseDownResize(e, win.id, "w")} />
                <div className="absolute top-0 right-0 bottom-0 w-1 cursor-e-resize" onMouseDown={(e) => handleMouseDownResize(e, win.id, "e")} />
                <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleMouseDownResize(e, win.id, "nw")} />
                <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleMouseDownResize(e, win.id, "ne")} />
                <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleMouseDownResize(e, win.id, "sw")} />
                <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={(e) => handleMouseDownResize(e, win.id, "se")} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
