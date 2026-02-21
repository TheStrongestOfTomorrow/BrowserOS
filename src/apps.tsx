import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Folder, Code, Gamepad2, Globe, Settings as SettingsIcon, Cpu, FileText, ChevronRight, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// --- Notes App ---
const NotesApp = () => {
  const [note, setNote] = useState(() => localStorage.getItem('browseros-note') || '');
  
  const saveNote = () => {
    localStorage.setItem('browseros-note', note);
    alert('Note saved!');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 text-zinc-900">
      <div className="flex items-center justify-between p-2 bg-zinc-200 border-b border-zinc-300">
        <span className="text-xs font-bold px-2">Untitled Note</span>
        <div className="flex gap-2">
          <button onClick={saveNote} className="p-1.5 hover:bg-zinc-300 rounded transition-colors">
            <Save size={14} />
          </button>
          <button onClick={() => setNote('')} className="p-1.5 hover:bg-red-200 text-red-600 rounded transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <textarea 
        className="flex-1 p-4 outline-none resize-none bg-transparent font-sans text-sm leading-relaxed"
        placeholder="Start typing..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
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

  const setWallpaper = (url: string) => {
    localStorage.setItem('browseros-wallpaper', url);
    window.dispatchEvent(new Event('wallpaper-change'));
  };

  return (
    <div className="p-6 h-full bg-zinc-100 text-zinc-900 overflow-auto">
      <h2 className="text-xl font-display font-bold mb-6">Settings</h2>
      
      <section className="mb-8">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ImageIcon size={16} /> Appearance
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map(wp => (
            <button 
              key={wp.id}
              onClick={() => setWallpaper(wp.url)}
              className="group relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all"
            >
              <img src={`${wp.url}?blur=2`} alt={wp.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-medium">{wp.name}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Cpu size={16} /> About browserOS
        </h3>
        <div className="bg-white rounded-xl p-4 border border-zinc-200">
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <span className="text-zinc-500">Version</span>
            <span className="font-medium">1.0.0-stable</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <span className="text-zinc-500">Build</span>
            <span className="font-medium">2026.02.21</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-zinc-500">Host</span>
            <span className="font-medium">Web Browser</span>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Terminal App ---
const TerminalApp = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to browserOS v1.0.0', 'Type "help" for commands.']);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let response = '';
    switch (cmd) {
      case 'help':
        response = 'Available commands: help, ls, clear, date, whoami, echo [text], neofetch, reboot';
        break;
      case 'ls':
        response = 'Documents  Pictures  Downloads  readme.md  todo.txt';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'date':
        response = new Date().toString();
        break;
      case 'whoami':
        response = 'user_browser_os';
        break;
      case 'reboot':
        window.location.reload();
        return;
      case 'neofetch':
        response = `
   .---.      OS: browserOS v1.0.0
  /     \\     Kernel: WebKit/Blink Hybrid
  | (O) |     Uptime: 2 minutes
  \\     /     Packages: 42 (npm)
   '---'      Shell: browser-sh
        `;
        break;
      default:
        if (cmd.startsWith('echo ')) {
          response = cmd.slice(5);
        } else {
          response = `command not found: ${cmd}`;
        }
    }

    setHistory(prev => [...prev, `user@browseros:~$ ${input}`, response]);
    setInput('');
  };

  return (
    <div 
      className="p-4 font-mono text-sm text-emerald-400 h-full bg-black/90 overflow-auto no-scrollbar"
      ref={scrollRef}
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
      ))}
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-blue-400">user@browseros</span>
        <span className="text-white">:</span>
        <span className="text-purple-400">~</span>
        <span className="text-white">$</span>
        <input
          id="term-input"
          autoFocus
          className="flex-1 bg-transparent outline-none text-white border-none p-0 m-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
};

// --- File Explorer App ---
const FileExplorerApp = () => {
  const [currentPath, setCurrentPath] = useState(['Home', 'User']);
  const files = [
    { name: 'Documents', type: 'dir', icon: Folder },
    { name: 'Pictures', type: 'dir', icon: Folder },
    { name: 'Downloads', type: 'dir', icon: Folder },
    { name: 'readme.md', type: 'file', icon: FileText },
    { name: 'todo.txt', type: 'file', icon: FileText },
    { name: 'doom.wasm', type: 'file', icon: Gamepad2 },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <div className="flex items-center gap-2 p-2 bg-zinc-800 border-b border-white/5">
        <div className="flex items-center gap-1 text-xs text-white/50">
          {currentPath.map((p, i) => (
            <React.Fragment key={i}>
              <span className="hover:text-white cursor-pointer">{p}</span>
              {i < currentPath.length - 1 && <ChevronRight size={12} />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-4 overflow-auto">
        {files.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group">
            <item.icon className={`w-10 h-10 ${item.type === 'dir' ? 'text-blue-400' : 'text-zinc-400'} group-hover:scale-110 transition-transform`} />
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
      setData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          cpu: Math.floor(Math.random() * 40) + 10,
          ram: Math.floor(Math.random() * 20) + 60,
        }].slice(-20);
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 h-full bg-zinc-950 text-white overflow-auto no-scrollbar">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass p-4 rounded-xl">
          <div className="text-xs text-white/50 uppercase mb-1">CPU Usage</div>
          <div className="text-2xl font-bold font-display">{data[data.length - 1]?.cpu || 0}%</div>
          <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${data[data.length - 1]?.cpu || 0}%` }} />
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-xs text-white/50 uppercase mb-1">RAM Usage</div>
          <div className="text-2xl font-bold font-display">{data[data.length - 1]?.ram || 0}%</div>
          <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-blue-400 h-full transition-all duration-500" style={{ width: `${data[data.length - 1]?.ram || 0}%` }} />
          </div>
        </div>
      </div>

      <div className="h-48 w-full glass rounded-xl p-4">
        <div className="text-xs text-white/50 uppercase mb-4">Performance History</div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="cpu" stroke="#10b981" fillOpacity={1} fill="url(#colorCpu)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const VSCodeApp = () => (
  <iframe 
    src="https://vscode.dev" 
    className="w-full h-full border-none"
    title="VS Code"
  />
);

const DoomApp = () => (
  <iframe 
    src="https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1" 
    className="w-full h-full border-none"
    title="Doom"
  />
);

const BrowserApp = () => (
  <div className="flex flex-col h-full bg-white">
    <div className="flex items-center gap-2 p-2 bg-zinc-100 border-b border-zinc-300">
      <div className="flex gap-1.5 px-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <div className="flex-1 bg-white border border-zinc-300 rounded px-3 py-1 text-xs text-zinc-600">
        https://www.wikipedia.org
      </div>
    </div>
    <iframe 
      src="https://www.wikipedia.org" 
      className="flex-1 w-full border-none"
      title="Browser"
    />
  </div>
);

export const APPS = [
  { id: 'terminal', name: 'Terminal', icon: TerminalIcon, component: TerminalApp, defaultWidth: 600, defaultHeight: 400 },
  { id: 'explorer', name: 'Files', icon: Folder, component: FileExplorerApp, defaultWidth: 700, defaultHeight: 500 },
  { id: 'vscode', name: 'VS Code', icon: Code, component: VSCodeApp, defaultWidth: 1000, defaultHeight: 700 },
  { id: 'doom', name: 'Doom', icon: Gamepad2, component: DoomApp, defaultWidth: 800, defaultHeight: 600 },
  { id: 'browser', name: 'Browser', icon: Globe, component: BrowserApp, defaultWidth: 900, defaultHeight: 600 },
  { id: 'system', name: 'System', icon: Cpu, component: SystemMonitorApp, defaultWidth: 600, defaultHeight: 450 },
  { id: 'notes', name: 'Notes', icon: FileText, component: NotesApp, defaultWidth: 400, defaultHeight: 500 },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, component: SettingsApp, defaultWidth: 600, defaultHeight: 500 },
];
