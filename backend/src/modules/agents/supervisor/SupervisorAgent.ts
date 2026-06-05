import { SupervisorInput, SupervisorOutput } from './supervisor.types.js';
import { ROUTING_RULES, DEFAULT_AGENT } from './routing.rules.js';

// ============================================
// SupervisorAgent Class
// ============================================

/**
 * SupervisorAgent routes user messages to the appropriate specialist agent
 * based on rule-based keyword matching with priority ordering
 * 
 * This agent acts as a traffic controller, determining which specialist
 * should handle each user request based on the content of the message.
 */
export class SupervisorAgent {
  /**
   * Routes a user message to the appropriate specialist agent
   * 
   * @param input - Contains the user message and optional patient/report IDs
   * @returns The selected agent, confidence score, and reasoning
   */
  routeMessage(input: SupervisorInput): SupervisorOutput {
    const { message } = input;
    const normalizedMessage = message.toLowerCase().trim();

    console.log(`SupervisorAgent: Routing message: "${message}"`);

    // Sort rules by priority (higher priority = checked first)
    const sortedRules = [...ROUTING_RULES].sort((a, b) => a.priority - b.priority);

    // Check each rule in priority order
    for (const rule of sortedRules) {
      // Check if any keyword from this rule matches the message
      const matchedKeyword = rule.keywords.find(keyword => 
        normalizedMessage.includes(keyword.toLowerCase())
      );

      if (matchedKeyword) {
        console.log(`SupervisorAgent: Matched keyword "${matchedKeyword}" -> ${rule.agent}`);
        
        // Calculate confidence based on how specific the match is
        const confidence = this.calculateConfidence(normalizedMessage, rule.keywords);

        return {
          selectedAgent: rule.agent,
          confidence,
          reason: rule.reason
        };
      }
    }

    // If no rules match, use the default agent
    console.log(`SupervisorAgent: No rules matched, using default agent: ${DEFAULT_AGENT}`);
    
    return {
      selectedAgent: DEFAULT_AGENT,
      confidence: 0.5, // Lower confidence for default fallback
      reason: 'No specific routing rules matched, using default report explainer.'
    };
  }

  /**
   * Calculates confidence score based on keyword match specificity
   * 
   * @param message - The normalized user message
   * @param keywords - The keywords from the matched rule
   * @returns Confidence score between 0 and 1
   */
  private calculateConfidence(message: string, keywords: string[]): number {
    // Count how many keywords from the rule match the message
    const matchCount = keywords.filter(keyword => 
      message.includes(keyword.toLowerCase())
    ).length;

    // Base confidence is 0.6 for a single match
    // Increase confidence for multiple keyword matches
    const baseConfidence = 0.6;
    const bonusPerMatch = 0.1;
    
    const confidence = Math.min(baseConfidence + (matchCount * bonusPerMatch), 0.95);

    return confidence;
  }

  /**
   * Checks if an agent is implemented and ready to use
   * 
   * @param agent - The agent type to check
   * @returns True if the agent is implemented
   */
  isAgentImplemented(agent: string): boolean {
    // Currently only report_explainer is implemented
    // Other agents will be added in future tasks
    const implementedAgents = ['report_explainer'];
    return implementedAgents.includes(agent);
  }
}
