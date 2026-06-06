import type { Agent, AgentContext, AgentResponse } from "../../../types/agent.types.js";
import { generateRAGAnswer } from "../../rag/services/rag.js";

export class ReportExplainerAgent implements Agent {
  name = "report-explainer";
  description = "Explains medical reports in simple language using RAG";

  canHandle(request: string): boolean {
    const keywords = [
      "explain", "report", "blood test", "lab result", "medical report",
      "test result", "diagnosis", "what does this mean", "understand"
    ];
    
    const lowerRequest = request.toLowerCase();
    return keywords.some(keyword => lowerRequest.includes(keyword));
  }

  async process(request: string, context?: AgentContext): Promise<AgentResponse> {
    console.log(`ReportExplainerAgent: Processing request: "${request}"`);

    try {
      // Use the existing RAG system to generate an answer
      const answer = await generateRAGAnswer(request);

      return {
        success: true,
        data: { explanation: answer },
        message: "Successfully explained medical report",
        confidence: 0.85,
        agentUsed: this.name
      };
    } catch (error) {
      console.error("ReportExplainerAgent: Error processing request:", error);
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : "Failed to explain report",
        confidence: 0,
        agentUsed: this.name
      };
    }
  }
}
