import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { 
  Terminal as TerminalIcon, Folder, Code, Gamepad2, Globe, 
  Settings as SettingsIcon, Cpu, FileText, ChevronRight, 
  Save, Trash2, Image as ImageIcon, Play, Sparkles, 
  Bot, MessageSquare, Key, Send, Layout, Eye, RefreshCw,
  Puzzle, Terminal as TerminalIcon2, Box, Youtube, Calculator as CalcIcon,
  PenTool, CloudSun, Hash, Download, Plus, X as CloseIcon, Terminal as ConsoleIcon,
  Globe2, Braces, Wand2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

import { useFileSystem } from './hooks/useFileSystem';

// --- YouTube App ---
const YouTubeApp = () => {
  const [url, setUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');

  const handlePlay = () => {
    try {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
      } else {
        alert('Invalid YouTube URL');
      }
    } catch (e) {
      alert('Error parsing URL');
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white">
      <div className="p-4 flex gap-2 bg-zinc-900 border-b border-white/10">
        <input 
          type="text" 
          placeholder="Paste YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-500/50 transition-colors"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handlePlay}
          className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
        >
          <Youtube size={16} /> Play
        </button>
      </div>
      <div className="flex-1 bg-black flex items-center justify-center">
        {embedUrl ? (
          <iframe 
            src={embedUrl} 
            className="w-full h-full" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            title="YouTube Video"
          />
        ) : (
          <div className="text-zinc-500 flex flex-col items-center gap-4">
            <Youtube size={64} className="opacity-20" />
            <p className="text-sm italic">Enter a video link to start watching</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Calculator App ---
const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleBtn = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
    } else if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(equation);
        setDisplay(String(result));
        setEquation(String(result));
      } catch (e) {
        setDisplay('Error');
      }
    } else {
      const newEq = equation === '0' ? val : equation + val;
      setEquation(newEq);
      setDisplay(newEq);
    }
  };

  const btns = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'];

  return (
    <div className="h-full bg-zinc-900 p-6 flex flex-col gap-4">
      <div className="bg-black/40 p-4 rounded-xl text-right border border-white/5">
        <div className="text-xs text-white/30 h-4">{equation}</div>
        <div className="text-3xl font-display font-bold text-white truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {btns.map(b => (
          <button 
            key={b}
            onClick={() => handleBtn(b)}
            className={cn(
              "rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center",
              ['/', '*', '-', '+', '='].includes(b) ? "bg-orange-500 text-white hover:bg-orange-400" : "bg-white/5 text-white hover:bg-white/10",
              b === 'C' && "bg-red-500/20 text-red-400 hover:bg-red-500/30",
              b === '=' && "col-span-1"
            )}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Tic-Tac-Toe App ---
const TicTacToeApp = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: any[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner}` : board.every(s => s) ? "Draw!" : `Next: ${xIsNext ? 'X' : 'O'}`;

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const nextBoard = board.slice();
    nextBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  return (
    <div className="h-full bg-zinc-950 flex flex-col items-center justify-center p-8">
      <div className="text-xl font-bold mb-8 text-white/80">{status}</div>
      <div className="grid grid-cols-3 gap-2 bg-white/10 p-2 rounded-2xl">
        {board.map((val, i) => (
          <button 
            key={i}
            onClick={() => handleClick(i)}
            className="w-20 h-20 bg-zinc-900 rounded-xl flex items-center justify-center text-3xl font-bold text-white hover:bg-zinc-800 transition-colors"
          >
            <span className={cn(val === 'X' ? "text-blue-400" : "text-red-400")}>{val}</span>
          </button>
        ))}
      </div>
      <button 
        onClick={() => { setBoard(Array(9).fill(null)); setXIsNext(true); }}
        className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-all"
      >
        Reset Game
      </button>
    </div>
  );
};

// --- Whiteboard App ---
const WhiteboardApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = color;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      <div className="p-2 bg-zinc-800 border-b border-white/10 flex gap-4 items-center">
        <div className="flex gap-2">
          {['#ffffff', '#ef4444', '#3b82f6', '#10b981', '#eab308'].map(c => (
            <button 
              key={c}
              onClick={() => setColor(c)}
              className={cn("w-6 h-6 rounded-full border-2", color === c ? "border-white" : "border-transparent")}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <button 
          onClick={() => {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }}
          className="text-xs font-bold text-white/50 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex-1 relative">
        <canvas 
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          className="cursor-crosshair"
        />
      </div>
    </div>
  );
};

// --- Weather App ---
const WeatherApp = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using Open-Meteo (Free, no key)
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true');
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center text-white/50 animate-pulse">Fetching weather...</div>;

  return (
    <div className="h-full bg-gradient-to-br from-blue-600 to-indigo-900 p-8 text-white flex flex-col items-center justify-center">
      <CloudSun size={80} className="mb-4 drop-shadow-2xl" />
      <div className="text-6xl font-display font-bold mb-2">{weather?.temperature}°C</div>
      <div className="text-xl opacity-80 mb-8">New York, NY</div>
      <div className="grid grid-cols-2 gap-8 w-full max-w-xs">
        <div className="glass p-4 rounded-2xl text-center">
          <div className="text-[10px] uppercase opacity-50 mb-1">Wind</div>
          <div className="font-bold">{weather?.windspeed} km/h</div>
        </div>
        <div className="glass p-4 rounded-2xl text-center">
          <div className="text-[10px] uppercase opacity-50 mb-1">Direction</div>
          <div className="font-bold">{weather?.winddirection}°</div>
        </div>
      </div>
    </div>
  );
};

// --- API Tester App ---
const APITesterApp = () => {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch(url, { method });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white p-4 gap-4">
      <div className="flex gap-2">
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
          className="bg-zinc-800 border border-white/10 rounded-lg px-2 py-1 text-xs outline-none"
        >
          {['GET', 'POST', 'PUT', 'DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs outline-none focus:border-blue-500/50"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-1 rounded-lg text-xs font-bold disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div className="flex-1 bg-black/40 rounded-xl border border-white/5 p-4 font-mono text-xs overflow-auto no-scrollbar">
        <pre className="text-blue-400">{response || 'Response will appear here...'}</pre>
      </div>
    </div>
  );
};

// --- JSON Tool App ---
const JSONToolApp = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
    } catch (e) {
      setOutput('Invalid JSON');
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
    } catch (e) {
      setOutput('Invalid JSON');
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white p-4 gap-4">
      <div className="flex-1 grid grid-cols-2 gap-4">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON here..."
          className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs outline-none focus:border-blue-500/50 resize-none"
        />
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-xs overflow-auto no-scrollbar whitespace-pre text-emerald-400">
          {output || 'Output will appear here...'}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={format} className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold transition-all">Format</button>
        <button onClick={minify} className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold transition-all">Minify</button>
      </div>
    </div>
  );
};

// --- Python Playground ---
const PythonPlayground = () => {
  const [code, setCode] = useState('print("Hello from browserOS Python!")\n\nfor i in range(5):\n    print(f"Count: {i}")');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    const loadPyodide = async () => {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
        script.onload = async () => {
          pyodideRef.current = await (window as any).loadPyodide();
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } else {
        pyodideRef.current = await (window as any).loadPyodide();
        setIsLoading(false);
      }
    };
    loadPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current) return;
    setOutput('Running...');
    try {
      // Redirect stdout
      pyodideRef.current.runPython(`
import sys
import io
sys.stdout = io.String()
      `);
      await pyodideRef.current.runPythonAsync(code);
      const stdout = pyodideRef.current.runPython('sys.stdout.getvalue()');
      setOutput(stdout || '(No output)');
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      <div className="flex items-center justify-between p-2 bg-[#252526] border-b border-white/5">
        <div className="flex items-center gap-2 px-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-xs font-medium opacity-70">main.py</span>
        </div>
        <button 
          onClick={runCode}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded text-xs font-bold transition-colors"
        >
          <Play size={14} /> {isLoading ? 'Loading Pyodide...' : 'Run'}
        </button>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto p-4 font-mono text-sm">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => highlight(code, languages.python, 'python')}
            padding={10}
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 14,
              backgroundColor: 'transparent',
              minHeight: '100%',
            }}
          />
        </div>
        <div className="h-1/3 bg-black/40 border-t border-white/10 p-4 font-mono text-xs overflow-auto no-scrollbar">
          <div className="text-white/30 uppercase mb-2 tracking-widest">Output</div>
          <pre className="whitespace-pre-wrap text-emerald-400">{output}</pre>
        </div>
      </div>
    </div>
  );
};

// --- Nexus IDE ---
const NexusIDE = () => {
  const { getPath } = useFileSystem();
  const [files, setFiles] = useState<{ name: string, content: string, language: string }[]>([
    { name: 'index.html', language: 'html', content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #0f172a; color: white; }
    h1 { color: #38bdf8; text-shadow: 0 0 20px rgba(56, 189, 248, 0.5); }
  </style>
</head>
<body>
  <h1>Hello from Nexus IDE Pro!</h1>
  <script>
    console.log("Nexus IDE Console Initialized");
  </script>
</body>
</html>` }
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'explorer' | 'extensions' | 'ai'>('explorer');
  const [aiMode, setAiMode] = useState<'chat' | 'agent' | 'vibe'>('chat');
  const [vibeMode, setVibeMode] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<{ type: string, message: string }[]>([]);
  const [showConsole, setShowConsole] = useState(false);

  const activeFile = files[activeFileIndex];

  const [extensions, setExtensions] = useState([
    { id: 'python', name: 'Python Support', description: 'Enable Python linting and execution.', installed: true, icon: Play },
    { id: 'js', name: 'JavaScript ES6+', description: 'Advanced JS snippets and formatting.', installed: true, icon: Code },
    { id: 'wasm', name: 'WebAssembly Toolchain', description: 'Compile and run WASM modules.', installed: false, icon: Box },
    { id: 'terminal', name: 'Integrated Terminal', description: 'Access system shell within IDE.', installed: false, icon: TerminalIcon2 },
  ]);

  const updatePreview = useCallback(() => {
    const htmlFile = files.find(f => f.name.endsWith('.html'));
    if (!htmlFile) return;

    // Inject console.log capture script
    const injectedScript = `
      <script>
        const oldLog = console.log;
        console.log = function(...args) {
          window.parent.postMessage({ type: 'nexus-console', method: 'log', args: args.map(String) }, '*');
          oldLog.apply(console, args);
        };
        window.onerror = function(msg, url, line) {
          window.parent.postMessage({ type: 'nexus-console', method: 'error', args: [msg + " (line " + line + ")"] }, '*');
        };
      </script>
    `;
    
    const content = htmlFile.content.replace('</head>', `${injectedScript}</head>`);
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  }, [files]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'nexus-console') {
        setConsoleLogs(prev => [...prev, { type: e.data.method, message: e.data.args.join(' ') }].slice(-50));
      }
    };
    window.addEventListener('message', handleMessage);
    updatePreview();
    return () => window.removeEventListener('message', handleMessage);
  }, [updatePreview]);

  const downloadCode = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
  };

  const addFile = () => {
    const name = prompt('Enter file name (e.g. style.css):');
    if (name) {
      setFiles(prev => [...prev, { name, content: '', language: name.split('.').pop() || 'text' }]);
      setActiveFileIndex(files.length);
    }
  };

  const closeFile = (index: number) => {
    if (files.length === 1) return;
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (activeFileIndex >= index) setActiveFileIndex(Math.max(0, activeFileIndex - 1));
  };

  const handleAiAction = async () => {
    if (!aiInput.trim()) return;
    
    const settings = JSON.parse(localStorage.getItem('nexus-settings') || '{}');
    const provider = settings.provider || 'google';
    const apiKey = settings.apiKey;

    if (!apiKey && provider !== 'google') {
      alert('Please set your API key in Settings!');
      return;
    }

    const newUserMsg = { role: 'user' as const, content: aiInput };
    setAiMessages(prev => [...prev, newUserMsg]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      let responseText = "";
      
      if (provider === 'google') {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const result = await ai.models.generateContent({
          model: settings.model || 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: `You are an expert web developer. Current code:\n${activeFile.content}\n\nUser request: ${aiInput}\n\nProvide the full updated code only, no explanation.` }] }]
        });
        responseText = result.text || "Error generating response";
        if (aiMode === 'vibe' || aiMode === 'agent') {
          const codeMatch = responseText.match(/```(?:html|javascript|css|python)?([\s\S]*?)```/);
          const newContent = codeMatch ? codeMatch[1].trim() : responseText.trim();
          setFiles(prev => prev.map((f, i) => i === activeFileIndex ? { ...f, content: newContent } : f));
        }
      } else {
        const endpoint = provider === 'openai' 
          ? 'https://api.openai.com/v1/chat/completions' 
          : 'https://api.anthropic.com/v1/messages';
        
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            ...(provider === 'anthropic' ? { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' } : {})
          },
          body: JSON.stringify(provider === 'openai' ? {
            model: settings.model || 'gpt-4',
            messages: [{ role: 'user', content: aiInput }]
          } : {
            model: settings.model || 'claude-3-opus-20240229',
            messages: [{ role: 'user', content: aiInput }],
            max_tokens: 1024
          })
        });
        const data = await res.json();
        responseText = provider === 'openai' ? data.choices[0].message.content : data.content[0].text;
      }

      setAiMessages(prev => [...prev, { role: 'ai', content: responseText }]);
    } catch (err: any) {
      setAiMessages(prev => [...prev, { role: 'ai', content: `Error: ${err.message}` }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-white">
      {/* Sidebar Navigation */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-4 border-r border-white/5">
        <button 
          onClick={() => setSidebarTab('explorer')}
          className={cn("p-2 rounded transition-colors", sidebarTab === 'explorer' ? "text-blue-400 bg-white/10" : "text-zinc-400 hover:bg-white/5")}
        >
          <Layout size={20} />
        </button>
        <button 
          onClick={() => setSidebarTab('extensions')}
          className={cn("p-2 rounded transition-colors", sidebarTab === 'extensions' ? "text-blue-400 bg-white/10" : "text-zinc-400 hover:bg-white/5")}
        >
          <Puzzle size={20} />
        </button>
        <button 
          onClick={() => setSidebarTab('ai')}
          className={cn("p-2 rounded transition-colors", sidebarTab === 'ai' ? "text-purple-400 bg-white/10" : "text-zinc-400 hover:bg-white/5")}
        >
          <Sparkles size={20} />
        </button>
        <div className="flex-1" />
        <button 
          onClick={downloadCode}
          className="p-2 hover:bg-white/10 rounded text-zinc-400"
          title="Download Active File"
        >
          <Download size={20} />
        </button>
        <button 
          onClick={() => {
            const provider = prompt('Enter Provider (openai/anthropic/google):', 'google');
            const key = prompt('Enter API Key (leave empty for google):', '');
            const model = prompt('Enter Model Name:', 'gemini-3-flash-preview');
            localStorage.setItem('nexus-settings', JSON.stringify({ provider, apiKey: key, model }));
          }}
          className="p-2 hover:bg-white/10 rounded text-zinc-400"
        >
          <SettingsIcon size={20} />
        </button>
      </div>

      {/* Sidebar Content */}
      <AnimatePresence mode="wait">
        {sidebarTab !== 'ai' && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[#252526] border-r border-white/10 overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                {sidebarTab === 'explorer' ? 'Explorer' : 'Extensions'}
              </h3>
              {sidebarTab === 'explorer' && (
                <button onClick={addFile} className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white">
                  <Plus size={14} />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-auto p-2">
              {sidebarTab === 'explorer' ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer text-xs">
                    <ChevronRight size={14} />
                    <Folder size={14} className="text-blue-400" />
                    <span>home</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded cursor-pointer text-xs pl-4">
                    <ChevronRight size={14} />
                    <Folder size={14} className="text-blue-400" />
                    <span>user</span>
                  </div>
                  {files.map((file, i) => (
                    <div 
                      key={file.name}
                      onClick={() => setActiveFileIndex(i)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded cursor-pointer text-xs pl-10 group",
                        activeFileIndex === i ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5"
                      )}
                    >
                      <Code size={14} className={cn(file.name.endsWith('.html') ? "text-orange-400" : "text-blue-400")} />
                      <span className="flex-1 truncate">{file.name}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); closeFile(i); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded"
                      >
                        <CloseIcon size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {extensions.map(ext => (
                    <div key={ext.id} className="p-3 glass rounded-xl border border-white/5 hover:border-white/20 transition-all group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <ext.icon size={16} className="text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold truncate">{ext.name}</div>
                          <div className="text-[9px] opacity-50 truncate">{ext.description}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setExtensions(prev => prev.map(e => e.id === ext.id ? { ...e, installed: !e.installed } : e))}
                        className={cn(
                          "w-full py-1 rounded text-[10px] font-bold transition-all",
                          ext.installed ? "bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-red-400" : "bg-blue-600 text-white hover:bg-blue-500"
                        )}
                      >
                        {ext.installed ? 'Uninstall' : 'Install'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor & Preview */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <div className="flex bg-[#252526] overflow-x-auto no-scrollbar border-b border-white/5">
          {files.map((file, i) => (
            <button
              key={file.name}
              onClick={() => setActiveFileIndex(i)}
              className={cn(
                "px-4 py-2 text-xs flex items-center gap-2 border-r border-white/5 min-w-[120px] transition-colors",
                activeFileIndex === i ? "bg-[#1e1e1e] border-t-2 border-t-blue-500" : "opacity-50 hover:bg-white/5"
              )}
            >
              <Code size={12} />
              <span className="truncate">{file.name}</span>
              <CloseIcon 
                size={12} 
                className="ml-auto hover:text-red-400" 
                onClick={(e) => { e.stopPropagation(); closeFile(i); }}
              />
            </button>
          ))}
        </div>

        <div className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col border-r border-white/10">
            <div className="p-2 bg-[#252526] text-[10px] uppercase tracking-widest opacity-50 flex justify-between items-center">
              Editor - {activeFile.name}
              <div className="flex gap-2">
                <button onClick={() => setShowConsole(!showConsole)} className={cn("hover:text-white", showConsole && "text-blue-400")}>
                  <ConsoleIcon size={12} />
                </button>
                <button onClick={updatePreview} className="hover:text-white"><RefreshCw size={12} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-sm">
              <Editor
                value={activeFile.content}
                onValueChange={(content) => setFiles(prev => prev.map((f, i) => i === activeFileIndex ? { ...f, content } : f))}
                highlight={content => highlight(content, languages[activeFile.language as keyof typeof languages] || languages.javascript, activeFile.language)}
                padding={10}
                style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13 }}
              />
            </div>
            
            {/* Console */}
            {showConsole && (
              <div className="h-1/3 bg-black/40 border-t border-white/10 flex flex-col">
                <div className="p-2 bg-black/20 text-[10px] uppercase tracking-widest opacity-50 flex justify-between items-center">
                  Console
                  <button onClick={() => setConsoleLogs([])} className="hover:text-white">Clear</button>
                </div>
                <div className="flex-1 overflow-auto p-2 font-mono text-[11px] space-y-1 no-scrollbar">
                  {consoleLogs.map((log, i) => (
                    <div key={i} className={cn("flex gap-2", log.type === 'error' ? "text-red-400" : "text-white/70")}>
                      <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                  {consoleLogs.length === 0 && <div className="text-white/20 italic">No logs yet...</div>}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <div className="p-2 bg-[#252526] text-[10px] uppercase tracking-widest opacity-50">Preview</div>
            <iframe src={previewUrl} className="flex-1 bg-white border-none" title="Nexus Preview" />
          </div>
        </div>
      </div>

      {/* AI Sidebar */}
      <AnimatePresence>
        {sidebarTab === 'ai' && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[#252526] border-l border-white/10 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className={cn("text-purple-400 transition-all", vibeMode && "animate-pulse scale-125")} size={18} />
                <span className="font-bold text-sm">Nexus AI</span>
                <button 
                  onClick={() => setVibeMode(!vibeMode)}
                  className={cn(
                    "ml-auto p-1 rounded transition-all",
                    vibeMode ? "bg-purple-500 text-white" : "bg-white/5 text-white/30 hover:text-white/50"
                  )}
                  title="Toggle Vibe Mode"
                >
                  <Wand2 size={12} />
                </button>
              </div>
              <div className="flex p-1 bg-black/20 rounded-lg gap-1">
                {(['chat', 'agent', 'vibe'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setAiMode(mode)}
                    className={`flex-1 py-1 text-[10px] uppercase font-bold rounded transition-all ${aiMode === mode ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4 space-y-4 no-scrollbar">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] p-3 rounded-xl text-xs ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/80'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAiLoading && <div className="text-[10px] text-white/30 animate-pulse">AI is thinking...</div>}
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAiAction())}
                  placeholder={`Ask AI to ${aiMode === 'vibe' ? 'vibe-code...' : 'help...'}`}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pr-10 text-xs outline-none focus:border-purple-500/50 resize-none h-20"
                />
                <button 
                  onClick={handleAiAction}
                  className="absolute bottom-3 right-3 p-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Terminal App ---
const TerminalApp = () => {
  const { getPath, writeFile, mkdir } = useFileSystem();
  const [history, setHistory] = useState<string[]>(['Welcome to browserOS v1.1.1 (Developer Update)', 'Type "help" for commands.']);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/home/user');
  const scrollRef = useRef<HTMLDivElement>(null);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    let response = '';
    const parts = cmd.split(' ');
    const baseCmd = parts[0].toLowerCase();

    switch (baseCmd) {
      case 'help':
        response = 'Available commands: help, ls, clear, date, whoami, echo, python, neofetch, reboot, pwd, cd, mkdir, touch, cat';
        break;
      case 'date':
        response = new Date().toString();
        break;
      case 'whoami':
        response = 'user';
        break;
      case 'echo':
        response = parts.slice(1).join(' ');
        break;
      case 'pwd':
        response = currentDir;
        break;
      case 'ls':
        const dir = getPath(currentDir);
        if (dir && dir.type === 'directory' && dir.children) {
          response = dir.children.map(c => c.name).join('  ');
        } else {
          response = 'Error: Cannot read directory';
        }
        break;
      case 'cd':
        const target = parts[1] || '/home/user';
        const newPath = target.startsWith('/') ? target : `${currentDir}/${target}`.replace(/\/+/g, '/');
        const node = getPath(newPath);
        if (node && node.type === 'directory') {
          setCurrentDir(newPath);
          response = '';
        } else {
          response = `cd: no such directory: ${target}`;
        }
        break;
      case 'mkdir':
        if (!parts[1]) response = 'mkdir: missing operand';
        else {
          mkdir(`${currentDir}/${parts[1]}`);
          response = '';
        }
        break;
      case 'touch':
        if (!parts[1]) response = 'touch: missing operand';
        else {
          writeFile(`${currentDir}/${parts[1]}`, '');
          response = '';
        }
        break;
      case 'cat':
        if (!parts[1]) response = 'cat: missing operand';
        else {
          const file = getPath(`${currentDir}/${parts[1]}`);
          if (file && file.type === 'file') response = file.content || '';
          else response = `cat: ${parts[1]}: No such file`;
        }
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'python':
        if (!pyodideRef.current) {
          setHistory(prev => [...prev, `user@browseros:${currentDir}$ ${input}`, 'Loading Python runtime...']);
          if (!(window as any).loadPyodide) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
            await new Promise(r => { script.onload = r; document.head.appendChild(script); });
          }
          pyodideRef.current = await (window as any).loadPyodide();
        }
        const pyCode = parts.slice(1).join(' ');
        if (!pyCode) {
          response = 'Python 3.11.0 (Pyodide)\nType "python <command>" to execute.';
        } else {
          try {
            pyodideRef.current.runPython(`import sys, io; sys.stdout = io.StringIO()`);
            await pyodideRef.current.runPythonAsync(pyCode);
            response = pyodideRef.current.runPython('sys.stdout.getvalue()') || 'Success (no output)';
          } catch (err: any) {
            response = `Python Error: ${err.message}`;
          }
        }
        break;
      case 'neofetch':
        response = `
   .---.      OS: browserOS v1.1.1
  /     \\     Kernel: WebKit/Blink Hybrid
  | (O) |     Uptime: 12 minutes
  \\     /     Packages: 52 (npm)
   '---'      Shell: browser-sh
        `;
        break;
      default:
        response = `command not found: ${baseCmd}`;
    }

    setHistory(prev => [...prev, `user@browseros:${currentDir}$ ${input}`, response].filter(Boolean));
    setInput('');
  };

  return (
    <div className="p-4 font-mono text-sm text-emerald-400 h-full bg-black/90 overflow-auto no-scrollbar" ref={scrollRef}>
      {history.map((line, i) => <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>)}
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-blue-400">user@browseros</span><span className="text-white">:</span><span className="text-purple-400">{currentDir}</span><span className="text-white">$</span>
        <input autoFocus className="flex-1 bg-transparent outline-none text-white border-none p-0" value={input} onChange={(e) => setInput(e.target.value)} />
      </form>
    </div>
  );
};

// --- File Explorer App ---
const FileExplorerApp = () => {
  const { getPath } = useFileSystem();
  const [currentPath, setCurrentPath] = useState('/home/user');
  
  const node = getPath(currentPath);
  const files = node?.children || [];

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <div className="flex items-center gap-2 p-2 bg-zinc-800 border-b border-white/5">
        <div className="flex items-center gap-1 text-xs text-white/50">
          {currentPath.split('/').filter(Boolean).map((p, i, arr) => (
            <React.Fragment key={i}>
              <span 
                className="hover:text-white cursor-pointer"
                onClick={() => setCurrentPath('/' + arr.slice(0, i + 1).join('/'))}
              >
                {p}
              </span>
              {i < arr.length - 1 && <ChevronRight size={12} />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-4 overflow-auto">
        {files.map((item, i) => (
          <div 
            key={i} 
            className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 cursor-pointer group"
            onDoubleClick={() => {
              if (item.type === 'directory') {
                setCurrentPath(`${currentPath}/${item.name}`.replace(/\/+/g, '/'));
              }
            }}
          >
            {item.type === 'directory' ? (
              <Folder className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
            ) : (
              <FileText className="w-10 h-10 text-zinc-400 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[10px] text-white/80 text-center truncate w-full">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- System Monitor App ---
const SystemMonitorApp = () => {
  const [data, setData] = useState<{ time: string; cpu: number; ram: number }[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => [...prev, { time: new Date().toLocaleTimeString(), cpu: Math.floor(Math.random() * 40) + 10, ram: Math.floor(Math.random() * 20) + 60 }].slice(-20));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="p-6 h-full bg-zinc-950 text-white overflow-auto no-scrollbar">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass p-4 rounded-xl">
          <div className="text-xs text-white/50 mb-1 uppercase">CPU</div>
          <div className="text-2xl font-bold font-display">{data[data.length - 1]?.cpu || 0}%</div>
          <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden"><div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${data[data.length - 1]?.cpu || 0}%` }} /></div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-xs text-white/50 mb-1 uppercase">RAM</div>
          <div className="text-2xl font-bold font-display">{data[data.length - 1]?.ram || 0}%</div>
          <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden"><div className="bg-blue-400 h-full transition-all duration-500" style={{ width: `${data[data.length - 1]?.ram || 0}%` }} /></div>
        </div>
      </div>
      <div className="h-48 w-full glass rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area type="monotone" dataKey="cpu" stroke="#10b981" fill="#10b98130" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Settings App ---
const SettingsApp = () => {
  const wallpapers = [
    { id: '10', name: 'Mountain Lake', url: 'https://picsum.photos/id/10/1920/1080' },
    { id: '28', name: 'Forest', url: 'https://picsum.photos/id/28/1920/1080' },
    { id: '43', name: 'Architecture', url: 'https://picsum.photos/id/43/1920/1080' },
    { id: '103', name: 'Abstract', url: 'https://picsum.photos/id/103/1920/1080' },
  ];
  const setWallpaper = (url: string) => { localStorage.setItem('browseros-wallpaper', url); window.dispatchEvent(new Event('wallpaper-change')); };
  return (
    <div className="p-6 h-full bg-zinc-100 text-zinc-900 overflow-auto">
      <h2 className="text-xl font-display font-bold mb-6">Settings</h2>
      <section className="mb-8">
        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2"><ImageIcon size={14} /> Appearance</h3>
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map(wp => (
            <button key={wp.id} onClick={() => setWallpaper(wp.url)} className="group relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all">
              <img src={`${wp.url}?blur=2`} alt={wp.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-[10px]">{wp.name}</span></div>
            </button>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2"><Cpu size={14} /> About</h3>
        <div className="bg-white rounded-xl p-4 border border-zinc-200 text-sm">
          <div className="flex justify-between py-2 border-b border-zinc-100"><span>Version</span><span className="font-bold">1.0.5-stable</span></div>
          <div className="flex justify-between py-2"><span>Build</span><span className="font-bold">2026.02.21</span></div>
        </div>
      </section>
    </div>
  );
};

// --- Notes App ---
const NotesApp = () => {
  const [note, setNote] = useState(() => localStorage.getItem('browseros-note') || '');
  return (
    <div className="flex flex-col h-full bg-zinc-50 text-zinc-900">
      <div className="flex items-center justify-between p-2 bg-zinc-200 border-b border-zinc-300">
        <span className="text-[10px] font-bold px-2 uppercase opacity-50">Notes</span>
        <button onClick={() => localStorage.setItem('browseros-note', note)} className="p-1.5 hover:bg-zinc-300 rounded"><Save size={14} /></button>
      </div>
      <textarea className="flex-1 p-4 outline-none resize-none bg-transparent text-sm" value={note} onChange={(e) => setNote(e.target.value)} />
    </div>
  );
};

export const APPS = [
  { id: 'nexus', name: 'Nexus IDE', icon: Code, component: NexusIDE, defaultWidth: 1100, defaultHeight: 750 },
  { id: 'api-tester', name: 'API Tester', icon: Globe2, component: APITesterApp, defaultWidth: 600, defaultHeight: 500 },
  { id: 'json-tool', name: 'JSON Tool', icon: Braces, component: JSONToolApp, defaultWidth: 600, defaultHeight: 500 },
  { id: 'youtube', name: 'YouTube', icon: Youtube, component: YouTubeApp, defaultWidth: 900, defaultHeight: 600 },
  { id: 'python', name: 'Python Playground', icon: Play, component: PythonPlayground, defaultWidth: 800, defaultHeight: 600 },
  { id: 'terminal', name: 'Terminal', icon: TerminalIcon, component: TerminalApp, defaultWidth: 600, defaultHeight: 400 },
  { id: 'explorer', name: 'Files', icon: Folder, component: FileExplorerApp, defaultWidth: 700, defaultHeight: 500 },
  { id: 'vscode', name: 'VS Code', icon: Code, component: () => <iframe src="https://vscode.dev/?theme=dark" className="w-full h-full border-none bg-[#1e1e1e]" title="VS Code" allow="clipboard-read; clipboard-write; fullscreen" /> , defaultWidth: 1000, defaultHeight: 700 },
  { id: 'doom', name: 'Doom', icon: Gamepad2, component: () => <iframe src="https://js-dos.com/games/doom.exe.html" className="w-full h-full border-none bg-black" title="Doom" allow="autoplay; gamepad; fullscreen" />, defaultWidth: 800, defaultHeight: 600 },
  { id: 'whiteboard', name: 'Whiteboard', icon: PenTool, component: WhiteboardApp, defaultWidth: 800, defaultHeight: 600 },
  { id: 'calculator', name: 'Calculator', icon: CalcIcon, component: CalculatorApp, defaultWidth: 320, defaultHeight: 450 },
  { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: Hash, component: TicTacToeApp, defaultWidth: 400, defaultHeight: 500 },
  { id: 'weather', name: 'Weather', icon: CloudSun, component: WeatherApp, defaultWidth: 400, defaultHeight: 500 },
  { id: 'browser', name: 'Browser', icon: Globe, component: () => <iframe src="https://www.wikipedia.org" className="w-full h-full border-none bg-white" title="Browser" />, defaultWidth: 900, defaultHeight: 600 },
  { id: 'system', name: 'System', icon: Cpu, component: SystemMonitorApp, defaultWidth: 600, defaultHeight: 450 },
  { id: 'notes', name: 'Notes', icon: FileText, component: NotesApp, defaultWidth: 400, defaultHeight: 500 },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, component: SettingsApp, defaultWidth: 600, defaultHeight: 500 },
];
