export interface OSWindow {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  icon?: string;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "system" | "productivity" | "dev" | "media" | "social" | "utility";
  component: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  isBuiltIn: boolean;
}

export interface FileSystemNode {
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: Record<string, FileSystemNode>;
  created: number;
  modified: number;
  size: number;
}

export interface SystemSettings {
  wallpaper: string;
  wallpaperColor: string;
  theme: "light" | "dark" | "system";
  accentColor: string;
  username: string;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  notificationsEnabled: boolean;
  fontSize: number;
  dockSize: "small" | "medium" | "large";
  dockPosition: "bottom" | "left" | "right";
}

export interface GalleryApp {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  icon: string;
  category: string;
  url: string;
  screenshots: string[];
  rating: number;
  downloads: number;
  html?: string;
  sourceUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  type: "text" | "image" | "file" | "system";
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  messages: ChatMessage[];
  createdAt: number;
}
