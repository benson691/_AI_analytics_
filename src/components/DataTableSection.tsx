import { useState, useMemo } from "react";
import { ParsedCSV, CSVRow } from "../types";
import { Search, ChevronLeft, ChevronRight, Hash, Type, Table, AlertCircle } from "lucide-react";

interface DataTableSectionProps {
  data: ParsedCSV;
}

export default function DataTableSection({ data }: DataTableSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 當資料更新時，重置搜尋與分頁
  useMemo(() => {
    setCurrentPage(1);
  }, [data]);

  // 全文進階檢索
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return data.rows;
    const lowerSearch = searchTerm.toLowerCase();
    
    return data.rows.filter(row => {
      return Object.values(row).some(val => {
        if (val === undefined || val === null) return false;
        return String(val).toLowerCase().includes(lowerSearch);
      });
    });
  }, [data.rows, searchTerm]);

  // 分頁計算結果
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, currentPage]);

  if (data.headers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-950/40 rounded-xl border border-dashed border-white/10" id="empty-table-state">
        <Table className="h-8 w-8 text-slate-500 mb-2" />
        <p className="text-xs text-slate-450 font-sans">無可顯示的報表資料。請先於左側輸入 CSV 或加載範例。</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4" id="data-table-section-container">
      {/* 數據概要卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" id="table-summary-cards">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex flex-col justify-between shadow-inner">
          <span className="text-[10px] font-bold text-slate-500 font-sans uppercase">資料總列數</span>
          <span className="text-base font-bold text-white font-mono mt-1">{data.rows.length} 筆</span>
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10 flex flex-col justify-between shadow-inner">
          <span className="text-[10px] font-bold text-slate-500 font-sans uppercase">資料欄位數</span>
          <span className="text-base font-bold text-white font-mono mt-1">{data.headers.length} 個</span>
        </div>
        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/20 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-emerald-400 font-sans flex items-center gap-1">
            <Hash className="h-3 w-3" />
            <span>數值型欄位</span>
          </span>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {data.numericColumns.slice(0, 3).map(col => (
              <span key={col} className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 max-w-[80px] truncate animate-pulse" title={col}>
                {col}
              </span>
            ))}
            {data.numericColumns.length > 3 && (
              <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300">
                +{data.numericColumns.length - 3}
              </span>
            )}
            {data.numericColumns.length === 0 && (
              <span className="text-[9px] text-slate-500">無偵測到數值</span>
            )}
          </div>
        </div>
        <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/20 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-blue-400 font-sans flex items-center gap-1">
            <Type className="h-3 w-3" />
            <span>文字型欄位</span>
          </span>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {data.categoricalColumns.slice(0, 3).map(col => (
              <span key={col} className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 max-w-[80px] truncate" title={col}>
                {col}
              </span>
            ))}
            {data.categoricalColumns.length > 3 && (
              <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/20 text-blue-300">
                +{data.categoricalColumns.length - 3}
              </span>
            )}
            {data.categoricalColumns.length === 0 && (
              <span className="text-[9px] text-slate-500">僅含數值</span>
            )}
          </div>
        </div>
      </div>

      {/* 搜尋欄位與進階控制 */}
      <div className="flex flex-col sm:flex-row items-center gap-3" id="table-search-header">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-500/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="全資料庫搜尋文字/數值..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950/60 text-slate-250 border border-white/10 rounded-lg placeholder:text-slate-650 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-hidden font-sans"
            id="table-search-input"
          />
        </div>
        <div className="text-[11px] text-slate-400 whitespace-nowrap" id="table-search-result-count">
          找到 <span className="font-bold text-emerald-400 font-mono">{filteredRows.length}</span> 筆 / 共 {data.rows.length} 筆
        </div>
      </div>

      {/* 核心資料表格區 */}
      <div className="flex-1 border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-slate-955 min-h-[220px]">
        <div className="overflow-x-auto h-full max-h-[360px]">
          <table className="w-full border-collapse text-left" id="interactive-data-table">
            <thead>
              <tr className="bg-slate-950 border-b border-white/10">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider text-center w-12">
                  #
                </th>
                {data.headers.map((header) => {
                  const isNumeric = data.numericColumns.includes(header);
                  return (
                    <th
                      key={header}
                      className={`px-4 py-3 text-[10px] font-bold text-slate-450 font-sans tracking-tight border-r border-white/5 ${
                        isNumeric ? "text-right" : "text-left"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {header}
                        {isNumeric ? (
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 rounded-sm border border-emerald-500/15">NUM</span>
                        ) : (
                          <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1 rounded-sm border border-blue-500/15">TXT</span>
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11px] text-slate-300 font-sans">
              {paginatedRows.map((row, rIndex) => {
                const globalIndex = (currentPage - 1) * rowsPerPage + rIndex + 1;
                return (
                  <tr key={rIndex} className="hover:bg-emerald-500/[0.04] transition-colors border-b border-white/5">
                    <td className="px-4 py-2.5 text-center font-mono text-slate-500 bg-slate-950/20 border-r border-white/5">
                      {globalIndex}
                    </td>
                    {data.headers.map((header) => {
                      const value = row[header];
                      const isNumeric = typeof value === "number";
                      return (
                        <td
                          key={header}
                          className={`px-4 py-2.5 font-sans border-r border-white/5 ${
                            isNumeric ? "text-right font-mono text-emerald-400 font-semibold" : "text-left text-slate-300"
                          }`}
                        >
                          {value === undefined || value === null || value === "" ? (
                            <span className="text-slate-600 font-serif">-</span>
                          ) : (
                            value.toString()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {paginatedRows.length === 0 && (
                <tr>
                  <td colSpan={data.headers.length + 1} className="px-4 py-8 text-center text-slate-550 text-xs">
                    <div className="flex items-center justify-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-emerald-500/50" />
                      <span>未有匹配搜尋結果，請嘗試其他關鍵字</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 互動分頁導航 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1" id="table-pagination-controls">
          <span className="text-[11px] text-slate-500 font-sans">
            頁份 <span className="font-bold text-white font-mono">{currentPage}</span> / {totalPages} 頁
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border border-white/10 active:scale-95 transition-all text-slate-400 hover:text-emerald-405 bg-slate-950 disabled:opacity-20 disabled:pointer-events-none disabled:active:scale-100`}
              id="pagination-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border border-white/10 active:scale-95 transition-all text-slate-400 hover:text-emerald-405 bg-slate-950 disabled:opacity-20 disabled:pointer-events-none disabled:active:scale-100`}
              id="pagination-next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
