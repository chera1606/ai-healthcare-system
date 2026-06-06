import type { Agent, AgentContext, AgentResponse } from "../../../types/agent.types.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }
  return genAI;
}

export class CarePlanGeneratorAgent implements Agent {
  name = "care-plan-generator";
  description = "Generates personalized care plans based on medical data and conditions";

  canHandle(request: string): boolean {
    const keywords = [
      "care plan", "treatment plan", "what should i do", "how to manage",
      "daily routine", "self care", "care instructions", "treatment",
      "management plan", "health plan", "wellness plan"
    ];
    
    const lowerRequest = request.toLowerCase();
    return keywords.some(keyword => lowerRequest.includes(keyword));
  }

  async process(request: string, context?: AgentContext): Promise<AgentResponse> {
    console.log(`CarePlanGeneratorAgent: Processing request: "${request}"`);

    try {
      const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const patientData = context?.patientData || "No patient data provided";
      
      const prompt = `You are a healthcare assistant generating a personalized care plan.

Patient Data: ${JSON.stringify(patientData)}

User Request: ${request}

Generate a comprehensive care plan that includes:
1. Daily routine
2. Medication schedule
3. Dietary recommendations
4. Exercise recommendations
5. Monitoring requirements
6. Warning signs to watch for
7. Follow-up appointments

Provide clear, actionable steps. If specific information is missing, provide general recommendations and note what additional information would be helpful.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      return {
        success: true,
        data: { carePlan: response },
        message: "Successfully generated care plan",
        confidence: 0.85,
        agentUsed: this.name
      };
    } catch (error) {
      console.error("CarePlanGeneratorAgent: Error processing request:", error);
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : "Failed to generate care plan",
        confidence: 0,
        agentUsed: this.name
      };
    }
  }
}
