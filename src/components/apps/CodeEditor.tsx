"use client";

import { useState, useCallback } from "react";
import { useOSStore } from "@/store";
import { getPathNode } from "@/lib/storage";

const LANGUAGES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  tsx: "typescript",
  jsx: "javascript",
  py: "python",
  html: "html",
  css: "css",
  json: "json",
  md: "markdown",
  txt: "plaintext",
};

export default function CodeEditor() {
  const { fileSystem, setFileSystem } = useOSStore();
  const [filePath, setFilePath] = useState("/home/user/Documents/hello.js");
  const [content, setContent] = useState('// Welcome to BrowserOS Code Editor\nconsole.log("Hello, World!");\n');
  const [saved, setSaved] = useState(true);
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const handleSave = useCallback(() => {
    const newFS = JSON.parse(JSON.stringify(fileSystem));
    const parts = filePath.split("/").filter(Boolean);
    const fileName = parts.pop() || "untitled";
    const dirPath = "/" + parts.join("/");
    const parentNode = getPathNode(newFS, dirPath);
    if (parentNode && parentNode.type === "directory" && parentNode.children) {
      parentNode.children[fileName] = {
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
  }, [filePath, content, fileSystem, setFileSystem]);

  const handleRun = useCallback(() => {
    if (filePath.endsWith(".js") || filePath.endsWith(".ts")) {
      try {
        const logs: string[] = [];
        const mockConsole = {
          log: (...args: unknown[]) => logs.push(args.map((a) => String(a)).join(" ")),
          error: (...args: unknown[]) => logs.push("ERROR: " + args.map((a) => String(a)).join(" ")),
          warn: (...args: unknown[]) => logs.push("WARN: " + args.map((a) => String(a)).join(" ")),
        };
        const fn = new Function("console", content);
        fn(mockConsole);
        setOutput(logs.join("\n") || "(No output)");
      } catch (err) {
        setOutput("Error: " + (err instanceof Error ? err.message : String(err)));
      }
      setShowOutput(true);
    } else if (filePath.endsWith(".html")) {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(content);
        win.document.close();
      }
    } else {
      setOutput("Run is only supported for JavaScript and HTML files.");
      setShowOutput(true);
    }
  }, [filePath, content]);

  const ext = filePath.split(".").pop() || "txt";
  const lang = LANGUAGES[ext] || "plaintext";

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border-b border-white/5">
        <input
          type="text"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          className="bg-zinc-700/50 rounded px-2 py-1 text-xs text-zinc-300 outline-none flex-1 font-mono"
        />
        <span className="text-[10px] text-zinc-500 bg-zinc-700/50 px-2 py-0.5 rounded">{lang}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded ${saved ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
          {saved ? "Saved" : "Modified"}
        </span>
        <button onClick={handleSave} className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded transition-colors">
          Save
        </button>
        <button onClick={handleRun} className="px-3 py-1 text-xs bg-green-600 hover:bg-green-500 rounded transition-colors">
          ▶ Run
        </button>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 relative">
          {/* Line numbers + textarea */}
          <div className="flex h-full">
            <div className="bg-zinc-800/30 text-zinc-600 text-xs font-mono text-right pr-2 pt-3 select-none overflow-hidden w-10 shrink-0">
              {content.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setSaved(false); }}
              className="flex-1 bg-zinc-950 text-zinc-200 p-3 font-mono text-xs resize-none outline-none leading-5"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output panel */}
        {showOutput && (
          <div className="h-40 border-t border-white/5 bg-zinc-950 flex flex-col">
            <div className="flex items-center justify-between px-3 py-1 bg-zinc-800/50">
              <span className="text-xs text-zinc-400">Output</span>
              <button onClick={() => setShowOutput(false)} className="text-xs text-zinc-500 hover:text-zinc-300">✕</button>
            </div>
            <pre className="flex-1 overflow-auto p-3 text-xs font-mono text-green-400">{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
