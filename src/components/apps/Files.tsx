"use client";

import { useState, useCallback } from "react";
import { useOSStore } from "@/store";
import { getPathNode, resolvePath } from "@/lib/storage";
import { formatFileSize, formatTimestamp } from "@/lib/filesystem";
import {
  Folder,
  FileText,
  ChevronRight,
  ArrowUp,
  Plus,
  FolderPlus,
  Home,
} from "lucide-react";

export default function Files() {
  const { fileSystem, setFileSystem } = useOSStore();
  const [currentPath, setCurrentPath] = useState("/home/user");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showNewFile, setShowNewFile] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const currentNode = getPathNode(fileSystem, currentPath);

  const navigateTo = useCallback(
    (path: string) => {
      const node = getPathNode(fileSystem, path);
      if (node && node.type === "directory") {
        setCurrentPath(path);
        setSelectedItem(null);
      }
    },
    [fileSystem]
  );

  const goUp = useCallback(() => {
    const parts = currentPath.split("/").filter(Boolean);
    if (parts.length > 0) {
      parts.pop();
      navigateTo("/" + parts.join("/"));
    }
  }, [currentPath, navigateTo]);

  const handleCreate = useCallback(
    (type: "file" | "directory") => {
      if (!newName.trim()) return;
      const now = Date.now();
      const newNode =
        type === "directory"
          ? { name: newName, type: "directory" as const, created: now, modified: now, size: 0, children: {} }
          : { name: newName, type: "file" as const, content: "", created: now, modified: now, size: 0 };

      const newFS = JSON.parse(JSON.stringify(fileSystem));
      const parentNode = getPathNode(newFS, currentPath);
      if (parentNode && parentNode.children) {
        parentNode.children[newName] = newNode;
        setFileSystem(newFS);
      }
      setNewName("");
      setShowNewFile(false);
      setShowNewFolder(false);
    },
    [newName, currentPath, fileSystem, setFileSystem]
  );

  const handleDelete = useCallback(() => {
    if (!selectedItem) return;
    const newFS = JSON.parse(JSON.stringify(fileSystem));
    const parentNode = getPathNode(newFS, currentPath);
    if (parentNode && parentNode.children) {
      delete parentNode.children[selectedItem];
      setFileSystem(newFS);
      setSelectedItem(null);
    }
  }, [selectedItem, currentPath, fileSystem, setFileSystem]);

  const handleSaveFile = useCallback(() => {
    if (!editingFile) return;
    const newFS = JSON.parse(JSON.stringify(fileSystem));
    const fileNode = getPathNode(newFS, resolvePath(currentPath, editingFile));
    if (fileNode && fileNode.type === "file") {
      fileNode.content = editContent;
      fileNode.modified = Date.now();
      fileNode.size = editContent.length;
      setFileSystem(newFS);
    }
    setEditingFile(null);
    setEditContent("");
  }, [editingFile, editContent, currentPath, fileSystem, setFileSystem]);

  const entries = currentNode?.type === "directory"
    ? Object.values(currentNode.children || {}).sort((a, b) => {
        if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
    : [];

  if (editingFile) {
    return (
      <div className="h-full flex flex-col bg-zinc-900">
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-white/5">
          <span className="text-xs text-zinc-400">Editing: {editingFile}</span>
          <div className="flex-1" />
          <button
            onClick={handleSaveFile}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => { setEditingFile(null); setEditContent(""); }}
            className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="flex-1 bg-zinc-950 text-zinc-200 p-3 font-mono text-xs resize-none outline-none"
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border-b border-white/5">
        <button onClick={() => navigateTo("/home/user")} className="p-1 hover:bg-white/10 rounded" title="Home">
          <Home size={14} className="text-zinc-400" />
        </button>
        <button onClick={goUp} className="p-1 hover:bg-white/10 rounded" title="Go up">
          <ArrowUp size={14} className="text-zinc-400" />
        </button>
        <div className="flex-1 bg-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 font-mono">
          {currentPath}
        </div>
        <button onClick={() => { setShowNewFolder(true); setNewName(""); }} className="p-1 hover:bg-white/10 rounded" title="New folder">
          <FolderPlus size={14} className="text-zinc-400" />
        </button>
        <button onClick={() => { setShowNewFile(true); setNewName(""); }} className="p-1 hover:bg-white/10 rounded" title="New file">
          <Plus size={14} className="text-zinc-400" />
        </button>
        {selectedItem && (
          <button onClick={handleDelete} className="px-2 py-1 text-xs bg-red-600/80 hover:bg-red-500 rounded transition-colors">
            Delete
          </button>
        )}
      </div>

      {/* New file/folder input */}
      {(showNewFile || showNewFolder) && (
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/30 border-b border-white/5">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate(showNewFolder ? "directory" : "file")}
            placeholder={showNewFolder ? "Folder name..." : "File name..."}
            className="flex-1 bg-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 outline-none"
            autoFocus
          />
          <button
            onClick={() => handleCreate(showNewFolder ? "directory" : "file")}
            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded"
          >
            Create
          </button>
          <button
            onClick={() => { setShowNewFile(false); setShowNewFolder(false); setNewName(""); }}
            className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-auto p-2">
        {entries.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm mt-8">This folder is empty</div>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.name}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedItem === entry.name ? "bg-blue-600/20 text-blue-300" : "hover:bg-white/5 text-zinc-300"
              }`}
              onClick={() => setSelectedItem(entry.name)}
              onDoubleClick={() => {
                if (entry.type === "directory") {
                  navigateTo(resolvePath(currentPath, entry.name));
                } else {
                  setEditingFile(entry.name);
                  setEditContent(entry.content || "");
                }
              }}
            >
              {entry.type === "directory" ? (
                <Folder size={16} className="text-yellow-400 shrink-0" />
              ) : (
                <FileText size={16} className="text-blue-400 shrink-0" />
              )}
              <span className="flex-1 text-sm truncate">{entry.name}</span>
              {entry.type === "file" && (
                <span className="text-[10px] text-zinc-500">{formatFileSize(entry.size)}</span>
              )}
              <span className="text-[10px] text-zinc-600">{formatTimestamp(entry.modified)}</span>
              {entry.type === "directory" && <ChevronRight size={12} className="text-zinc-600" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
