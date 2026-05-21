import { Sparkles, Database, TrendingUp } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-emerald-500/20 bg-[#0a0a0f]/95 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Sparkles className="h-5.5 w-5.5" id="header-logo-icon" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              AI 數據分析與洞察系統
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono tracking-wider">
                GEMINI 3.5 FLASH
              </span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold font-mono mt-0.5">
              Advanced Intelligence Data Processing Unit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 rounded-lg border border-white/5 shadow-xs">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span>本地解析安全不外洩</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 rounded-lg border border-emerald-500/20 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span>系統狀態：精準分析中</span>
          </div>
        </div>
      </div>
    </header>
  );
}
