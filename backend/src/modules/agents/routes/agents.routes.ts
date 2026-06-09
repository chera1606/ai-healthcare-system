import express, { Router, type Request, type Response } from "express";
import { getSupervisor } from "../supervisor/supervisor.service.js";
import { TimelineMemoryAgent } from "../timeline-memory/agent.service.js";
import type { AgentContext } from "../../../types/agent.types.js";
import { protectAgentResponse } from "../safety-checker/SafetyCheckerAgent.js";

const router = Router();

router.use(express.json({ limit: "10mb" }));

interface AgentRequestBody {
  message: string;
  userId?: number;
  patientData?: any;
}

// Initialize agents on module load
let supervisorInitialized = false;

function ensureSupervisorInitialized() {
  if (!supervisorInitialized) {
    // Import and initialize agents
    const { initializeAgents } = require("../index.js");
    initializeAgents();
    supervisorInitialized = true;
  }
}

router.post("/chat", async (req: Request<{}, {}, AgentRequestBody>, res: Response) => {
  const { message, userId, patientData } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Message is required"
    });
  }

  const cleanMessage = message.trim();

  try {
    ensureSupervisorInitialized();
    
    const supervisor = getSupervisor();
    
    // Build context
    const context: AgentContext = {
      userId: userId,
      patientData: patientData
    };
    
    // Process request through supervisor
    const response = await supervisor.processRequest(cleanMessage, context);
    
    // Store message in timeline memory
    if (userId) {
      TimelineMemoryAgent.addMessage(userId, {
        role: 'user',
        content: cleanMessage,
        timestamp: new Date().toISOString(),
        agentUsed: response.agentUsed
      });
      
      if (response.success) {
        TimelineMemoryAgent.addMessage(userId, {
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toISOString(),
          agentUsed: response.agentUsed
        });
      }
    }

    const safeResponse = await protectAgentResponse({
      patientId: userId,
      agentUsed: response.agentUsed,
      userQuestion: cleanMessage,
      aiResponse: response.message,
      sources: Array.isArray(response.data?.sources) ? response.data.sources : undefined,
      responsePayload: {
        ok: true,
        reply: response.message,
        data: response.data,
        agentUsed: response.agentUsed,
        confidence: response.confidence,
        disclaimer: "AI-generated content. Verify important information."
      }
    });

    return res.json(safeResponse);
  } catch (error) {
    console.error("Agent chat error:", error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Agent processing failed"
    });
  }
});

router.get("/agents", (_req: Request, res: Response) => {
  ensureSupervisorInitialized();
  const supervisor = getSupervisor();
  
  return res.json({
    ok: true,
    agents: supervisor.getRegisteredAgents()
  });
});

export default router;
