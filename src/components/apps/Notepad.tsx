"use client";

import { useState, useCallback } from "react";
import { useOSStore } from "@/store";
import { Save, FileText } from "lucide-react";

export default function Notepad() {
  const { fileSystem, setFileSystem } = useOSStore();
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("untitled.txt");
  const [saved, setSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);

  const updateContent = useCallback((text: string) => {
    setContent(text);
    setSaved(false);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }, []);

  const handleSave = useCallback(() => {
    const newFS = JSON.parse(JSON.stringify(fileSystem));
    const parent = newFS.children?.home?.children?.user?.children?.Documents;
    if (parent && parent.children) {
      parent.children[fileName] = {
        name: fileName,
        type: "file",
        content,
        created: Date.now(),
        modified: Date.now(),
        size: content.length,
      };
      setFileSystem(newFS);
      setSaved(true);
    }
  }, [fileName, content, fileSystem, setFileSystem]);

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border-b border-white/5">
        <FileText size={14} className="text-zinc-400" />
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="bg-zinc-700/50 rounded px-2 py-1 text-xs text-zinc-300 outline-none"
        />
        <span className={`text-[10px] px-2 py-0.5 rounded ${saved ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
          {saved ? "Saved" : "Modified"}
        </span>
        <div className="flex-1" />
        <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded transition-colors">
          <Save size={12} /> Save
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => updateContent(e.target.value)}
        className="flex-1 bg-zinc-950 text-zinc-200 p-4 text-sm resize-none outline-none font-sans leading-6"
        placeholder="Start typing..."
        spellCheck
      />
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-800/50 border-t border-white/5 text-[10px] text-zinc-500">
        <span>Words: {wordCount}</span>
        <span>Characters: {content.length}</span>
        <span>Lines: {content.split("\n").length}</span>
      </div>
    </div>
  );
}
