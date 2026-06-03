import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import reportRoutes from "./routes/report.routes.js";
import { searchSimilarReports } from "./repositories/search.repository.js";
import { generateEmbedding } from "./services/embeddings.js";
import { generateRAGAnswer } from "./services/rag.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

interface ChatRequestBody {
  message?: string;
}

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/reports", reportRoutes);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "ai-healthcare-backend",
    message: "Backend is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/api", (_req: Request, res: Response) => {
  res.json({
    message: "AI Patient Care Intelligence System API"
  });
});

app.post("/api/chat", async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Message is required"
    });
  }

  const cleanMessage = message.trim();

  try {
    console.log(`General Chat: Processing message: "${cleanMessage}"`);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(cleanMessage);
    const reply = result.response.text();
    
    return res.json({
      ok: true,
      reply,
      disclaimer:
        "AI-generated content. Verify important information."
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Chat failed"
    });
  }
});

app.post("/api/rag-chat", async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Message is required"
    });
  }

  const cleanMessage = message.trim();

  try {
    console.log(`RAG Chat: Processing message: "${cleanMessage}"`);
    const reply = await generateRAGAnswer(cleanMessage);
    
    return res.json({
      ok: true,
      reply,
      disclaimer:
        "Informational support only. This system does not diagnose, treat, or replace professional medical advice."
    });
  } catch (error) {
    console.error("RAG Chat error:", error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "RAG Chat failed"
    });
  }
});

app.post("/api/search", async (req: Request, res: Response) => {
  const { query } = req.body || {};

  if (!query || typeof query !== "string" || !query.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Query is required"
    });
  }

  try {
    console.log(`Search query: "${query.trim()}"`);
    const embedding = await generateEmbedding(query.trim());
    console.log(`Generated embedding with ${embedding.length} dimensions`);
    const results = await searchSimilarReports(embedding.join(','), 5);
    console.log(`Retrieved ${results.length} chunks with similarity scores:`, results.map(r => r.similarity.toFixed(3)));

    res.json({
      ok: true,
      results,
      count: results.length
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Search failed"
    });
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    error: "Route not found"
  });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err instanceof Error) {
    if (
      err.message.includes("Only PDF, TXT, and image files are allowed") ||
      err.message.includes("File too large")
    ) {
      return res.status(400).json({
        ok: false,
        error: err.message
      });
    }
  }

  res.status(500).json({
    ok: false,
    error: "Internal server error"
  });
});

export default app;
