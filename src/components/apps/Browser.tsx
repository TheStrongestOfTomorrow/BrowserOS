"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, RotateCw, ExternalLink, Shield, Lock } from "lucide-react";

export default function Browser() {
  const [url, setUrl] = useState("https://en.wikipedia.org/wiki/Operating_system");
  const [inputUrl, setInputUrl] = useState("https://en.wikipedia.org/wiki/Operating_system");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(["https://en.wikipedia.org/wiki/Operating_system"]);
  const [histIdx, setHistIdx] = useState(0);

  const navigate = useCallback((targetUrl: string) => {
    let finalUrl = targetUrl;
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    setIsLoading(true);
    setError(null);
    const newHistory = [...history.slice(0, histIdx + 1), finalUrl];
    setHistory(newHistory);
    setHistIdx(newHistory.length - 1);
  }, [history, histIdx]);

  const goBack = useCallback(() => {
    if (histIdx > 0) {
      const newIdx = histIdx - 1;
      setHistIdx(newIdx);
      setUrl(history[newIdx]);
      setInputUrl(history[newIdx]);
      setIsLoading(true);
      setError(null);
    }
  }, [histIdx, history]);

  const goForward = useCallback(() => {
    if (histIdx < history.length - 1) {
      const newIdx = histIdx + 1;
      setHistIdx(newIdx);
      setUrl(history[newIdx]);
      setInputUrl(history[newIdx]);
      setIsLoading(true);
      setError(null);
    }
  }, [histIdx, history]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setError("This website cannot be embedded due to security restrictions (X-Frame-Options). You can open it in a new tab instead.");
  }, []);

  return (
    <div className="h-full flex flex-col bg-zinc-900">
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-800 border-b border-white/5">
        <button onClick={goBack} disabled={histIdx <= 0} className="p-1 hover:bg-white/10 rounded disabled:opacity-30">
          <ArrowLeft size={14} className="text-zinc-400" />
        </button>
        <button onClick={goForward} disabled={histIdx >= history.length - 1} className="p-1 hover:bg-white/10 rounded disabled:opacity-30">
          <ArrowRight size={14} className="text-zinc-400" />
        </button>
        <button onClick={() => { setIsLoading(true); setError(null); }} className="p-1 hover:bg-white/10 rounded">
          <RotateCw size={14} className={`text-zinc-400 ${isLoading ? "animate-spin" : ""}`} />
        </button>
        <div className="flex-1 flex items-center bg-zinc-700/50 rounded-lg px-3 py-1 gap-2">
          <Lock size={12} className="text-green-400 shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(inputUrl)}
            className="flex-1 bg-transparent text-xs text-zinc-200 outline-none"
            placeholder="Enter URL..."
          />
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white/10 rounded" title="Open in new tab">
          <ExternalLink size={14} className="text-zinc-400" />
        </a>
      </div>

      {/* Content area */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 z-10">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <Shield size={48} className="text-zinc-600 mb-4" />
            <h3 className="text-zinc-300 font-medium mb-2">Cannot Embed This Page</h3>
            <p className="text-zinc-500 text-sm mb-4 max-w-md">{error}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
            >
              Open in New Tab
            </a>
          </div>
        ) : (
          <iframe
            src={url}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Browser"
          />
        )}
      </div>
    </div>
  );
}
