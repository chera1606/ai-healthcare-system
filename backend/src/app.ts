import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";

const app = express();
const uploadsDir = path.resolve("uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  })
});

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

type UploadRequest = Request & {
  file?: Express.Multer.File;
};

app.post("/api/reports/upload", upload.single("report"), (req: UploadRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      ok: false,
      error: "Report file is required"
    });
  }

  return res.json({
    ok: true,
    message: "Report uploaded successfully",
    file: {
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    }
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
  res.status(500).json({
    ok: false,
    error: "Internal server error"
  });
});

export default app;
