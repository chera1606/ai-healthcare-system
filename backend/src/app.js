import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "ai-healthcare-backend",
    message: "Backend is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "AI Patient Care Intelligence System API"
  });
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    ok: false,
    error: "Internal server error"
  });
});

export default app;
