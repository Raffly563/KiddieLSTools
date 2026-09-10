"use client";

import { useState, useEffect, useRef } from "react";
import { Folder, FolderOpen, Music, Play, Pause, Volume2, VolumeX, Search, FileAudio, ChevronRight } from "lucide-react";

type WaveItem = {
  type: "file" | "directory";
  name: string;
  path?: string;
  children?: WaveItem[];
};

// ─── Fake waveform bars (static visual, animated when playing) ─────────────────
function WaveformVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = [4, 8, 14, 10, 18, 12, 22, 16, 20, 14, 24, 18, 12, 20, 16, 10, 22, 8, 18, 12, 24, 16, 10, 20, 14];
  return (
    <div className="flex items-end justify-center gap-[3px] h-16">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full bg-zinc-400 transition-all ${isPlaying ? "animate-pulse" : "opacity-40"}`}
          style={{
            height: `${h * 2.2}px`,
            animationDelay: `${i * 60}ms`,
            animationDuration: `${700 + (i % 5) * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Custom range input via CSS ────────────────────────────────────────────────
const rangeStyle = `
  .custom-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 3px;
    border-radius: 9999px;
    outline: none;
    cursor: pointer;
    background: transparent;
  }
  .custom-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #e4e4e7;
    cursor: pointer;
    border: 2px solid #18181b;
    transition: transform 0.1s;
  }
  .custom-range::-webkit-slider-thumb:hover {
    transform: scale(1.25);
  }
  .custom-volume {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 3px;
    border-radius: 9999px;
    outline: none;
    cursor: pointer;
    background: transparent;
  }
  .custom-volume::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #71717a;
    cursor: pointer;
    border: none;
    transition: transform 0.1s;
  }
  .custom-volume::-webkit-slider-thumb:hover {
    transform: scale(1.3);
    background: #a1a1aa;
  }
`;

export default function WavePlayerPage() {
  const [waveTree, setWaveTree]           = useState<WaveItem[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedFile, setSelectedFile]   = useState<WaveItem | null>(null);
  const [isPlaying, setIsPlaying]         = useState(false);
  const [volume, setVolume]               = useState(0.7);
  const [isMuted, setIsMuted]             = useState(false);
  const [currentTime, setCurrentTime]     = useState(0);
  const [duration, setDuration]           = useState(0);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["bgm"]));

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (t: number) => {
    if (isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePct   = isMuted ? 0 : volume * 100;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (audioRef.current) { audioRef.current.currentTime = t; setCurrentTime(t); }
  };

  const toggleMute = () => {
    if (audioRef.current) audioRef.current.muted = !isMuted;
    setIsMuted(p => !p);
  };

  useEffect(() => {
    fetch("/api/wave")
      .then(r => r.json())
      .then(d => { if (d.files) setWaveTree(d.files); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const toggleFolder = (p: string) => {
    const s = new Set(expandedFolders);
    s.has(p) ? s.delete(p) : s.add(p);
    setExpandedFolders(s);
  };

  const playFile = (file: WaveItem) => {
    setSelectedFile(file);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = file.path!;
      audioRef.current.play().catch(console.error);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !selectedFile) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else           { audioRef.current.play();  setIsPlaying(true);  }
  };

  const renderTree = (items: WaveItem[], currentPath = "") =>
    items.map(item => {
      const itemPath = `${currentPath}/${item.name}`;

      if (item.type === "directory") {
        const isExpanded = expandedFolders.has(itemPath);
        const matchesSearch = searchTerm
          ? item.children?.some(c => c.type === "file" && c.name.toLowerCase().includes(searchTerm.toLowerCase()))
          : true;
        if (!matchesSearch) return null;

        return (
          <div key={itemPath} className="mb-0.5">
            <button
              onClick={() => toggleFolder(itemPath)}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-zinc-200"
            >
              {isExpanded
                ? <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                : <Folder     className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">{item.name}</span>
              <ChevronRight className={`w-3 h-3 ml-auto shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
            </button>
            {isExpanded && item.children && (
              <div className="pl-3 ml-2 border-l border-zinc-800 mt-0.5 space-y-px">
                {renderTree(item.children, itemPath)}
              </div>
            )}
          </div>
        );
      }

      // file
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return null;
      const isSelected = selectedFile?.path === item.path;

      return (
        <button
          key={item.path}
          onClick={() => playFile(item)}
          className={`flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded-md transition-colors text-left ${
            isSelected
              ? "bg-zinc-800 text-zinc-100 border-l-2 border-zinc-400 pl-[6px]"
              : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
          }`}
        >
          <FileAudio className="w-3.5 h-3.5 shrink-0 opacity-60" />
          <span className="truncate font-medium">{item.name}</span>
        </button>
      );
    });

  return (
    <>
      <style>{rangeStyle}</style>
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
      />

      <div className="flex h-full overflow-hidden bg-background">

        {/* ── LEFT: File Explorer ── */}
        <div className="w-64 shrink-0 border-r border-zinc-800 flex flex-col h-full bg-zinc-950">

          {/* Search */}
          <div className="p-3 border-b border-zinc-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audio files..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md h-8 pl-8 pr-3 text-xs font-medium text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-y-auto p-2">
            {isLoading ? (
              <div className="text-xs text-zinc-600 text-center py-8">Loading...</div>
            ) : waveTree.length === 0 ? (
              <div className="text-xs text-zinc-600 text-center py-8">No audio files found.</div>
            ) : (
              <div className="space-y-px">{renderTree(waveTree)}</div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Player ── */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950">
          {selectedFile ? (
            <div className="w-full max-w-sm flex flex-col gap-8">

              {/* Track info */}
              <div className="text-center">
                {/* Art placeholder */}
                <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
                  <Music className="w-10 h-10 text-zinc-600" />
                </div>
                <h2 className="text-lg font-bold text-zinc-100 truncate">{selectedFile.name}</h2>
                <p className="text-xs text-zinc-600 mt-1 truncate font-mono">{selectedFile.path}</p>
              </div>

              {/* Waveform */}
              <WaveformVisualizer isPlaying={isPlaying} />

              {/* Progress */}
              <div className="space-y-2">
                <div
                  className="relative h-[3px] rounded-full bg-zinc-800 cursor-pointer"
                  style={{ background: `linear-gradient(to right, #e4e4e7 ${progressPct}%, #27272a ${progressPct}%)` }}
                >
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.01"
                    value={currentTime}
                    onChange={handleSeek}
                    className="custom-range absolute inset-0 opacity-0 w-full h-full"
                    style={{ cursor: "pointer" }}
                  />
                  {/* visible thumb */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-zinc-200 border-2 border-zinc-950 pointer-events-none"
                    style={{ left: `calc(${progressPct}% - 6px)` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between gap-4">

                {/* Volume */}
                <div className="flex items-center gap-2 w-32">
                  <button onClick={toggleMute} className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0">
                    {isMuted || volume === 0
                      ? <VolumeX className="w-4 h-4" />
                      : <Volume2 className="w-4 h-4" />}
                  </button>
                  <div
                    className="flex-1 relative h-[3px] rounded-full"
                    style={{ background: `linear-gradient(to right, #71717a ${volumePct}%, #27272a ${volumePct}%)` }}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={e => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                      className="custom-volume absolute inset-0 opacity-0 w-full h-full"
                      style={{ cursor: "pointer" }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-zinc-500 pointer-events-none"
                      style={{ left: `calc(${volumePct}% - 5px)` }}
                    />
                  </div>
                </div>

                {/* Play / Pause */}
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  {isPlaying
                    ? <Pause className="w-5 h-5 fill-current" />
                    : <Play  className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                {/* Spacer to balance layout */}
                <div className="w-32" />
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-zinc-700">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <FileAudio className="w-7 h-7" />
              </div>
              <p className="text-sm font-medium">Select a file to play</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
