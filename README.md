# BrowserOS v2

> A complete desktop operating system running entirely in your browser. Zero infrastructure cost. Installable as a PWA.

## 🖥️ Features

- **Window Manager** — Drag, resize, minimize, maximize, and stack windows with z-index management
- **Virtual Filesystem** — OPFS-backed filesystem with full directory tree and file editing
- **Terminal** — Command-line terminal with shell commands (ls, cd, cat, mkdir, touch, rm, etc.)
- **File Manager** — Browse, create, edit, and delete files and directories
- **Web Browser** — Embedded browser with iframe sandbox and navigation controls
- **Code Editor** — Syntax-aware editor with line numbers, file save, and JavaScript/HTML execution
- **Chat** — Real-time chat with room system (WebRTC-ready architecture)
- **App Builder** — Build apps from HTML/CSS/JS and install them instantly
- **App Gallery** — Browse and install community apps — no approval needed, just download
- **Settings** — Customize wallpaper, accent color, theme, dock, network, and user profile
- **Notepad** — Simple text editor with word count
- **Calculator** — Full scientific calculator with history
- **PWA Support** — Install as a standalone app with offline capability via service worker

## 🚀 Getting Started

### Local Development

```bash
# Clone the repo
git clone https://github.com/nicobailey/BrowserOS.git
cd BrowserOS

# Install dependencies
npm install

# Run development server (uses Webpack for Termux/Android compatibility)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see BrowserOS running.

> **Termux/Android users**: The dev server uses `--webpack` by default since Turbopack doesn't support arm64 platforms.

### GitHub Pages Deployment

BrowserOS automatically deploys to GitHub Pages via GitHub Actions:

1. Push to the `main` branch
2. GitHub Actions builds the static export with `NEXT_PUBLIC_BASE_PATH` set
3. Deploys to `https://<username>.github.io/BrowserOS/`

## 🏗️ Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Filesystem | OPFS (Origin Private File System) + localStorage |
| Icons | Lucide React |
| PWA | Service Worker + Web Manifest |
| Deployment | GitHub Pages (static export) |
| CI/CD | GitHub Actions |
| Infrastructure Cost | **$0/month** |

### Static-First Design

BrowserOS is designed to work as a **static site** on GitHub Pages with no backend required:

- **Filesystem**: Uses OPFS and localStorage client-side — no server needed
- **Browser**: Direct iframe embedding with sandbox — no proxy server needed
- **Chat**: WebRTC peer-to-peer architecture — no signaling server needed
- **App Gallery**: Fetches apps from GitHub Issues API directly — no backend needed
- **Code Execution**: Sandboxed `new Function()` — no server-side runtime needed

## 📱 PWA Installation

BrowserOS can be installed as a Progressive Web App:

1. Open BrowserOS in Chrome/Edge
2. Click "Install" in the browser address bar
3. BrowserOS launches as a standalone desktop app

## 🛠️ Built-in Apps

| App | Icon | Description |
|-----|------|-------------|
| Terminal | ⌨️ | Command-line interface |
| Files | 📁 | File manager |
| Browser | 🌐 | Web browser |
| Code Editor | 📝 | Code editor with execution |
| Chat | 💬 | Peer-to-peer chat |
| App Builder | 🔧 | Build apps from HTML/CSS/JS |
| Settings | ⚙️ | System settings |
| Notepad | 📋 | Text editor |
| Calculator | 🔢 | Scientific calculator |
| App Gallery | 🏪 | Browse & install apps |

## 🏪 App Gallery

The App Gallery shows all available apps — **no maintainer approval required**. Apps are fetched directly from:

1. **Built-in curated apps** — Always available, no download needed
2. **GitHub Issues** — Anyone can submit an app by creating an issue with the `app` label

To submit your app:
1. Go to the repo Issues
2. Create a new issue with the `app` label
3. Include app name, description, icon, and HTML code
4. It appears in the App Gallery immediately — no approval needed!

## 📄 License

MIT
