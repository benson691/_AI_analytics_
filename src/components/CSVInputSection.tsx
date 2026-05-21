import React, { useState, useRef } from "react";
import { SAMPLE_DATASETS } from "../data/samples";
import { Upload, Clipboard, Code, HelpCircle, FileText, Settings, Sparkles, Database } from "lucide-react";
import { SampleDataset } from "../types";

interface CSVInputSectionProps {
  csvText: string;
  setCsvText: (text: string) => void;
  question: string;
  setQuestion: (text: string) => void;
  systemInstruction: string;
  setSystemInstruction: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function CSVInputSection({
  csvText,
  setCsvText,
  question,
  setQuestion,
  systemInstruction,
  setSystemInstruction,
  onSubmit,
  isLoading
}: CSVInputSectionProps) {
  const [activeTab, setActiveTab] = useState<"paste" | "samples">("paste");
  const [dragActive, setDragActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 一鍵加載範例
  const handleLoadSample = (sample: SampleDataset) => {
    setCsvText(sample.csv);
    setQuestion(sample.suggestedQuestion || "");
    setActiveTab("paste");
  };

  // 處理檔案上傳
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".txt")) {
      alert("僅支援上傳 .csv 或 .txt 副檔名的文字檔案！");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      setActiveTab("paste");
    };
    reader.onerror = () => {
      alert("讀取檔案時發生錯誤！");
    };
    reader.readAsText(file, "UTF-8");
  };

  // 拖曳上傳支援
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-[#0a0a0f]/80 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full backdrop-blur-md" id="csv-input-section-container">
      {/* 區塊頁籤切換 */}
      <div className="flex border-b border-white/5 bg-slate-950/80 p-2 gap-2" id="input-tabs-header">
        <button
          onClick={() => setActiveTab("paste")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "paste"
              ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
          id="tab-paste-data"
        >
          <Clipboard className="h-4 w-4 text-emerald-450" />
          <span>輸入/貼上數據</span>
        </button>
        <button
          onClick={() => setActiveTab("samples")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "samples"
              ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
          id="tab-sample-data"
        >
          <Database className="h-4 w-4 text-emerald-450" />
          <span>精選範例資料</span>
        </button>
      </div>

      {/* 主要內容區 */}
      <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
        {activeTab === "paste" ? (
          <div className="flex flex-col gap-4 flex-1">
            {/* 拖曳上傳/點擊上傳 */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                dragActive
                  ? "border-emerald-500 bg-emerald-500/10 scale-[0.99] shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "border-white/10 hover:border-emerald-500/50 bg-slate-950/50 hover:bg-slate-950"
              }`}
              id="drag-drop-zone"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv,.txt"
                className="hidden"
                id="hidden-file-input"
              />
              <div className="p-2 bg-slate-900 rounded-lg border border-white/10 shadow-xs">
                <Upload className="h-4.5 w-4.5 text-emerald-405" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300">
                  拖曳 CSV 檔案至此，或 <span className="text-emerald-400 hover:underline">點擊瀏覽檔案</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  支援 UTF-8 編碼的 CSV/TXT 文字檔案，單次容量最大 25MB
                </p>
              </div>
            </div>

            {/* 資料文字輸入框 */}
            <div className="flex flex-col flex-1 gap-1.5 min-h-[180px]">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>貼上 CSV 文字格報表：</span>
                {csvText && (
                  <button
                    onClick={() => setCsvText("")}
                    className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline font-medium"
                    id="clear-csv-text-button"
                  >
                    清除資料
                  </button>
                )}
              </label>
              <div className="relative flex-1 flex flex-col">
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`第一行為標頭，逗號分隔，例如：\n日期,通路,銷售額,轉換率\n2026-05-01,Facebook,12000,2.1%\n2026-05-02,Google,15000,2.8%`}
                  className="w-full flex-1 p-3 text-[11px] font-mono bg-slate-950/80 text-emerald-300 border border-white/10 rounded-xl focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 focus:outline-hidden resize-none overflow-y-auto leading-relaxed"
                  id="csv-textarea-input"
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[460px]" id="samples-grid">
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mb-1">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4" />
                快速上手體驗
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                我們精選了三款極具實用價值的專業商業報表資料。請任選一鍵載入，一秒建構圖表與解讀 AI 數據報告：
              </p>
            </div>
            {SAMPLE_DATASETS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => handleLoadSample(sample)}
                className="group border border-white/5 hover:border-emerald-500/30 rounded-xl p-3.5 bg-slate-950/40 hover:bg-emerald-500/5 cursor-pointer shadow-xs transition-all flex flex-col gap-2 relative overflow-hidden"
                id={`sample-item-${sample.id}`}
              >
                <div className="absolute right-0 top-0 h-16 w-16 bg-emerald-500/5 rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:bg-emerald-500/10 transition-all duration-300 pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-350 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 border border-white/5 font-mono transition-colors">
                    {sample.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {sample.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {sample.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 提問 / 分析重點 */}
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-emerald-450" />
            <span>自訂分析重點或問題（可選）：</span>
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="例如：請告訴我哪個月銷售額最高？如何調整未來的預算分配？"
            className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-lg text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 focus:outline-hidden text-xs"
            id="question-input"
          />
        </div>

        {/* 進階：AI 系統指令調整 */}
        <div className="border border-white/10 rounded-xl overflow-hidden mt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-950/80 text-xs font-bold text-slate-300 hover:text-white transition-colors border-b border-white/5"
            id="toggle-advanced-settings-button"
          >
            <span className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              設定 AI 系統角色與規則 (System Instruction)
            </span>
            <span className="text-[10px] text-emerald-400">
              {showAdvanced ? "折疊" : "展開"}
            </span>
          </button>
          {showAdvanced && (
            <div className="p-3 bg-slate-950/40 flex flex-col gap-1.5">
              <p className="text-[10px] text-slate-500 leading-normal">
                定義 AI 模型的內建指令，以引導產出數據報告的語氣、專業技能、特定的報告範本結構：
              </p>
              <textarea
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                rows={3}
                placeholder="在此輸入自訂 System Instruction..."
                className="w-full p-2.5 text-xs bg-slate-950/85 text-slate-350 border border-white/10 rounded-lg focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 focus:outline-hidden"
                id="system-instruction-textarea"
              />
            </div>
          )}
        </div>

        {/* 確定送出按鈕 */}
        <button
          onClick={onSubmit}
          disabled={isLoading || !csvText.trim()}
          className={`w-full h-12 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
            !csvText.trim()
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
              : isLoading
              ? "bg-emerald-500/40 text-black cursor-wait border border-emerald-500/20"
              : "bg-emerald-500 hover:bg-emerald-400 text-black border border-emerald-400 active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.45)]"
          }`}
          id="start-ai-analysis-button"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
              <span>AI 引擎分析中，請稍候...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>開始 AI 數據分析與洞察</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
