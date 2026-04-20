"use client";

import { useState, useCallback } from "react";
import { useOSStore } from "@/store";
import { Play, Save, Upload, Download, Code, Eye } from "lucide-react";

export default function AppBuilder() {
  const { installApp } = useOSStore();
  const [appName, setAppName] = useState("My App");
  const [html, setHtml] = useState('<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">' +
  '\n  <div style="text-align:center;">' +
  '\n    <h1 style="font-size:2.5rem;margin-bottom:0.5rem;">Hello, BrowserOS!</h1>' +
  '\n    <p style="font-size:1.2rem;opacity:0.8;">This is my first BrowserOS app</p>' +
  '\n    <button style="margin-top:1rem;padding:0.75rem 2rem;border:none;border-radius:8px;background:white;color:#667eea;font-size:1rem;cursor:pointer;" onclick="this.textContent=\'It works!\'">Click Me</button>' +
  '\n  </div>' +
  '\n</div>');
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js" | "preview">("html");
  const [previewKey, setPreviewKey] = useState(1);

  const getPreviewDoc = useCallback(() => {
    return `<!DOCTYPE html>
<html>
<head><style>${css}</style></head>
<body>${html}<script>${js}</script></body>
</html>`;
  }, [html, css, js]);

  const handleInstall = useCallback(() => {
    const id = appName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    installApp({
      id,
      name: appName,
      description: "Custom app created with App Builder",
      author: "You",
      version: "1.0.0",
      icon: "🚀",
      category: "custom",
      url: "",
      screenshots: [],
      rating: 5,
      downloads: 0,
      html: getPreviewDoc(),
    });
    alert(`"${appName}" has been installed! Find it in your apps.`);
  }, [appName, getPreviewDoc, installApp]);

  const handleExport = useCallback(() => {
    const appData = {
      name: appName,
      html,
      css,
      js
    };
    const blob = new Blob([JSON.stringify(appData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${appName.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [appName, html, css, js]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const appData = JSON.parse(event.target?.result as string);
        if (appData.name) setAppName(appData.name);
        if (appData.html) setHtml(appData.html);
        if (appData.css) setCss(appData.css);
        if (appData.js) setJs(appData.js);
        setActiveTab("html");
      } catch (err) {
        console.error("Import failed:", err);
        alert("Failed to parse app file.");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = "";
  }, []);

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border-b border-white/5">
        <input
          type="text"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          className="bg-zinc-700/50 rounded px-2 py-1 text-sm text-zinc-200 outline-none w-48"
          placeholder="App name..."
        />
        <div className="flex-1" />
        <button
          onClick={handleExport}
          className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
          title="Export as JSON"
        >
          <Download size={14} />
        </button>
        <label className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors cursor-pointer" title="Import from JSON">
          <Upload size={14} />
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          onClick={() => { setPreviewKey((k) => k + 1); setActiveTab("preview"); }}
          className="flex items-center gap-1 px-3 py-1 text-xs bg-green-600 hover:bg-green-500 rounded transition-colors"
        >
          <Play size={12} /> Preview
        </button>
        <button
          onClick={handleInstall}
          className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded transition-colors"
        >
          <Save size={12} /> Install App
        </button>
      </div>

      {/* Editor tabs */}
      <div className="flex items-center bg-zinc-800/50 border-b border-white/5">
        {(["html", "css", "js", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-400 bg-zinc-800/50"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab === "preview" ? <Eye size={12} className="inline mr-1" /> : <Code size={12} className="inline mr-1" />}
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "preview" ? (
          <iframe
            key={previewKey}
            srcDoc={getPreviewDoc()}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts"
            title="Preview"
          />
        ) : (
          <textarea
            value={activeTab === "html" ? html : activeTab === "css" ? css : js}
            onChange={(e) => {
              if (activeTab === "html") setHtml(e.target.value);
              else if (activeTab === "css") setCss(e.target.value);
              else setJs(e.target.value);
            }}
            className="w-full h-full bg-zinc-950 text-zinc-200 p-3 font-mono text-xs resize-none outline-none"
            spellCheck={false}
            placeholder={activeTab === "html" ? "Write HTML here..." : activeTab === "css" ? "Write CSS here..." : "Write JavaScript here..."}
          />
        )}
      </div>
    </div>
  );
}
