import { useState, useMemo } from "react";
import { ParsedCSV } from "../types";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { LineChart as LineIcon, BarChart2, AreaChart as AreaIcon, Settings, Info, AlertTriangle } from "lucide-react";

interface DataChartSectionProps {
  data: ParsedCSV;
}

export default function DataChartSection({ data }: DataChartSectionProps) {
  const [xAxisKey, setXAxisKey] = useState("");
  const [yAxisKey, setYAxisKey] = useState("");
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");
  const [limitCount, setLimitCount] = useState(25);

  // 初始化或自動適應 X、Y 軸所適用的自動欄位
  useMemo(() => {
    if (data.headers.length > 0) {
      // 預設尋找第一個適合當 X 軸的類別/文字欄位，不行則為第一個欄位
      const initialX =
        data.categoricalColumns.length > 0
          ? data.categoricalColumns[0]
          : data.headers[0];
      setXAxisKey(initialX);

      // 預設尋找第一個適合作 Y 軸的數值欄位，不行則為最後一個欄位
      const initialY =
        data.numericColumns.length > 0
          ? data.numericColumns[0]
          : data.headers[data.headers.length - 1];
      setYAxisKey(initialY);
    }
  }, [data]);

  // 過濾、截取與轉換
  const chartData = useMemo(() => {
    if (data.rows.length === 0) return [];
    // 限制節點數量以避免圖表卡頓
    return data.rows.slice(0, limitCount).map(row => {
      const xVal = row[xAxisKey];
      const yVal = row[yAxisKey];
      return {
        ...row,
        [xAxisKey]: xVal !== undefined && xVal !== null ? String(xVal) : "",
        // 如果是字串含有百分比，但沒有被 parse 成功，我們這裡二次保險處理
        [yAxisKey]: typeof yVal === "number" ? yVal : Number(String(yVal || "0").replace(/[^\d\.]/g, "")) || 0
      };
    });
  }, [data.rows, xAxisKey, yAxisKey, limitCount]);

  if (data.headers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-950/40 rounded-xl border border-dashed border-white/10" id="empty-chart-state">
        <LineIcon className="h-8 w-8 text-slate-500 mb-2" />
        <p className="text-xs text-slate-450 font-sans">無可視覺化數據。請先上傳 CSV 資料或套用範例。</p>
      </div>
    );
  }

  const hasNumeric = data.numericColumns.length > 0;

  return (
    <div className="flex flex-col h-full gap-4" id="data-chart-section-container">
      {/* 互動式圖表軸/形式控制器 */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#0a0a0f]/80 p-4 border border-white/10 rounded-xl backdrop-blur-md shadow-2xl" id="chart-controls-panel">
        {/* X軸選擇 */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-450 font-sans flex items-center gap-1 uppercase tracking-wider">
            <span>水平維度 X 軸欄位</span>
          </label>
          <select
            value={xAxisKey}
            onChange={(e) => setXAxisKey(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 bg-slate-950 text-emerald-350 border border-white/10 rounded-lg outline-hidden focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono"
            id="chart-xaxis-selector"
          >
            {data.headers.map(header => (
              <option key={header} value={header}>
                {header} {data.categoricalColumns.includes(header) ? "(文字)" : "(數字)"}
              </option>
            ))}
          </select>
        </div>

        {/* Y軸選擇 */}
        <div className="flex flex-col gap-1 row-span-1">
          <label className="text-[10px] font-bold text-slate-450 font-sans flex items-center gap-1 uppercase tracking-wider">
            <span>數值量化 Y 軸欄位</span>
          </label>
          <select
            value={yAxisKey}
            onChange={(e) => setYAxisKey(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 bg-slate-950 text-emerald-350 border border-white/10 rounded-lg outline-hidden focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono"
            id="chart-yaxis-selector"
          >
            {data.headers.map(header => (
              <option key={header} value={header}>
                {header} {data.numericColumns.includes(header) ? "(數字)" : "(文字)"}
              </option>
            ))}
          </select>
        </div>

        {/* 圖表呈現形式 */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-450 font-sans uppercase tracking-wider">
            可視覺化呈現型態
          </label>
          <div className="grid grid-cols-3 gap-1" id="chart-type-buttons">
            <button
              onClick={() => setChartType("bar")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                chartType === "bar"
                  ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-slate-950 text-slate-400 border-white/10 hover:bg-white/5"
              }`}
              id="btn-chart-bar"
              title="條形圖"
            >
              <BarChart2 className="h-3.5 w-3.5" />
              <span>柱狀</span>
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                chartType === "line"
                  ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-slate-950 text-slate-400 border-white/10 hover:bg-white/5"
              }`}
              id="btn-chart-line"
              title="折線圖"
            >
              <LineIcon className="h-3.5 w-3.5" />
              <span>折線</span>
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                chartType === "area"
                  ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-slate-950 text-slate-400 border-white/10 hover:bg-white/5"
              }`}
              id="btn-chart-area"
              title="面積圖"
            >
              <AreaIcon className="h-3.5 w-3.5" />
              <span>面積</span>
            </button>
          </div>
        </div>

        {/* 顯示筆數限制 */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-450 font-sans uppercase tracking-wider">
            資料筆數精簡上限
          </label>
          <select
            value={limitCount}
            onChange={(e) => setLimitCount(Number(e.target.value))}
            className="w-full text-xs px-2.5 py-1.5 bg-slate-950 text-emerald-350 border border-white/10 rounded-lg outline-hidden focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono"
            id="chart-limit-selector"
          >
            <option value={10}>顯示前 10 筆</option>
            <option value={20}>顯示前 20 筆</option>
            <option value={30}>顯示前 30 筆</option>
            <option value={50}>顯示前 50 筆</option>
          </select>
        </div>
      </div>

      {!hasNumeric && (
        <div className="p-3 bg-amber-950/20 border border-amber-900/40 text-amber-400 rounded-lg text-[11px] flex items-start gap-1.5 leading-normal" id="no-numeric-warning">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong>注意：</strong>我們尚未在 CSV 中偵測到明確的常規數值欄位（大部分儲存格包含字串或非純數字）。您可以手動選擇任一欄位作為 Y 軸，系統會嘗試為您提取數值。
          </div>
        </div>
      )}

      {/* 圖表渲染區塊 */}
      <div className="flex-1 bg-slate-950 border border-white/10 rounded-2xl p-4 shadow-2xl relative min-h-[300px]" id="chart-viewport-box">
        {data.rows.length > limitCount && (
          <div className="absolute top-3 right-3 z-10 bg-[#0a0a0f] border border-white/10 px-2.5 py-1 rounded text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
            <Info className="h-3 w-3 text-emerald-400" />
            <span>目前僅繪製前 {limitCount} 筆，以防瀏覽延遲</span>
          </div>
        )}

        <div className="w-full h-full min-h-[280px]" id="recharts-responsive-container-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            {chartType === "bar" ? (
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" strokeOpacity={0.5} />
                <XAxis dataKey={xAxisKey} tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0f", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.3)", color: "#e2e8f0", fontSize: "11px" }}
                  labelStyle={{ fontWeight: "bold", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "4px", marginBottom: "4px", color: "#10b981" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", marginTop: "10px", color: "#94a3b8" }} />
                <Bar dataKey={yAxisKey} name={yAxisKey} fill="#10b981" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : chartType === "line" ? (
              <LineChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" strokeOpacity={0.5} />
                <XAxis dataKey={xAxisKey} tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0f", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.3)", color: "#e2e8f0", fontSize: "11px" }}
                  labelStyle={{ fontWeight: "bold", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "4px", marginBottom: "4px", color: "#10b981" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", marginTop: "10px", color: "#94a3b8" }} />
                <Line type="monotone" dataKey={yAxisKey} name={yAxisKey} stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }} dot={{ r: 4, strokeWidth: 1, fill: "#0a0a0f" }} />
              </LineChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" strokeOpacity={0.5} />
                <XAxis dataKey={xAxisKey} tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0a0f", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.3)", color: "#e2e8f0", fontSize: "11px" }}
                  labelStyle={{ fontWeight: "bold", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "4px", marginBottom: "4px", color: "#10b981" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", marginTop: "10px", color: "#94a3b8" }} />
                <Area type="monotone" dataKey={yAxisKey} name={yAxisKey} stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorY)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
