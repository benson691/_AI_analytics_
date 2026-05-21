import { ParsedCSV, CSVRow } from "../types";

/**
 * 簡易而強規的 CSV 控制/解析器，支援處理被雙引號包覆的逗號與半形字元。
 */
export function parseCSV(rawText: string): ParsedCSV {
  if (!rawText || !rawText.trim()) {
    return {
      headers: [],
      rows: [],
      raw: "",
      numericColumns: [],
      categoricalColumns: []
    };
  }

  // 整理換行符號
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) {
    return {
      headers: [],
      rows: [],
      raw: rawText,
      numericColumns: [],
      categoricalColumns: []
    };
  }

  // 分析單行 CSV 的輔助方法 (處理雙引號包覆逗號)
  function parseLine(line: string): string[] {
    const result: string[] = [];
    let currentValue = "";
    let insideQuote = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === "," && !insideQuote) {
        result.push(currentValue.trim());
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    result.push(currentValue.trim());

    // 去除前後多餘的引號
    return result.map(val => {
      let trimmed = val;
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        trimmed = trimmed.substring(1, trimmed.length - 1);
      }
      return trimmed;
    });
  }

  const rawHeaders = parseLine(lines[0]);
  // 過濾重複或空白的標頭名
  const headers = rawHeaders.map((h, index) => h.trim() || `欄位_${index + 1}`);

  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    const rowObj: CSVRow = {};
    
    headers.forEach((header, index) => {
      const rawValue = cells[index] !== undefined ? cells[index] : "";
      
      // 嘗試轉換為數字，以便進行視覺化
      const cleanNumStr = rawValue.replace(/[\$,%]/g, "").trim();
      const numValue = Number(cleanNumStr);
      
      if (rawValue !== "" && !isNaN(numValue)) {
        rowObj[header] = numValue;
      } else {
        rowObj[header] = rawValue;
      }
    });
    rows.push(rowObj);
  }

  // 自動分類數值與類別型欄位
  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];

  headers.forEach(header => {
    let numericCount = 0;
    let totalValueCount = 0;

    rows.forEach(row => {
      const val = row[header];
      if (val !== undefined && val !== null && val !== "") {
        totalValueCount++;
        if (typeof val === "number") {
          numericCount++;
        }
      }
    });

    // 如果該欄位超過 60% 且至少有數據是數字，則將其視為數值欄位
    if (totalValueCount > 0 && (numericCount / totalValueCount) >= 0.6) {
      numericColumns.push(header);
    } else {
      categoricalColumns.push(header);
    }
  });

  return {
    headers,
    rows,
    raw: rawText,
    numericColumns,
    categoricalColumns
  };
}
