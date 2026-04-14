"use client";

import { useState, useCallback } from "react";
import { useOSStore } from "@/store";
import {
  Palette,
  Wifi,
  Bluetooth,
  Monitor,
  User,
  Bell,
  Type,
  Volume2,
} from "lucide-react";

type SettingsTab = "appearance" | "display" | "network" | "about" | "user";

export default function Settings() {
  const { settings, updateSettings } = useOSStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");

  const wallpapers = [
    { id: "gradient", name: "Cosmic Gradient", colors: "from-indigo-900 via-purple-900 to-slate-900" },
    { id: "ocean", name: "Deep Ocean", colors: "from-cyan-900 via-blue-900 to-slate-900" },
    { id: "sunset", name: "Sunset", colors: "from-orange-900 via-red-900 to-purple-900" },
    { id: "forest", name: "Forest", colors: "from-green-900 via-emerald-900 to-slate-900" },
    { id: "midnight", name: "Midnight", colors: "from-gray-900 via-slate-900 to-black" },
    { id: "aurora", name: "Aurora", colors: "from-teal-900 via-purple-900 to-blue-900" },
  ];

  const accentColors = [
    { id: "#3b82f6", name: "Blue" },
    { id: "#8b5cf6", name: "Purple" },
    { id: "#ec4899", name: "Pink" },
    { id: "#ef4444", name: "Red" },
    { id: "#f97316", name: "Orange" },
    { id: "#eab308", name: "Yellow" },
    { id: "#22c55e", name: "Green" },
    { id: "#06b6d4", name: "Cyan" },
  ];

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "appearance", label: "Appearance", icon: <Palette size={16} /> },
    { id: "display", label: "Display", icon: <Monitor size={16} /> },
    { id: "network", label: "Network", icon: <Wifi size={16} /> },
    { id: "user", label: "User", icon: <User size={16} /> },
    { id: "about", label: "About", icon: <Bell size={16} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Wallpaper</h3>
              <div className="grid grid-cols-3 gap-2">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => updateSettings({ wallpaper: wp.id })}
                    className={`h-20 rounded-lg bg-gradient-to-br ${wp.colors} border-2 transition-all ${
                      settings.wallpaper === wp.id ? "border-blue-500 ring-1 ring-blue-500/50" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="text-[10px] text-white/70 drop-shadow">{wp.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Accent Color</h3>
              <div className="flex gap-2 flex-wrap">
                {accentColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateSettings({ accentColor: color.id })}
                    className={`w-8 h-8 rounded-full transition-all ${
                      settings.accentColor === color.id ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-800" : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.id }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Theme</h3>
              <div className="flex gap-2">
                {(["dark", "light", "system"] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateSettings({ theme })}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                      settings.theme === theme ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "display":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Font Size</h3>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={20}
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs text-zinc-400 w-8">{settings.fontSize}px</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Dock Size</h3>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ dockSize: size })}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                      settings.dockSize === size ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Dock Position</h3>
              <div className="flex gap-2">
                {(["bottom", "left", "right"] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => updateSettings({ dockPosition: pos })}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                      settings.dockPosition === pos ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    }`}
                  >
                    {pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "network":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Wifi size={18} className={settings.wifiEnabled ? "text-blue-400" : "text-zinc-500"} />
                <div>
                  <div className="text-sm text-zinc-200">Wi-Fi</div>
                  <div className="text-[10px] text-zinc-500">{settings.wifiEnabled ? "Connected" : "Disabled"}</div>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ wifiEnabled: !settings.wifiEnabled })}
                className={`w-10 h-5 rounded-full transition-colors ${settings.wifiEnabled ? "bg-blue-600" : "bg-zinc-600"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.wifiEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bluetooth size={18} className={settings.bluetoothEnabled ? "text-blue-400" : "text-zinc-500"} />
                <div>
                  <div className="text-sm text-zinc-200">Bluetooth</div>
                  <div className="text-[10px] text-zinc-500">{settings.bluetoothEnabled ? "Enabled" : "Disabled"}</div>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ bluetoothEnabled: !settings.bluetoothEnabled })}
                className={`w-10 h-5 rounded-full transition-colors ${settings.bluetoothEnabled ? "bg-blue-600" : "bg-zinc-600"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.bluetoothEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        );

      case "user":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-2">Username</h3>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => updateSettings({ username: e.target.value })}
                className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-zinc-400" />
                <div>
                  <div className="text-sm text-zinc-200">Notifications</div>
                  <div className="text-[10px] text-zinc-500">{settings.notificationsEnabled ? "Enabled" : "Disabled"}</div>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                className={`w-10 h-5 rounded-full transition-colors ${settings.notificationsEnabled ? "bg-blue-600" : "bg-zinc-600"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.notificationsEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="text-5xl mb-3">🖥️</div>
              <h2 className="text-xl font-bold text-zinc-200">BrowserOS</h2>
              <p className="text-zinc-500 text-sm mt-1">Version 2.0.0</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between"><span>Platform</span><span className="text-zinc-300">Web Browser</span></div>
              <div className="flex justify-between"><span>Engine</span><span className="text-zinc-300">Next.js 16 + React 19</span></div>
              <div className="flex justify-between"><span>Storage</span><span className="text-zinc-300">OPFS + localStorage</span></div>
              <div className="flex justify-between"><span>Architecture</span><span className="text-zinc-300">Static / Serverless</span></div>
              <div className="flex justify-between"><span>PWA</span><span className="text-zinc-300">Supported</span></div>
              <div className="flex justify-between"><span>Infrastructure Cost</span><span className="text-green-400">$0/month</span></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex bg-zinc-900">
      {/* Sidebar */}
      <div className="w-48 bg-zinc-800/30 border-r border-white/5 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id ? "bg-blue-600/20 text-blue-300" : "text-zinc-400 hover:bg-white/5"
            }`}
          >
            {tab.icon}
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
}
