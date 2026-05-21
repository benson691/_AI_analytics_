import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use increased payload limit for larger CSV pasting
  app.use(express.json({ limit: "25mb" }));

  // Initialize Gemini AI
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API route for CSV data analysis
  app.post("/api/analyze", async (req: express.Request, res: express.Response) => {
    try {
      const { csvData, question, systemInstruction } = req.body;
      if (!csvData || typeof csvData !== "string") {
        return res.status(400).json({ error: "CSV 資料不可為空且必須是文字格式" });
      }

      const prompt = `
這是使用者貼上要進行分析的 CSV 格式報表資料：
\`\`\`csv
${csvData}
\`\`\`

${question ? `針對這份資料，使用者提出了以下想要特別分析的問題或自訂重點：
=== 使用者提問/指引分析目標 ===
${question}
===
` : "請對此 CSV 報表進行完整的專業數據分析與商業洞察撰寫。"}

請根據 CSV 資料，用繁體中文撰寫一份高水準、專業、分析透徹的數據洞察報告。
報告內容應包含（但不限於）：
1. 🗂️ 數據摘要與概要指標：描述這份資料的主題、資料列數、欄位架構、關鍵指標（如平均值、總和、最大/最小值等，若適用）。
2. 📈 核心趨勢與發現：從資料中觀察到的深層商業趨勢、異常點（Anomalies）或週期性規律。
3. 💡 關鍵痛點與機會點：從數據中發掘的問題（例如業績下滑、高退貨率、行銷轉換偏低）或值得放大的商機。
4. 🛠️ 行動與改善建議：提出至少 3 個具備可行性、具體的商業策略、戰術規劃或具體行動建議。

請以排版精美、結構分明的 Markdown 格式返回。請善用 Markdown 的表格、粗體字與引用區塊（blockquotes）來大幅提升可讀性。
`;

      const sysInstruction = systemInstruction || "你是一位資深的專業數據分析師與商業決策顧問。善於解讀各式報表、挖掘關鍵洞察（Insights）並轉化為具體的改善建議。你的分析必須完全基於事實，客觀、嚴謹且極具商業價值。請務必使用中文「繁體中文（台灣）」進行回覆與報告撰寫。";

      const r = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.2, // Lower temperature is best for analytic and data reasoning
        }
      });

      const responseText = r.text;
      res.json({ result: responseText });
    } catch (e: any) {
      console.error("Gemini AI API Error:", e);
      res.status(500).json({ error: e?.message || "AI 分析呼叫失敗，請確認你的 API 密鑰設置正確。" });
    }
  });

  // Serve static files / Vite HMR
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Express server running on port ${PORT}`);
  });
}

startServer().catch((e) => {
  console.error("Failed to start server:", e);
});
