"use client";

import { useEffect, useState } from "react";
import { useOSStore } from "@/store";
import { builtInApps } from "@/lib/apps";
import StatusBar from "@/components/os/StatusBar";
import Dock from "@/components/os/Dock";
import Desktop from "@/components/os/Desktop";
import WindowManager from "@/components/os/WindowManager";
import Terminal from "@/components/apps/Terminal";
import Files from "@/components/apps/Files";
import Browser from "@/components/apps/Browser";
import CodeEditor from "@/components/apps/CodeEditor";
import Chat from "@/components/apps/Chat";
import AppBuilder from "@/components/apps/AppBuilder";
import Settings from "@/components/apps/Settings";
import Notepad from "@/components/apps/Notepad";
import Calculator from "@/components/apps/Calculator";
import AppGallery from "@/components/apps/AppGallery";

const APP_COMPONENTS: Record<string, React.ComponentType> = {
  Terminal,
  Files,
  Browser,
  CodeEditor,
  Chat,
  AppBuilder,
  Settings,
  Notepad,
  Calculator,
  AppGallery,
  GalleryAppFrame: GalleryAppFrameComponent,
};

function GalleryAppFrameComponent() {
  return (
    <div className="h-full flex items-center justify-center bg-zinc-900 text-zinc-400 text-sm">
      <div className="text-center">
        <div className="text-3xl mb-2">📱</div>
        <p>Installed Gallery App</p>
        <p className="text-xs text-zinc-600 mt-1">Launch from the App Gallery</p>
      </div>
    </div>
  );
}

function BootScreen() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const steps = [
      { at: 10, text: "Loading kernel..." },
      { at: 25, text: "Mounting filesystem..." },
      { at: 40, text: "Starting window manager..." },
      { at: 55, text: "Loading applications..." },
      { at: 70, text: "Configuring network..." },
      { at: 85, text: "Starting desktop..." },
      { at: 95, text: "Almost ready..." },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = steps.find((s) => next >= s.at && prev < s.at);
        if (step) setStatus(step.text);
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black">
      <div className="text-6xl mb-6 animate-pulse">🖥️</div>
      <h1 className="text-2xl font-bold text-white mb-2">BrowserOS</h1>
      <p className="text-sm text-zinc-500 mb-8">Version 2.0</p>
      <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-zinc-600 mt-3">{status}</p>
    </div>
  );
}

export default function Home() {
  const { apps, isBooting, setBooting, settings } = useOSStore();
  const [ready, setReady] = useState(false);

  // Initialize apps on mount
  useEffect(() => {
    const currentApps = useOSStore.getState().apps;
    if (currentApps.length === 0) {
      useOSStore.setState({ apps: [...builtInApps] });
    }
    setReady(true);
  }, []);

  // Boot sequence
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      setBooting(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [ready, setBooting]);

  if (!ready || isBooting) {
    return <BootScreen />;
  }

  const wallpaperGradients: Record<string, string> = {
    gradient: "bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900",
    ocean: "bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900",
    sunset: "bg-gradient-to-br from-orange-900 via-red-900 to-purple-900",
    forest: "bg-gradient-to-br from-green-900 via-emerald-900 to-slate-900",
    midnight: "bg-gradient-to-br from-gray-900 via-slate-900 to-black",
    aurora: "bg-gradient-to-br from-teal-900 via-purple-900 to-blue-900",
  };

  const wallpaperClass = wallpaperGradients[settings.wallpaper] || wallpaperGradients.gradient;

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden select-none ${wallpaperClass}`}>
      <StatusBar />
      <Desktop />
      <WindowManager>
        {(windowId, appId) => {
          const AppComponent = APP_COMPONENTS[appId];
          if (!AppComponent) {
            return (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                App &quot;{appId}&quot; not found
              </div>
            );
          }
          return <AppComponent key={windowId} />;
        }}
      </WindowManager>
      <Dock />
    </div>
  );
}
