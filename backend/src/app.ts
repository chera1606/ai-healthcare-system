import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import reportRoutes from "./routes/report.routes.js";

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

app.post("/api/chat", (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Message is required"
    });
  }

  const cleanMessage = message.trim();

  return res.json({
    ok: true,
    reply: `I received your message: "${cleanMessage}". This is the first chat endpoint and will later be connected to real AI.`,
    disclaimer:
      "Informational support only. This system does not diagnose, treat, or replace professional medical advice."
  });
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
