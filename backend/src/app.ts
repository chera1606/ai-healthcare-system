import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import reportRoutes from "./modules/rag/routes/report.routes.js";
import agentRoutes from "./modules/agents/routes/agents.routes.js";
import { searchSimilarReports } from "./modules/rag/repositories/search.repository.js";
import { generateEmbedding } from "./modules/rag/services/embeddings.js";
import { ReportExplainerAgent } from "./modules/agents/report-explainer/ReportExplainerAgent.js";
import { RiskAnalyzerAgent } from "./modules/agents/risk-analyzer/RiskAnalyzerAgent.js";
import { SupervisorAgent } from "./modules/agents/supervisor/SupervisorAgent.js";
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
app.use(morgan("dev"));
app.use("/api/reports", reportRoutes);
app.use("/api/agents", agentRoutes);

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

app.post("/api/chat", express.json({ limit: "10mb" }), async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
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

app.post("/api/rag-chat", express.json({ limit: "10mb" }), async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
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
    
    // Step 1: Use SupervisorAgent to route the message
    const supervisor = new SupervisorAgent();
    const routing = supervisor.routeMessage({ message: cleanMessage });
    console.log(`RAG Chat: Supervisor selected agent: ${routing.selectedAgent} (confidence: ${routing.confidence})`);
    
    // Step 2: Check if the selected agent is implemented
    if (!supervisor.isAgentImplemented(routing.selectedAgent)) {
      // Fallback: Use report_explainer with a message about the feature
      console.log(`RAG Chat: Agent ${routing.selectedAgent} not implemented, using report_explainer fallback`);
      
      const questionEmbedding = await generateEmbedding(cleanMessage);
      const relevantChunks = await searchSimilarReports(questionEmbedding.join(','), 5);
      const agent = new ReportExplainerAgent();
      const { answer, sources } = await agent.explainReport({
        question: cleanMessage,
        retrievedChunks: relevantChunks,
        patientId: undefined
      });
      
      return res.json({
        ok: true,
        selectedAgent: routing.selectedAgent,
        confidence: routing.confidence,
        reason: routing.reason,
        reply: `That specialist feature is not ready yet, but I can still help explain information from your uploaded report. This is informational and not medical advice.\n\n${answer}`,
        sources,
        disclaimer:
          "Informational support only. This system does not diagnose, treat, or replace professional medical advice."
      });
    }
    
    // Step 3: Generate embedding for the question
    const questionEmbedding = await generateEmbedding(cleanMessage);
    console.log(`RAG Chat: Generated embedding with ${questionEmbedding.length} dimensions`);
    
    // Step 4: Retrieve relevant chunks using vector similarity search
    const relevantChunks = await searchSimilarReports(questionEmbedding.join(','), 5);
    console.log(`RAG Chat: Retrieved ${relevantChunks.length} relevant chunks`);
    
    // Step 5: Route to the appropriate agent based on supervisor selection
    let result;
    if (routing.selectedAgent === 'risk_analyzer') {
      console.log(`RAG Chat: Routing to RiskAnalyzerAgent`);
      const riskAgent = new RiskAnalyzerAgent();
      result = await riskAgent.analyzeRisk({
        question: cleanMessage,
        retrievedChunks: relevantChunks,
        patientId: undefined
      });
      
      return res.json({
        ok: true,
        selectedAgent: routing.selectedAgent,
        confidence: routing.confidence,
        reason: routing.reason,
        reply: result.answer,
        risks: result.risks,
        sources: result.sources,
        disclaimer: result.disclaimer
      });
    } else {
      // Default to ReportExplainerAgent
      console.log(`RAG Chat: Routing to ReportExplainerAgent`);
      const agent = new ReportExplainerAgent();
      result = await agent.explainReport({
        question: cleanMessage,
        retrievedChunks: relevantChunks,
        patientId: undefined
      });
      
      return res.json({
        ok: true,
        selectedAgent: routing.selectedAgent,
        confidence: routing.confidence,
        reason: routing.reason,
        reply: result.answer,
        sources: result.sources,
        disclaimer:
          "Informational support only. This system does not diagnose, treat, or replace professional medical advice."
      });
    }
  } catch (error) {
    console.error("RAG Chat error:", error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "RAG Chat failed"
    });
  }
});

app.post("/api/agents/chat", express.json({ limit: "10mb" }), async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Message is required"
    });
  }

  const cleanMessage = message.trim();

  try {
    console.log(`Agents Chat: Processing message: "${cleanMessage}"`);
    
    // Step 1: Use SupervisorAgent to route the message
    const supervisor = new SupervisorAgent();
    const routing = supervisor.routeMessage({ message: cleanMessage });
    console.log(`Agents Chat: Supervisor selected agent: ${routing.selectedAgent} (confidence: ${routing.confidence})`);
    
    // Step 2: Check if the selected agent is implemented
    if (!supervisor.isAgentImplemented(routing.selectedAgent)) {
      // Fallback: Return a message about the feature not being ready
      console.log(`Agents Chat: Agent ${routing.selectedAgent} not implemented`);
      
      return res.json({
        ok: true,
        selectedAgent: routing.selectedAgent,
        confidence: routing.confidence,
        reason: routing.reason,
        reply: "That specialist feature is not ready yet, but I can still help explain information from your uploaded report. This is informational and not medical advice.",
        sources: [],
        disclaimer:
          "Informational support only. This system does not diagnose, treat, or replace professional medical advice."
      });
    }
    
    // Step 3: Generate embedding for the question
    const questionEmbedding = await generateEmbedding(cleanMessage);
    console.log(`Agents Chat: Generated embedding with ${questionEmbedding.length} dimensions`);
    
    // Step 4: Retrieve relevant chunks using vector similarity search
    const relevantChunks = await searchSimilarReports(questionEmbedding.join(','), 5);
    console.log(`Agents Chat: Retrieved ${relevantChunks.length} relevant chunks`);
    
    // Step 5: Route to the appropriate agent based on supervisor selection
    let result;
    if (routing.selectedAgent === 'risk_analyzer') {
      console.log(`Agents Chat: Routing to RiskAnalyzerAgent`);
      const riskAgent = new RiskAnalyzerAgent();
      result = await riskAgent.analyzeRisk({
        question: cleanMessage,
        retrievedChunks: relevantChunks,
        patientId: undefined
      });
      
      return res.json({
        ok: true,
        selectedAgent: routing.selectedAgent,
        confidence: routing.confidence,
        reason: routing.reason,
        reply: result.answer,
        risks: result.risks,
        sources: result.sources,
        disclaimer: result.disclaimer
      });
    } else {
      // Default to ReportExplainerAgent
      console.log(`Agents Chat: Routing to ReportExplainerAgent`);
      const agent = new ReportExplainerAgent();
      result = await agent.explainReport({
        question: cleanMessage,
        retrievedChunks: relevantChunks,
        patientId: undefined
      });
      
      return res.json({
        ok: true,
        selectedAgent: routing.selectedAgent,
        confidence: routing.confidence,
        reason: routing.reason,
        reply: result.answer,
        sources: result.sources,
        disclaimer:
          "Informational support only. This system does not diagnose, treat, or replace professional medical advice."
      });
    }
  } catch (error) {
    console.error("Agents Chat error:", error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Agents Chat failed"
    });
  }
});

app.post("/api/search", express.json({ limit: "10mb" }), async (req: Request, res: Response) => {
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
