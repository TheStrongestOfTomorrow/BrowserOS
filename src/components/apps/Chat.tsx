"use client";

import { useState, useCallback } from "react";
import { Send, Users, Plus } from "lucide-react";
import type { ChatMessage, ChatRoom } from "@/types";

export default function Chat() {
  const [rooms, setRooms] = useState<ChatRoom[]>([
    {
      id: "general",
      name: "General",
      participants: ["You", "BrowserOS"],
      messages: [
        { id: "1", sender: "BrowserOS", content: "Welcome to BrowserOS Chat! This is a peer-to-peer chat powered by WebRTC.", timestamp: Date.now() - 60000, type: "system" },
        { id: "2", sender: "BrowserOS", content: "To connect with others, share your room code or join an existing room.", timestamp: Date.now() - 30000, type: "system" },
      ],
      createdAt: Date.now(),
    },
  ]);
  const [activeRoom, setActiveRoom] = useState("general");
  const [input, setInput] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [username] = useState("You");

  const currentRoom = rooms.find((r) => r.id === activeRoom);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !currentRoom) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: username,
      content: input.trim(),
      timestamp: Date.now(),
      type: "text",
    };
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom ? { ...r, messages: [...r.messages, msg] } : r
      )
    );
    setInput("");

    // Simulated response
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more.",
        "I'm just a simulated chat partner. In the full version, you'll connect with real users via WebRTC.",
        "BrowserOS Chat supports text, voice, and video calls!",
        "Try the App Gallery to find more apps.",
        "You can build your own apps with the App Builder!",
      ];
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "BrowserOS",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        type: "text",
      };
      setRooms((prev) =>
        prev.map((r) =>
          r.id === activeRoom ? { ...r, messages: [...r.messages, reply] } : r
        )
      );
    }, 1000 + Math.random() * 2000);
  }, [input, activeRoom, currentRoom, username]);

  const joinRoom = useCallback(() => {
    if (!roomCode.trim()) return;
    const roomId = roomCode.trim().toLowerCase();
    if (!rooms.find((r) => r.id === roomId)) {
      const newRoom: ChatRoom = {
        id: roomId,
        name: `Room: ${roomId}`,
        participants: [username],
        messages: [
          { id: Date.now().toString(), sender: "System", content: `Joined room: ${roomId}`, timestamp: Date.now(), type: "system" },
        ],
        createdAt: Date.now(),
      };
      setRooms((prev) => [...prev, newRoom]);
    }
    setActiveRoom(roomId);
    setRoomCode("");
  }, [roomCode, rooms, username]);

  return (
    <div className="h-full flex bg-zinc-900">
      {/* Sidebar */}
      <div className="w-56 bg-zinc-800/50 border-r border-white/5 flex flex-col">
        <div className="p-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <Users size={14} />
            <span>Chat Rooms</span>
          </div>
          <div className="flex gap-1">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              placeholder="Room code..."
              className="flex-1 bg-zinc-700/50 rounded px-2 py-1 text-xs text-zinc-300 outline-none"
            />
            <button onClick={joinRoom} className="p-1 bg-blue-600 hover:bg-blue-500 rounded">
              <Plus size={12} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                activeRoom === room.id ? "bg-blue-600/20 text-blue-300" : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              <div className="font-medium text-xs">{room.name}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{room.participants.length} members</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-2 border-b border-white/5 bg-zinc-800/30">
          <span className="text-sm font-medium text-zinc-300">{currentRoom?.name || "Select a room"}</span>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {currentRoom?.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === username ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-lg px-3 py-2 ${
                msg.type === "system"
                  ? "bg-zinc-700/30 text-zinc-500 text-xs text-center max-w-full"
                  : msg.sender === username
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-700 text-zinc-200"
              }`}>
                {msg.type !== "system" && msg.sender !== username && (
                  <div className="text-[10px] text-blue-400 mb-1">{msg.sender}</div>
                )}
                <div className="text-sm">{msg.content}</div>
                <div className="text-[9px] mt-1 opacity-50">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 py-2 border-t border-white/5 bg-zinc-800/30 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-700/50 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-lg transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
