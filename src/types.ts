export interface CSVRow {
  [key: string]: string | number;
}

export interface ParsedCSV {
  headers: string[];
  rows: CSVRow[];
  raw: string;
  numericColumns: string[];
  categoricalColumns: string[];
}

export interface SampleDataset {
  id: string;
  name: string;
  description: string;
  category: string;
  csv: string;
  suggestedQuestion?: string;
}

export interface AnalysisState {
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  result: string | null;
}
