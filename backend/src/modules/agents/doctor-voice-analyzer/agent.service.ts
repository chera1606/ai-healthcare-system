import type { Agent, AgentContext, AgentResponse } from "../../../types/agent.types.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }
  return genAI;
}

export class DoctorVoiceAnalyzerAgent implements Agent {
  name = "doctor-voice-analyzer";
  description = "Analyzes doctor's voice notes to extract medications, instructions, warnings, and follow-up tasks";

  canHandle(request: string): boolean {
    const keywords = [
      "doctor said", "doctor note", "voice note", "doctor told me",
      "doctor mentioned", "doctor instructed", "doctor prescribed",
      "doctor's advice", "what did the doctor say"
    ];
    
    const lowerRequest = request.toLowerCase();
    return keywords.some(keyword => lowerRequest.includes(keyword));
  }

  async process(request: string, context?: AgentContext): Promise<AgentResponse> {
    console.log(`DoctorVoiceAnalyzerAgent: Processing request: "${request}"`);

    try {
      const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `You are a medical assistant analyzing doctor's notes. Extract the following information from the text:
      
Text: ${request}

Extract and return in JSON format:
{
  "medications": [],
  "instructions": [],
  "warnings": [],
  "followUpTasks": []
}

If information is not available, return empty arrays for that field.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      return {
        success: true,
        data: { analysis: response },
        message: "Successfully analyzed doctor's note",
        confidence: 0.8,
        agentUsed: this.name
      };
    } catch (error) {
      console.error("DoctorVoiceAnalyzerAgent: Error processing request:", error);
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : "Failed to analyze doctor's note",
        confidence: 0,
        agentUsed: this.name
      };
    }
  }
}
