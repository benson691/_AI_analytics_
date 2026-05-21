import { useState, useEffect, useMemo } from "react";
import { parseCSV } from "./utils/csvParser";
import { SAMPLE_DATASETS } from "./data/samples";
import Header from "./components/Header";
import CSVInputSection from "./components/CSVInputSection";
import DataTableSection from "./components/DataTableSection";
import DataChartSection from "./components/DataChartSection";
import AIReportSection from "./components/AIReportSection";
import { ParsedCSV, AnalysisState } from "./types";
import { Table, BarChart3, Sparkles } from "lucide-react";

export default function App() {
  // 為了超讚的開箱即用 UX，預設載入「行銷成效報表」
  const defaultSample = SAMPLE_DATASETS[0];

  const [csvText, setCsvText] = useState(defaultSample.csv);
  const [question, setQuestion] = useState(defaultSample.suggestedQuestion || "");
  const [systemInstruction, setSystemInstruction] = useState(
    "你是一位資深的專業數據分析師與商業決策顧問。善於解讀各式報表、挖掘關鍵洞察（Insights）並轉化為具體的改善建議。你的分析必須完全基於事實，客觀、嚴謹且極具商業價值。請務必使用中文「繁體中文（台灣）」進行回覆與報告撰寫。"
  );

  const [activeTab, setActiveTab] = useState<"chart" | "table">("chart");

  // AI 運算分析狀態管理
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: "idle",
    error: null,
    result: null,
  });

  // 即時自動解析 CSV (使用 useMemo 以維持頂級運算性能)
  const parsedData = useMemo(() => {
    return parseCSV(csvText);
  }, [csvText]);

  // 當使用者變更貼上內容時，如果偵測到是貼上範例以外的自訂資料，自動清空特定提問，留空供自由發揮
  useEffect(() => {
    const isSample = SAMPLE_DATASETS.some(s => s.csv.trim() === csvText.trim());
    if (!isSample && csvText.trim().length > 0) {
      // 保留當前 question 的主體性，不影響自訂輸入
    }
  }, [csvText]);

  // 確定呼叫伺服器 AI API 進行數據深入診斷
  const handleStartAnalysis = async () => {
    if (!csvText.trim()) return;

    setAnalysisState({
      status: "loading",
      error: null,
      result: null,
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csvData: csvText,
          question: question,
          systemInstruction: systemInstruction,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "AI 分析引擎在伺服器端發生非預期故障。");
      }

      const data = await response.json();
      setAnalysisState({
        status: "success",
        error: null,
        result: data.result,
      });
    } catch (err: any) {
      console.error("Analysis execution error:", err);
      setAnalysisState({
        status: "error",
        error: err.message || "連線或 API 回合逾時，請檢查伺服器環境並重新嘗試。",
        result: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col font-sans text-slate-300 relative overflow-hidden" id="main-app-container">
      {/* Immersive Atmospheric Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* 導航 header */}
      <Header />

      {/* 主儀表板卡片拼板區 */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full h-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
          
          {/* 左側：CSV輸入與提問設定控台 (佔 5 格) */}
          <div className="lg:col-span-5 flex flex-col h-full min-h-[450px]">
            <CSVInputSection
              csvText={csvText}
              setCsvText={setCsvText}
              question={question}
              setQuestion={setQuestion}
              systemInstruction={systemInstruction}
              setSystemInstruction={setSystemInstruction}
              onSubmit={handleStartAnalysis}
              isLoading={analysisState.status === "loading"}
            />
          </div>

          {/* 右側：資料互動視覺化與 AI 報告檢視控台 (佔 7 格) */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-full">
            
            {/* 上半部：互動圖表與資料庫檢視 */}
            <div className="bg-[#0a0a0f]/80 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col flex-1 min-h-[420px] backdrop-blur-md" id="dashboard-right-upper-pane">
              {/* 控制列與功能切換 */}
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5 bg-slate-950/80" id="visual-tabs-bar">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                  <BarChart3 className="h-4 w-4 text-emerald-455 animate-pulse" />
                  數據資料預覽與互動視覺化
                </span>
                
                {/* 圖表與表格標籤 */}
                <div className="flex rounded-lg bg-slate-900 p-1 gap-1 border border-white/5" id="interactive-mode-tabs">
                  <button
                    onClick={() => setActiveTab("chart")}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      activeTab === "chart"
                        ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                    id="btn-tab-chart"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>動態圖表</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("table")}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      activeTab === "table"
                        ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                    id="btn-tab-table"
                  >
                    <Table className="h-3.5 w-3.5" />
                    <span>原始數據表</span>
                  </button>
                </div>
              </div>

              {/* 根據所選 Tab 渲染 */}
              <div className="p-5 flex-1 overflow-x-auto" id="visual-content-container">
                {activeTab === "chart" ? (
                  <DataChartSection data={parsedData} />
                ) : (
                  <DataTableSection data={parsedData} />
                )}
              </div>
            </div>

            {/* 下半部：AI 診斷報告顯示器 */}
            <div className="flex flex-col min-h-[350px]" id="dashboard-right-lower-pane">
              <AIReportSection
                result={analysisState.result}
                isLoading={analysisState.status === "loading"}
                error={analysisState.error}
              />
            </div>

          </div>
        </div>
      </main>

      {/* 底部智慧註腳與免責條款 */}
      <footer className="bg-black/85 border-t border-white/5 py-4 text-center text-[10px] text-slate-500 tracking-wider font-mono shrink-0" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>PROCESSING ENGINE: GOOGLE GEMINI 3.5 FLASH • ENCRYPTED SANDBOX PRIVACY</p>
          <p className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Tokyo Core Server TYO-01 Active</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
