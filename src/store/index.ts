import { create } from "zustand";
import type { OSWindow, AppDefinition, FileSystemNode, SystemSettings, GalleryApp } from "@/types";

let windowCounter = 0;

interface OSState {
  windows: OSWindow[];
  activeWindowId: string | null;
  apps: AppDefinition[];
  fileSystem: FileSystemNode;
  settings: SystemSettings;
  galleryApps: GalleryApp[];
  installedAppIds: string[];
  isBooting: boolean;
  contextMenu: { x: number; y: number; items: ContextMenuItem[] } | null;

  openApp: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindow: (windowId: string, updates: Partial<OSWindow>) => void;
  updateSettings: (updates: Partial<SystemSettings>) => void;
  setFileSystem: (fs: FileSystemNode) => void;
  installApp: (app: GalleryApp) => void;
  uninstallApp: (appId: string) => void;
  setGalleryApps: (apps: GalleryApp[]) => void;
  setBooting: (v: boolean) => void;
  setContextMenu: (menu: { x: number; y: number; items: ContextMenuItem[] } | null) => void;
}

interface ContextMenuItem {
  label: string;
  action: () => void;
  icon?: string;
  separator?: boolean;
}

const defaultFileSystem: FileSystemNode = {
  name: "root",
  type: "directory",
  created: Date.now(),
  modified: Date.now(),
  size: 0,
  children: {
    home: {
      name: "home",
      type: "directory",
      created: Date.now(),
      modified: Date.now(),
      size: 0,
      children: {
        user: {
          name: "user",
          type: "directory",
          created: Date.now(),
          modified: Date.now(),
          size: 0,
          children: {
            Desktop: { name: "Desktop", type: "directory", created: Date.now(), modified: Date.now(), size: 0, children: {} },
            Documents: { name: "Documents", type: "directory", created: Date.now(), modified: Date.now(), size: 0, children: {} },
            Downloads: { name: "Downloads", type: "directory", created: Date.now(), modified: Date.now(), size: 0, children: {} },
            Pictures: { name: "Pictures", type: "directory", created: Date.now(), modified: Date.now(), size: 0, children: {} },
            Music: { name: "Music", type: "directory", created: Date.now(), modified: Date.now(), size: 0, children: {} },
            Videos: { name: "Videos", type: "directory", created: Date.now(), modified: Date.now(), size: 0, children: {} },
          },
        },
      },
    },
    etc: { name: "etc", type: "directory", created: Date.now(), modified: Date.now(), size: 0, children: {} },
    tmp: { name: "tmp", type: "directory", created: Date.now(), modified: Date.now(), size: 0, children: {} },
  },
};

const defaultSettings: SystemSettings = {
  wallpaper: "gradient",
  wallpaperColor: "#0a0a2e",
  theme: "dark",
  accentColor: "#3b82f6",
  username: "User",
  wifiEnabled: true,
  bluetoothEnabled: false,
  notificationsEnabled: true,
  fontSize: 14,
  dockSize: "medium",
  dockPosition: "bottom",
};

export const useOSStore = create<OSState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  apps: [],
  fileSystem: defaultFileSystem,
  settings: defaultSettings,
  galleryApps: [],
  installedAppIds: [],
  isBooting: true,
  contextMenu: null,

  openApp: (appId: string) => {
    const state = get();
    const app = state.apps.find((a) => a.id === appId);
    if (!app) return;

    windowCounter++;
    const newWindow: OSWindow = {
      id: `window-${Date.now()}-${windowCounter}`,
      appId: app.id,
      title: app.name,
      x: 100 + (windowCounter % 5) * 30,
      y: 60 + (windowCounter % 5) * 30,
      width: app.defaultWidth,
      height: app.defaultHeight,
      minWidth: app.minWidth,
      minHeight: app.minHeight,
      isMinimized: false,
      isMaximized: false,
      zIndex: Math.max(0, ...state.windows.map((w) => w.zIndex)) + 1,
      icon: app.icon,
    };

    set({
      windows: [...state.windows, newWindow],
      activeWindowId: newWindow.id,
    });
  },

  closeWindow: (windowId: string) => {
    set((state) => {
      const newWindows = state.windows.filter((w) => w.id !== windowId);
      return {
        windows: newWindows,
        activeWindowId:
          state.activeWindowId === windowId
            ? newWindows.length > 0
              ? newWindows[newWindows.length - 1].id
              : null
            : state.activeWindowId,
      };
    });
  },

  minimizeWindow: (windowId: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, isMinimized: true } : w
      ),
      activeWindowId:
        state.activeWindowId === windowId
          ? state.windows.find((w) => w.id !== windowId && !w.isMinimized)?.id || null
          : state.activeWindowId,
    }));
  },

  maximizeWindow: (windowId: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    }));
  },

  focusWindow: (windowId: string) => {
    set((state) => {
      const maxZ = Math.max(0, ...state.windows.map((w) => w.zIndex));
      return {
        windows: state.windows.map((w) =>
          w.id === windowId
            ? { ...w, isMinimized: false, zIndex: maxZ + 1 }
            : w
        ),
        activeWindowId: windowId,
      };
    });
  },

  updateWindow: (windowId: string, updates: Partial<OSWindow>) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, ...updates } : w
      ),
    }));
  },

  updateSettings: (updates: Partial<SystemSettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
  },

  setFileSystem: (fs: FileSystemNode) => {
    set({ fileSystem: fs });
  },

  installApp: (app: GalleryApp) => {
    set((state) => {
      if (state.installedAppIds.includes(app.id)) return state;
      const newApp: AppDefinition = {
        id: app.id,
        name: app.name,
        icon: app.icon || "📦",
        description: app.description,
        category: "utility",
        component: "GalleryAppFrame",
        defaultWidth: 800,
        defaultHeight: 600,
        minWidth: 400,
        minHeight: 300,
        isBuiltIn: false,
      };
      return {
        installedAppIds: [...state.installedAppIds, app.id],
        apps: [...state.apps, newApp],
        galleryApps: state.galleryApps.map((a) =>
          a.id === app.id ? { ...a, ...app } : a
        ),
      };
    });
  },

  uninstallApp: (appId: string) => {
    set((state) => ({
      installedAppIds: state.installedAppIds.filter((id) => id !== appId),
      apps: state.apps.filter((a) => !(a.id === appId && !a.isBuiltIn)),
      windows: state.windows.filter((w) => w.appId !== appId),
    }));
  },

  setGalleryApps: (apps: GalleryApp[]) => {
    set({ galleryApps: apps });
  },

  setBooting: (v: boolean) => {
    set({ isBooting: v });
  },

  setContextMenu: (menu) => {
    set({ contextMenu: menu });
  },
}));
