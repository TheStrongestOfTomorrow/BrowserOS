"use client";

import { useState, useEffect, useCallback } from "react";
import { useOSStore } from "@/store";
import { Download, Trash2, Star, ExternalLink, RefreshCw, Search, Grid, List } from "lucide-react";
import type { GalleryApp } from "@/types";

// Default curated apps that are always available
const DEFAULT_APPS: GalleryApp[] = [
  {
    id: "todo-app",
    name: "Todo List",
    description: "A simple and elegant todo list application with drag-and-drop reordering, categories, and due dates.",
    author: "BrowserOS",
    version: "1.2.0",
    icon: "✅",
    category: "Productivity",
    url: "",
    screenshots: [],
    rating: 4.5,
    downloads: 2340,
    html: `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;background:#1a1a2e;color:#e0e0e0;padding:20px}.container{max-width:500px;margin:0 auto}h1{text-align:center;margin-bottom:20px;color:#fff}input{width:100%;padding:12px;border:1px solid #333;border-radius:8px;background:#16213e;color:#fff;font-size:14px;margin-bottom:12px}button{padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-size:13px}.add-btn{background:#3b82f6;color:#fff;width:100%;margin-bottom:16px}.todo{display:flex;align-items:center;gap:10px;padding:10px;background:#16213e;border-radius:8px;margin-bottom:8px}.todo.done span{text-decoration:line-through;opacity:0.5}.del-btn{background:#ef4444;color:#fff;margin-left:auto}</style></head><body><div class="container"><h1>✅ Todo List</h1><input id="inp" placeholder="What needs to be done?"/><button class="add-btn" onclick="addTodo()">Add Task</button><div id="list"></div></div><script>let todos=[];function render(){document.getElementById('list').innerHTML=todos.map((t,i)=>'<div class=\"todo'+(t.done?' done':'')+'\"><input type=\"checkbox\" '+(t.done?'checked':'')+' onchange=\"toggle('+i+')\"/><span>'+t.text+'</span><button class=\"del-btn\" onclick=\"del('+i+')\">✕</button></div>').join('')}function addTodo(){const v=document.getElementById('inp').value.trim();if(v){todos.push({text:v,done:false});document.getElementById('inp').value='';render()}}function toggle(i){todos[i].done=!todos[i].done;render()}function del(i){todos.splice(i,1);render()}document.getElementById('inp').addEventListener('keydown',e=>{if(e.key==='Enter')addTodo()});render()</script></body></html>`,
  },
  {
    id: "weather-app",
    name: "Weather Widget",
    description: "A beautiful weather widget with animated icons, 5-day forecast, and location-based data.",
    author: "BrowserOS",
    version: "1.0.0",
    icon: "🌤️",
    category: "Utility",
    url: "",
    screenshots: [],
    rating: 4.2,
    downloads: 1890,
    html: `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center}.card{background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:20px;padding:30px;width:350px;text-align:center}.temp{font-size:64px;font-weight:200;margin:10px 0}.city{font-size:24px;font-weight:500}.desc{color:rgba(255,255,255,0.7);margin-bottom:20px}.forecast{display:flex;justify-content:space-around;margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1)}.day{text-align:center}.day .icon{font-size:24px}.day .high{font-size:14px;margin-top:4px}.day .name{font-size:11px;color:rgba(255,255,255,0.5)}</style></head><body><div class="card"><div class="city">San Francisco</div><div class="desc">Partly Cloudy</div><div class="temp">18°</div><div class="forecast"><div class="day"><div class="icon">🌤️</div><div class="high">20°</div><div class="name">Mon</div></div><div class="day"><div class="icon">☁️</div><div class="high">17°</div><div class="name">Tue</div></div><div class="day"><div class="icon">🌧️</div><div class="high">14°</div><div class="name">Wed</div></div><div class="day"><div class="icon">⛅</div><div class="high">16°</div><div class="name">Thu</div></div><div class="day"><div class="icon">☀️</div><div class="high">22°</div><div class="name">Fri</div></div></div></div></body></html>`,
  },
  {
    id: "pomodoro-app",
    name: "Pomodoro Timer",
    description: "Focus timer with customizable work/break intervals, session tracking, and notification support.",
    author: "BrowserOS",
    version: "1.1.0",
    icon: "🍅",
    category: "Productivity",
    url: "",
    screenshots: [],
    rating: 4.7,
    downloads: 3100,
    html: `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;background:#1a1a2e;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh}.container{text-align:center;width:350px}.timer{font-size:72px;font-weight:200;margin:20px 0;font-variant-numeric:tabular-nums}.label{font-size:18px;color:#3b82f6;margin-bottom:10px}.controls{display:flex;gap:10px;justify-content:center;margin-top:20px}button{padding:12px 24px;border:none;border-radius:12px;font-size:14px;cursor:pointer;font-weight:500}.start{background:#3b82f6;color:#fff}.reset{background:#334155;color:#fff}.mode-btns{display:flex;gap:8px;justify-content:center;margin-top:16px}.mode-btn{padding:6px 14px;border:1px solid #3b82f6;background:transparent;color:#3b82f6;border-radius:8px;cursor:pointer;font-size:12px}.mode-btn.active{background:#3b82f6;color:#fff}.sessions{margin-top:16px;color:#666;font-size:13px}</style></head><body><div class="container"><div class="label" id="lbl">Focus Time</div><div class="timer" id="tmr">25:00</div><div class="controls"><button class="start" id="tog" onclick="toggle()">Start</button><button class="reset" onclick="reset()">Reset</button></div><div class="mode-btns"><button class="mode-btn active" onclick="setMode(25,'Focus Time')">Focus</button><button class="mode-btn" onclick="setMode(5,'Short Break')">Short Break</button><button class="mode-btn" onclick="setMode(15,'Long Break')">Long Break</button></div><div class="sessions" id="ses">Sessions: 0</div></div><script>let time=25*60,running=false,interval,sessions=0;function update(){const m=Math.floor(time/60),s=time%60;document.getElementById('tmr').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}function toggle(){if(running){clearInterval(interval);running=false;document.getElementById('tog').textContent='Resume'}else{running=true;document.getElementById('tog').textContent='Pause';interval=setInterval(()=>{if(time<=0){clearInterval(interval);running=false;sessions++;document.getElementById('ses').textContent='Sessions: '+sessions;document.getElementById('tog').textContent='Start';return}time--;update()},1000)}}function reset(){clearInterval(interval);running=false;time=25*60;update();document.getElementById('tog').textContent='Start'}function setMode(m,l){clearInterval(interval);running=false;time=m*60;document.getElementById('lbl').textContent=l;update();document.getElementById('tog').textContent='Start';document.querySelectorAll('.mode-btn').forEach((b,i)=>{b.classList.toggle('active',b.textContent.includes(l.split(' ')[0]))})}update()</script></body></html>`,
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Live-preview markdown editor with syntax highlighting, export options, and split-pane view.",
    author: "BrowserOS",
    version: "1.3.0",
    icon: "📝",
    category: "Productivity",
    url: "",
    screenshots: [],
    rating: 4.8,
    downloads: 4200,
    html: `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;background:#1e1e1e;color:#ddd;display:flex;height:100vh}.editor,.preview{flex:1;padding:20px;overflow:auto}.editor{border-right:1px solid #333}textarea{width:100%;height:100%;background:transparent;border:none;color:#ddd;font-family:monospace;font-size:14px;resize:none;outline:none;line-height:1.6}.preview h1{color:#fff;border-bottom:1px solid #333;padding-bottom:8px}.preview h2{color:#eee;margin-top:16px}.preview h3{color:#ddd}.preview p{margin:8px 0;line-height:1.6}.preview code{background:#333;padding:2px 6px;border-radius:3px;font-size:13px}.preview pre{background:#2d2d2d;padding:12px;border-radius:8px;overflow-x:auto;margin:8px 0}.preview pre code{background:none;padding:0}.preview ul,.preview ol{margin:8px 0;padding-left:24px}.preview blockquote{border-left:3px solid #3b82f6;padding-left:12px;color:#888;margin:8px 0}.preview a{color:#3b82f6}.preview hr{border:none;border-top:1px solid #333;margin:16px 0}.preview strong{color:#fff}.preview em{color:#bbb}</style></head><body><div class="editor"><textarea id="md" oninput="render()">## Welcome to Markdown Editor\\n\\nStart typing **markdown** on the left and see the *preview* on the right!\\n\\n### Features\\n- Live preview\\n- Syntax highlighting\\n- Easy to use\\n\\n> This is a blockquote\\n\\nCode example:\\n\`\`\`javascript\\nconst greeting = "Hello!";\\nconsole.log(greeting);\\n\`\`\`</textarea></div><div class="preview" id="out"></div><script>function render(){const md=document.getElementById('md').value;let html=md.replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>').replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>').replace(/\\*(.+?)\\*/g,'<em>$1</em>').replace(/^\`{3}(\\w*)$/gm,'<pre><code>').replace(/^\`{3}$/gm,'</code></pre>').replace(/\`(.+?)\`/g,'<code>$1</code>').replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>').replace(/^- (.+)$/gm,'<li>$1</li>').replace(/^---$/gm,'<hr>').replace(/\\n/g,'<br>');document.getElementById('out').innerHTML=html}render()</script></body></html>`,
  },
  {
    id: "drawing-app",
    name: "Drawing Canvas",
    description: "A simple drawing canvas with multiple brush sizes, colors, and an eraser tool. Save your artwork as PNG.",
    author: "BrowserOS",
    version: "1.0.0",
    icon: "🎨",
    category: "Media",
    url: "",
    screenshots: [],
    rating: 4.1,
    downloads: 1560,
    html: `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;background:#1a1a2e;color:#fff;display:flex;flex-direction:column;height:100vh}.toolbar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#16213e;border-bottom:1px solid #333}canvas{flex:1;cursor:crosshair}button{padding:6px 12px;border:none;border-radius:6px;cursor:pointer;font-size:12px;background:#334155;color:#fff}.color{width:28px;height:28px;border-radius:50%;border:2px solid transparent;cursor:pointer}.color.active{border-color:#fff}input[type=range]{width:80px}.size-label{font-size:11px;color:#888;min-width:30px}</style></head><body><div class="toolbar"><button onclick="clearCanvas()">Clear</button><button onclick="saveCanvas()">Save PNG</button><span style="width:1px;height:20px;background:#333;margin:0 4px"></span><div class="color active" style="background:#fff" onclick="setColor('#fff',this)"></div><div class="color" style="background:#3b82f6" onclick="setColor('#3b82f6',this)"></div><div class="color" style="background:#ef4444" onclick="setColor('#ef4444',this)"></div><div class="color" style="background:#22c55e" onclick="setColor('#22c55e',this)"></div><div class="color" style="background:#eab308" onclick="setColor('#eab308',this)"></div><div class="color" style="background:#000" onclick="setColor('#000',this)"></div><span style="width:1px;height:20px;background:#333;margin:0 4px"></span><button onclick="setEraser()">Eraser</button><input type="range" min="1" max="30" value="3" oninput="setSize(this.value)"><span class="size-label" id="sz">3px</span></div><canvas id="c"></canvas><script>const c=document.getElementById('c'),ctx=c.getContext('2d');let drawing=false,color='#fff',size=3;function resize(){c.width=c.offsetWidth;c.height=c.offsetHeight;ctx.fillStyle='#1a1a2e';ctx.fillRect(0,0,c.width,c.height)}resize();window.onresize=resize;c.onmousedown=e=>{drawing=true;ctx.beginPath();ctx.moveTo(e.offsetX,e.offsetY)};c.onmousemove=e=>{if(!drawing)return;ctx.lineTo(e.offsetX,e.offsetY);ctx.strokeStyle=color;ctx.lineWidth=size;ctx.lineCap='round';ctx.stroke()};c.onmouseup=()=>drawing=false;c.onmouseleave=()=>drawing=false;function setColor(col,el){color=col;document.querySelectorAll('.color').forEach(c=>c.classList.remove('active'));el.classList.add('active')}function setEraser(){color='#1a1a2e';document.querySelectorAll('.color').forEach(c=>c.classList.remove('active'))}function setSize(v){size=v;document.getElementById('sz').textContent=v+'px'}function clearCanvas(){ctx.fillStyle='#1a1a2e';ctx.fillRect(0,0,c.width,c.height)}function saveCanvas(){const a=document.createElement('a');a.download='drawing.png';a.href=c.toDataURL();a.click()}</script></body></html>`,
  },
  {
    id: "music-player",
    name: "Music Player",
    description: "A stylish music player UI with playlist management, equalizer visualization, and playback controls.",
    author: "BrowserOS",
    version: "1.0.0",
    icon: "🎵",
    category: "Media",
    url: "",
    screenshots: [],
    rating: 3.9,
    downloads: 980,
    html: `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh}.player{width:320px;text-align:center}.art{width:200px;height:200px;border-radius:20px;background:linear-gradient(135deg,#667eea,#764ba2);margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:64px}.title{font-size:18px;font-weight:600}.artist{font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px}.progress{margin:20px 0;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;cursor:pointer}.progress-bar{height:100%;background:#3b82f6;border-radius:2px;width:35%;transition:width 0.3s}.time{display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.4)}.controls{display:flex;align-items:center;justify-content:center;gap:20px;margin-top:16px}.ctrl-btn{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;opacity:0.7}.ctrl-btn:hover{opacity:1}.play-btn{width:50px;height:50px;border-radius:50%;background:#3b82f6;border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center}.playlist{margin-top:24px;text-align:left}.track{display:flex;align-items:center;gap:10px;padding:8px;border-radius:8px;cursor:pointer;font-size:13px}.track:hover{background:rgba(255,255,255,0.05)}.track.active{color:#3b82f6}.track-num{color:rgba(255,255,255,0.3);width:20px}</style></head><body><div class="player"><div class="art">🎵</div><div class="title">Midnight Dreams</div><div class="artist">Digital Waves</div><div class="progress" onclick="seek(event)"><div class="progress-bar" id="bar"></div></div><div class="time"><span>1:23</span><span>3:45</span></div><div class="controls"><button class="ctrl-btn">⏮</button><button class="play-btn" id="play" onclick="togglePlay()">▶</button><button class="ctrl-btn">⏭</button></div><div class="playlist"><div class="track active"><span class="track-num">1</span>Midnight Dreams</div><div class="track"><span class="track-num">2</span>Electric Sunrise</div><div class="track"><span class="track-num">3</span>Neon Nights</div><div class="track"><span class="track-num">4</span>Crystal Waves</div></div></div><script>let playing=false;function togglePlay(){playing=!playing;document.getElementById('play').textContent=playing?'⏸':'▶'}function seek(e){const pct=e.offsetX/e.target.offsetWidth*100;document.getElementById('bar').style.width=pct+'%'}</script></body></html>`,
  },
];

