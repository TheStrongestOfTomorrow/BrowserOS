"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useOSStore } from "@/store";
import { Send, User, Hash, Settings, Info } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

export default function Chat() {
  const { settings } = useOSStore();
  const username = settings.username || "User";

  const initialMessages = useMemo(() => {
    // Note: In a real app, this would come from a server or effect
    // but for mock data we use a stable reference.
    const now = 1713596460000; // Fixed timestamp for hydration safety
    return [
      { id: "1", sender: "System", content: "Welcome to BrowserOS Chat! This is a mock interface.", timestamp: now - 100000 },
      { id: "2", sender: "Alice", content: "Hey everyone, how's it going?", timestamp: now - 50000 },
      { id: "3", sender: "Bob", content: "Doing great! Just building some apps on BrowserOS.", timestamp: now - 10000 },
    ];
  }, []);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: username,
      content: input,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Mock response
    setTimeout(() => {
      const response: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "Bot",
        content: `I received: "${input}"`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  }, [input, username]);

  return (
    <div className="h-full flex bg-[#313338]">
      {/* Sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col hidden sm:flex">
        <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 font-bold text-white shadow-sm">
          BrowserOS Server
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-1">
          <div className="text-zinc-500 text-[11px] font-bold uppercase px-2 mb-1 mt-2">Text Channels</div>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-[#3f4147] text-white">
            <Hash size={16} className="text-zinc-400" />
            <span className="text-sm">general</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-zinc-400 hover:bg-[#35373c] hover:text-zinc-200 transition-colors">
            <Hash size={16} className="text-zinc-400" />
            <span className="text-sm">development</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-zinc-400 hover:bg-[#35373c] hover:text-zinc-200 transition-colors">
            <Hash size={16} className="text-zinc-400" />
            <span className="text-sm">showcase</span>
          </button>
        </div>
        <div className="p-2 bg-[#232428] flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center text-white text-xs">
            {username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{username}</div>
            <div className="text-[10px] text-zinc-400 truncate">#0001</div>
          </div>
          <button className="p-1.5 text-zinc-400 hover:text-zinc-200"><Settings size={14} /></button>
        </div>
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 border-b border-[#1e1f22] flex items-center justify-between px-4 shadow-sm bg-[#313338]">
          <div className="flex items-center gap-2">
            <Hash size={20} className="text-zinc-400" />
            <span className="font-bold text-white">general</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <BellIcon size={18} />
            <Hash size={18} />
            <User size={18} />
            <div className="bg-[#1e1f22] rounded px-2 py-0.5 flex items-center gap-2">
              <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-xs w-24" />
            </div>
            <Info size={18} />
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-4 group hover:bg-black/5 -mx-4 px-4 py-1">
              <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center text-white shrink-0">
                {msg.sender[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white hover:underline cursor-pointer">{msg.sender}</span>
                  <span className="text-[10px] text-zinc-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-sm text-zinc-300 break-words">{msg.content}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pb-6">
          <div className="bg-[#383a40] rounded-lg px-4 py-2.5 flex items-center gap-4">
            <button className="w-6 h-6 bg-zinc-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-zinc-400 transition-colors">+</button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message #general"
              className="flex-1 bg-transparent border-none outline-none text-zinc-200 text-sm"
            />
            <div className="flex items-center gap-3 text-zinc-400">
              <button className="hover:text-zinc-200">🎁</button>
              <button className="hover:text-zinc-200">GIF</button>
              <button className="hover:text-zinc-200">😀</button>
              <button onClick={handleSend} className="text-blue-500 hover:text-blue-400"><Send size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components as separate icons
function BellIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
    </svg>
  );
}
