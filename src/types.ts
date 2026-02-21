import type React from 'react';

export type WindowId = string;

export interface WindowState {
  id: WindowId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  type: 'app' | 'system';
  content: React.ReactNode;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  defaultWidth?: number;
  defaultHeight?: number;
}
