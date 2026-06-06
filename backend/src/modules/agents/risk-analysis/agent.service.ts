import type { Agent, AgentContext, AgentResponse } from "../../../types/agent.types.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }
  return genAI;
}

export class RiskAnalysisAgent implements Agent {
  name = "risk-analysis";
  description = "Analyzes health risks based on medical data and history";

  canHandle(request: string): boolean {
    const keywords = [
      "risk", "danger", "warning", "concern", "health risk",
      "am i at risk", "risk factors", "health concern", "should i worry",
      "complications", "side effects", "health assessment"
    ];
    
    const lowerRequest = request.toLowerCase();
    return keywords.some(keyword => lowerRequest.includes(keyword));
  }

  async process(request: string, context?: AgentContext): Promise<AgentResponse> {
    console.log(`RiskAnalysisAgent: Processing request: "${request}"`);

    try {
      const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const patientData = context?.patientData || "No patient data provided";
      
      const prompt = `You are a healthcare risk assessment assistant.

Patient Data: ${JSON.stringify(patientData)}

User Request: ${request}

Analyze potential health risks and provide:
1. Identified risk factors
2. Likelihood of complications (low/medium/high)
3. Preventive measures
4. Warning signs to watch for
5. When to seek medical attention

Provide clear, evidence-based information. Always include a disclaimer that this is not medical advice and the user should consult with their healthcare provider.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      return {
        success: true,
        data: { riskAnalysis: response },
        message: "Successfully analyzed health risks",
        confidence: 0.8,
        agentUsed: this.name
      };
    } catch (error) {
      console.error("RiskAnalysisAgent: Error processing request:", error);
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : "Failed to analyze health risks",
        confidence: 0,
        agentUsed: this.name
      };
    }
  }
}
