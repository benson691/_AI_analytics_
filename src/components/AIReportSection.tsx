import { useState } from "react";
import Markdown from "react-markdown";
import { Copy, Check, Download, Sparkles, FileText, AlertCircle, RefreshCw } from "lucide-react";

interface AIReportSectionProps {
  result: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function AIReportSection({ result, isLoading, error }: AIReportSectionProps) {
  const [copied, setCopied] = useState(false);

  // 一鍵複製
  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("無法複製文字：", err);
    }
  };

  // 匯出 Markdown 檔案
  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AI-數據分析與洞察報告-${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 自訂 Markdown 元素渲染器，以達到業界頂級視覺美感
  const customRenderers = {
    h1: ({ children, ...props }: any) => (
      <h1 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3 mt-5 flex items-center gap-2" {...props}>
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-xs font-bold text-emerald-400 mb-2 mt-4 flex items-center gap-1.5" {...props}>
        <span>//</span> {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-[11px] font-bold text-slate-305 mb-1.5 mt-3" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }: any) => (
      <p className="text-xs text-slate-300 leading-relaxed mb-3.5" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="list-none pl-4 mb-4 text-xs space-y-2 text-slate-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal pl-5 mb-4 text-xs space-y-2 text-slate-300" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="text-xs text-slate-300 flex items-start gap-2" {...props}>
        <span className="text-emerald-500 shrink-0 select-none mt-1.5">•</span>
        <div className="flex-1">{children}</div>
      </li>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-2 border-emerald-500 pl-4 py-2 bg-emerald-500/5 rounded-r-lg my-4 text-xs text-slate-300 font-sans italic" {...props}>
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }: any) => (
      <div className="w-full overflow-x-auto my-4 border border-white/10 rounded-xl shadow-2xl bg-slate-950/80">
        <table className="w-full border-collapse text-left text-xs" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-[#0a0a0f] border-b border-white/10 font-bold text-slate-300" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: any) => (
      <tbody className="divide-y divide-white/5" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }: any) => (
      <tr className="hover:bg-emerald-500/[0.04] transition-colors" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }: any) => (
      <th className="px-3.5 py-2.5 font-bold text-slate-400 text-[11px] border-r border-white/5" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="px-3.5 py-2 text-slate-300 text-[11px] border-r border-white/5" {...props}>
        {children}
      </td>
    ),
    code: ({ children, inline, ...props }: any) => (
      <code className="font-mono text-[10px] bg-slate-900 px-1 py-0.5 rounded text-emerald-400 font-semibold border border-white/5" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }: any) => (
      <pre className="bg-[#050507] text-emerald-300 p-4 rounded-xl font-mono text-[11px] overflow-x-auto my-4 border border-white/10 leading-relaxed" {...props}>
        {children}
      </pre>
    )
  };

  // 分析正在進行中的載入畫面設計
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[350px]" id="ai-report-loading-container">
        <div className="relative mb-6">
          <div className="h-16 w-16 rounded-full border-4 border-slate-900 border-t-emerald-500 animate-spin" />
          <Sparkles className="h-6 w-6 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-white animate-pulse">正在精確研讀、解讀您的 CSV 資料結構...</h4>
        <p className="text-[11px] text-slate-400 mt-2 max-w-sm leading-relaxed">
          我們正在運用 Google Gemini 新一代多模態分析大模型，為您自動提煉核心資料特徵，並建立深度洞察與行動策略，預估需要 5 至 10 秒...
        </p>
      </div>
    );
  }

  // 錯誤發生時的提示語
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]" id="ai-report-error-container">
        <div className="p-3 bg-rose-950/20 rounded-xl border border-rose-900/40 mb-4 text-rose-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h4 className="text-xs font-bold text-white">AI 分析調研失敗</h4>
        <p className="text-[11px] text-rose-400 mt-2 max-w-sm font-mono leading-relaxed bg-rose-950/50 p-2.5 rounded-lg border border-rose-900/30">
          {error}
        </p>
        <p className="text-[10px] text-slate-500 mt-3">
          請檢查您的 Google AI Studio 是否已經關聯並綁定了有效的 <code className="font-mono text-rose-450 border-rose-950/40 bg-slate-950">GEMINI_API_KEY</code>
        </p>
      </div>
    );
  }

  // 還沒有分析結果時的初始畫面語
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]" id="ai-report-placeholder">
        <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 mb-4 text-slate-500 animate-pulse">
          <FileText className="h-8 w-8 text-emerald-500/50" />
        </div>
        <h4 className="text-xs font-bold text-slate-300">準備就緒，等待分析指令</h4>
        <p className="text-[11px] text-slate-500 mt-1.5 max-w-xs leading-relaxed">
          請於左側欄貼上 CSV 指標或點選載入範例，然後點擊「開始 AI 數據分析」按鈕，立即獲取 AI 顧問專業洞察報告。
        </p>
      </div>
    );
  }

  // 分析成功的精美呈現
  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]/80 rounded-2xl p-5 border border-white/10 shadow-2xl relative backdrop-blur-md" id="ai-report-actual">
      {/* 標頭控制器 */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4" id="ai-report-tools-header">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-emerald-450" />
          AI 數據診斷與商業洞察結果
        </span>
        <div className="flex items-center gap-2">
          {/* 複製按鈕 */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
              copied
                ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "bg-slate-950 text-slate-300 border-white/10 hover:bg-emerald-500/10 hover:text-emerald-405"
            }`}
            id="copy-report-content"
            title="一鍵複製 Markdown 格式"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-450" />
                <span>已複製報告！</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>一鍵複製</span>
              </>
            )}
          </button>

          {/* 匯出 MD 按鈕 */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-950 border border-white/10 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-405 active:scale-95 transition-all"
            id="download-report-markdown"
            title="匯出 Markdown 檔案到本地"
          >
            <Download className="h-3.5 w-3.5 animate-pulse" />
            <span>匯出 .md</span>
          </button>
        </div>
      </div>

      {/* 渲染主體 */}
      <div className="flex-1 overflow-y-auto max-h-[460px] pr-2 scrollbar-thin" id="markdown-rendered-viewport">
        <div className="markdown-body">
          <Markdown components={customRenderers}>{result}</Markdown>
        </div>
      </div>
    </div>
  );
}