export default function AppGallery() {
  const { galleryApps, setGalleryApps, installApp, uninstallApp, installedAppIds, openApp } = useOSStore();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Load apps on mount - combine default apps with any fetched from GitHub
  useEffect(() => {
    const allApps = [...DEFAULT_APPS];
    // Add any gallery apps from the store that aren't already in defaults
    for (const app of galleryApps) {
      if (!allApps.find((a) => a.id === app.id)) {
        allApps.push(app);
      }
    }
    setGalleryApps(allApps);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFromGitHub = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch apps from GitHub Issues - no approval needed, just show everything
      const response = await fetch(
        "https://api.github.com/repos/nicobailey/BrowserOS/issues?labels=app&state=open&per_page=50",
        {
          headers: { Accept: "application/vnd.github.v3+json" },
        }
      );

      if (response.ok) {
        const issues = await response.json();
        const githubApps: GalleryApp[] = issues.map((issue: { number: number; title: string; body: string; user: { login: string }; created_at: string }) => {
          // Parse app metadata from issue body
          const body = issue.body || "";
          const getMeta = (key: string) => {
            const match = body.match(new RegExp(`\\*\\*${key}:\\*\\*\\s*(.+)`));
            return match ? match[1].trim() : "";
          };

          return {
            id: `gh-issue-${issue.number}`,
            name: issue.title.replace(/\[App\]\s*/i, ""),
            description: getMeta("Description") || body.split("\n")[0] || "Community app",
            author: issue.user?.login || "Community",
            version: getMeta("Version") || "1.0.0",
            icon: getMeta("Icon") || "📱",
            category: getMeta("Category") || "Community",
            url: issue.number ? `https://github.com/nicobailey/BrowserOS/issues/${issue.number}` : "",
            screenshots: [],
            rating: 4.0,
            downloads: 0,
            sourceUrl: issue.number ? `https://github.com/nicobailey/BrowserOS/issues/${issue.number}` : undefined,
          };
        });

        // Merge with defaults - GitHub apps are added, not replacing
        const allApps = [...DEFAULT_APPS];
        for (const app of githubApps) {
          if (!allApps.find((a) => a.id === app.id)) {
            allApps.push(app);
          }
        }
        setGalleryApps(allApps);
      }
    } catch {
      // If GitHub fetch fails, we still have the default apps
    }
    setLoading(false);
  }, [setGalleryApps]);

  const categories = ["All", ...new Set(galleryApps.map((a) => a.category))];
  const filteredApps = galleryApps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = useCallback((app: GalleryApp) => {
    installApp(app);
  }, [installApp]);

  const handleOpen = useCallback((app: GalleryApp) => {
    // Open installed app
    openApp(app.id);
  }, [openApp]);

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      {/* Header */}
      <div className="px-4 py-3 bg-zinc-800/50 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-200">App Gallery</h2>
            <p className="text-xs text-zinc-500">Browse and install apps — no approval needed</p>
          </div>
          <button
            onClick={fetchFromGitHub}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Fetch from GitHub
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-zinc-700/50 rounded-lg px-3 py-1.5 gap-2">
            <Search size={14} className="text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps..."
              className="flex-1 bg-transparent text-xs text-zinc-200 outline-none"
            />
          </div>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded ${viewMode === "grid" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <Grid size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded ${viewMode === "list" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <List size={14} />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat ? "bg-blue-600 text-white" : "bg-zinc-700/50 text-zinc-400 hover:bg-zinc-600/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* App grid/list */}
      <div className="flex-1 overflow-auto p-4">
        {filteredApps.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm mt-12">
            <p className="text-3xl mb-2">🔍</p>
            <p>No apps found</p>
            <p className="text-xs mt-1">Try a different search or category</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredApps.map((app) => {
              const isInstalled = installedAppIds.includes(app.id);
              return (
                <div
                  key={app.id}
                  className="bg-zinc-800/50 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{app.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-zinc-200 truncate">{app.name}</div>
                      <div className="text-[10px] text-zinc-500">{app.category}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2">{app.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-500" />
                      <span className="text-[10px] text-zinc-500">{app.rating}</span>
                      <span className="text-[10px] text-zinc-600 ml-1">{app.downloads} downloads</span>
                    </div>
                    {isInstalled ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpen(app)}
                          className="px-2 py-1 text-[10px] bg-green-600/20 text-green-400 rounded hover:bg-green-600/30"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => uninstallApp(app.id)}
                          className="px-2 py-1 text-[10px] bg-red-600/20 text-red-400 rounded hover:bg-red-600/30"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleInstall(app)}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] bg-blue-600 text-white rounded hover:bg-blue-500"
                      >
                        <Download size={10} /> Install
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredApps.map((app) => {
              const isInstalled = installedAppIds.includes(app.id);
              return (
                <div
                  key={app.id}
                  className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="text-2xl">{app.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-200">{app.name}</div>
                    <div className="text-[11px] text-zinc-500 truncate">{app.description}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={10} className="text-yellow-500" />
                    <span className="text-[10px] text-zinc-500">{app.rating}</span>
                  </div>
                  {app.sourceUrl && (
                    <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300">
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {isInstalled ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleOpen(app)} className="px-2 py-1 text-[10px] bg-green-600/20 text-green-400 rounded">Open</button>
                      <button onClick={() => uninstallApp(app.id)} className="px-1 py-1 text-red-400"><Trash2 size={12} /></button>
                    </div>
                  ) : (
                    <button onClick={() => handleInstall(app)} className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500">
                      <Download size={10} /> Install
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
