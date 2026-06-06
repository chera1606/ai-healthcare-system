import type { Agent, AgentContext, AgentResponse, ConversationMessage } from "../../../types/agent.types.js";

// Simple in-memory storage for conversation history
// In production, this would use a database
const conversationHistory: Map<string, ConversationMessage[]> = new Map();

export class TimelineMemoryAgent implements Agent {
  name = "timeline-memory";
  description = "Remembers conversation history and patient timeline";

  canHandle(request: string): boolean {
    const keywords = [
      "remember", "history", "timeline", "what did we discuss", "previous",
      "earlier", "conversation", "what did i say", "summary", "recall"
    ];
    
    const lowerRequest = request.toLowerCase();
    return keywords.some(keyword => lowerRequest.includes(keyword));
  }

  async process(request: string, context?: AgentContext): Promise<AgentResponse> {
    console.log(`TimelineMemoryAgent: Processing request: "${request}"`);

    try {
      const userId = String(context?.userId || "default");
      
      // Get conversation history for this user
      const history = conversationHistory.get(userId) || [];
      
      if (history.length === 0) {
        return {
          success: true,
          data: { history: [], summary: "No conversation history available" },
          message: "No conversation history found",
          confidence: 1.0,
          agentUsed: this.name
        };
      }

      // Generate a summary of the conversation
      const summary = this.generateSummary(history);
      
      return {
        success: true,
        data: { 
          history: history,
          summary: summary,
          messageCount: history.length
        },
        message: `Retrieved ${history.length} messages from conversation history`,
        confidence: 0.9,
        agentUsed: this.name
      };
    } catch (error) {
      console.error("TimelineMemoryAgent: Error processing request:", error);
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : "Failed to retrieve conversation history",
        confidence: 0,
        agentUsed: this.name
      };
    }
  }

  private generateSummary(history: ConversationMessage[]): string {
    const userMessages = history.filter(m => m.role === 'user');
    const assistantMessages = history.filter(m => m.role === 'assistant');
    
    return `Conversation Summary:
- Total messages: ${history.length}
- User messages: ${userMessages.length}
- Assistant responses: ${assistantMessages.length}
- First message: ${history[0].timestamp}
- Last message: ${history[history.length - 1].timestamp}

Topics discussed based on recent messages:
${assistantMessages.slice(-3).map(m => `- ${m.content.substring(0, 100)}...`).join('\n')}`;
  }

  // Helper method to add message to history
  static addMessage(userId: string | number, message: ConversationMessage): void {
    const userIdStr = String(userId);
    const history = conversationHistory.get(userIdStr) || [];
    history.push(message);
    conversationHistory.set(userIdStr, history);
    
    // Keep only last 50 messages to prevent memory issues
    if (history.length > 50) {
      history.shift();
    }
  }

  // Helper method to get history
  static getHistory(userId: string | number): ConversationMessage[] {
    const userIdStr = String(userId);
    return conversationHistory.get(userIdStr) || [];
  }
}
