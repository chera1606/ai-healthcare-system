import type { Agent, AgentContext, AgentResponse } from "../../../types/agent.types.js";

export class HospitalFinderAgent implements Agent {
  name = "hospital-finder";
  description = "Finds nearby hospitals and provides information about healthcare facilities";

  canHandle(request: string): boolean {
    const keywords = [
      "hospital", "clinic", "doctor", "healthcare", "medical center",
      "nearby hospital", "find hospital", "where is hospital", "hospital near me",
      "emergency room", "urgent care", "healthcare facility"
    ];
    
    const lowerRequest = request.toLowerCase();
    return keywords.some(keyword => lowerRequest.includes(keyword));
  }

  async process(request: string, context?: AgentContext): Promise<AgentResponse> {
    console.log(`HospitalFinderAgent: Processing request: "${request}"`);

    try {
      // For now, this is a simple implementation
      // In a full implementation, this would use a hospital database and location services
      
      const response = `I can help you find hospitals. Here are some general recommendations:

1. For emergencies: Call emergency services (911 in US) or go to the nearest emergency room
2. For non-emergency care: Consider urgent care centers or your primary care physician
3. For specialized care: Contact your insurance provider for in-network facilities

To provide specific hospital recommendations, I would need:
- Your location (city, zip code, or current location)
- Type of care needed (emergency, specialist, general)
- Insurance information (if applicable)

Please provide your location and I can give you more specific recommendations.`;

      return {
        success: true,
        data: { 
          hospitals: [],
          message: response
        },
        message: "Provided hospital finding guidance",
        confidence: 0.7,
        agentUsed: this.name
      };
    } catch (error) {
      console.error("HospitalFinderAgent: Error processing request:", error);
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : "Failed to find hospitals",
        confidence: 0,
        agentUsed: this.name
      };
    }
  }
}
