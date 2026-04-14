"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useOSStore } from "@/store";
import { resolvePath, getPathNode } from "@/lib/storage";

interface TerminalLine {
  type: "input" | "output" | "error";
  content: string;
}

export default function Terminal() {
  const { fileSystem, setFileSystem } = useOSStore();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "BrowserOS Terminal v2.0" },
    { type: "output", content: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/home/user");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const executeCommand = useCallback(
    (cmd: string) => {
      const parts = cmd.trim().split(/\s+/);
      const command = parts[0];
      const args = parts.slice(1);
      const output: TerminalLine[] = [{ type: "input", content: `${cwd} $ ${cmd}` }];

      switch (command) {
        case "help":
          output.push({
            type: "output",
            content:
              "Available commands:\n  help     - Show this help\n  ls       - List directory\n  cd       - Change directory\n  pwd      - Print working directory\n  cat      - Display file contents\n  mkdir    - Create directory\n  touch    - Create empty file\n  echo     - Print text\n  rm       - Remove file/directory\n  clear    - Clear terminal\n  whoami   - Show current user\n  date     - Show current date\n  neofetch - System info\n  open     - Open an app",
          });
          break;

        case "ls": {
          const targetPath = args[0] ? resolvePath(cwd, args[0]) : cwd;
          const node = getPathNode(fileSystem, targetPath);
          if (!node || node.type !== "directory") {
            output.push({ type: "error", content: `ls: cannot access '${args[0] || cwd}': No such directory` });
          } else {
            const entries = Object.values(node.children || {});
            if (entries.length === 0) {
              output.push({ type: "output", content: "(empty)" });
            } else {
              const listing = entries
                .map((e) => (e.type === "directory" ? `📁 ${e.name}/` : `📄 ${e.name}`))
                .join("\n");
              output.push({ type: "output", content: listing });
            }
          }
          break;
        }

        case "cd": {
          if (!args[0] || args[0] === "~") {
            setCwd("/home/user");
          } else {
            const targetPath = resolvePath(cwd, args[0]);
            const node = getPathNode(fileSystem, targetPath);
            if (node && node.type === "directory") {
              setCwd(targetPath);
            } else {
              output.push({ type: "error", content: `cd: no such directory: ${args[0]}` });
            }
          }
          break;
        }

        case "pwd":
          output.push({ type: "output", content: cwd });
          break;

        case "cat": {
          if (!args[0]) {
            output.push({ type: "error", content: "cat: missing operand" });
          } else {
            const targetPath = resolvePath(cwd, args[0]);
            const node = getPathNode(fileSystem, targetPath);
            if (node && node.type === "file") {
              output.push({ type: "output", content: node.content || "(empty)" });
            } else {
              output.push({ type: "error", content: `cat: ${args[0]}: No such file` });
            }
          }
          break;
        }

        case "mkdir": {
          if (!args[0]) {
            output.push({ type: "error", content: "mkdir: missing operand" });
          } else {
            const now = Date.now();
            const newDir = {
              name: args[0],
              type: "directory" as const,
              created: now,
              modified: now,
              size: 0,
              children: {},
            };
            const parent = getPathNode(fileSystem, cwd);
            if (parent && parent.type === "directory") {
              if (parent.children?.[args[0]]) {
                output.push({ type: "error", content: `mkdir: cannot create directory '${args[0]}': File exists` });
              } else {
                const newFS = JSON.parse(JSON.stringify(fileSystem));
                const parentNode = getPathNode(newFS, cwd);
                if (parentNode && parentNode.children) {
                  parentNode.children[args[0]] = newDir;
                  setFileSystem(newFS);
                  output.push({ type: "output", content: "" });
                }
              }
            }
          }
          break;
        }

        case "touch": {
          if (!args[0]) {
            output.push({ type: "error", content: "touch: missing operand" });
          } else {
            const now = Date.now();
            const newFile = {
              name: args[0],
              type: "file" as const,
              content: "",
              created: now,
              modified: now,
              size: 0,
            };
            const newFS = JSON.parse(JSON.stringify(fileSystem));
            const parentNode = getPathNode(newFS, cwd);
            if (parentNode && parentNode.children) {
              parentNode.children[args[0]] = newFile;
              setFileSystem(newFS);
            }
          }
          break;
        }

        case "echo":
          output.push({ type: "output", content: args.join(" ") });
          break;

        case "rm": {
          if (!args[0]) {
            output.push({ type: "error", content: "rm: missing operand" });
          } else {
            const newFS = JSON.parse(JSON.stringify(fileSystem));
            const parentNode = getPathNode(newFS, cwd);
            if (parentNode && parentNode.children && parentNode.children[args[0]]) {
              delete parentNode.children[args[0]];
              setFileSystem(newFS);
            } else {
              output.push({ type: "error", content: `rm: cannot remove '${args[0]}': No such file or directory` });
            }
          }
          break;
        }

        case "clear":
          setLines([]);
          return;

        case "whoami":
          output.push({ type: "output", content: "user" });
          break;

        case "date":
          output.push({ type: "output", content: new Date().toString() });
          break;

        case "neofetch":
          output.push({
            type: "output",
            content: `
   ╭───────────╮     user@browseros
   │  🖥️       │     ─────────────
   │ BrowserOS │     OS: BrowserOS v2.0
   │   v2.0    │     Host: ${navigator.userAgent.split(" ").slice(-1)[0]}
   ╰───────────╯     Kernel: Next.js 16
                     Shell: BrowserOS Terminal
                     Resolution: ${window.innerWidth}x${window.innerHeight}
                     Theme: Dark
                     Memory: ${(navigator as Navigator & { deviceMemory?: number }).deviceMemory || "N/A"} GB`,
          });
          break;

        case "open": {
          if (!args[0]) {
            output.push({ type: "error", content: "open: missing app name" });
          } else {
            const { openApp } = useOSStore.getState();
            openApp(args[0]);
            output.push({ type: "output", content: `Opening ${args[0]}...` });
          }
          break;
        }

        case "":
          break;

        default:
          output.push({ type: "error", content: `${command}: command not found` });
      }

      setLines((prev) => [...prev, ...output]);
    },
    [cwd, fileSystem, setFileSystem]
  );

  const handleSubmit = () => {
    if (!input.trim()) {
      setLines((prev) => [...prev, { type: "input", content: `${cwd} $ ` }]);
      return;
    }
    setHistory((prev) => [...prev, input]);
    setHistIdx(-1);
    executeCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx >= 0) {
        const newIdx = histIdx + 1;
        if (newIdx >= history.length) {
          setHistIdx(-1);
          setInput("");
        } else {
          setHistIdx(newIdx);
          setInput(history[newIdx]);
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 font-mono text-sm">
      <div ref={scrollRef} className="flex-1 overflow-auto p-3">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap break-all ${
              line.type === "error"
                ? "text-red-400"
                : line.type === "input"
                ? "text-green-400"
                : "text-zinc-300"
            }`}
          >
            {line.content}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-green-400 shrink-0">{cwd} $ </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-zinc-100 outline-none ml-1 caret-green-400"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
