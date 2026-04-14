"use client";

import { useEffect, useState } from "react";
import { useOSStore } from "@/store";
import { Wifi, Battery, Volume2, ChevronDown } from "lucide-react";

export default function StatusBar() {
  const { settings } = useOSStore();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-7 bg-black/80 backdrop-blur-xl flex items-center justify-between px-3 text-white text-xs z-[9999] select-none border-b border-white/5">
      <div className="flex items-center gap-3">
        <button className="font-bold text-sm hover:bg-white/10 px-2 py-0.5 rounded transition-colors">
          🖥️ BrowserOS
        </button>
        <span className="text-zinc-400">|</span>
        <span className="text-zinc-300">{settings.username}</span>
      </div>
      <div className="flex items-center gap-3 text-zinc-300">
        {settings.wifiEnabled && (
          <Wifi size={13} className="text-blue-400" />
        )}
        <Volume2 size={13} />
        <Battery size={13} />
        <span className="text-zinc-400">|</span>
        <span>{date}</span>
        <span className="font-medium">{time}</span>
        <ChevronDown size={12} className="text-zinc-400" />
      </div>
    </div>
  );
}
