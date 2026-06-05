import type { Agent, AgentContext, AgentResponse, SupervisorConfig } from "../../../types/agent.types.js";

export class Supervisor {
  private agents: Agent[] = [];
  private config: SupervisorConfig;

  constructor(config: SupervisorConfig = {
    defaultAgent: 'report-explainer',
    enableMultiAgent: false,
    maxConfidenceThreshold: 0.7
  }) {
    this.config = config;
  }

  registerAgent(agent: Agent): void {
    this.agents.push(agent);
    console.log(`Supervisor: Registered agent "${agent.name}"`);
  }

  async processRequest(request: string, context?: AgentContext): Promise<AgentResponse> {
    console.log(`Supervisor: Processing request: "${request}"`);

    // Step 1: Find the best agent for this request
    const selectedAgent = this.selectAgent(request);
    
    if (!selectedAgent) {
      return {
        success: false,
        data: null,
        message: "No agent available to handle this request",
        confidence: 0,
        agentUsed: "none"
      };
    }

    console.log(`Supervisor: Selected agent "${selectedAgent.name}"`);

    try {
      // Step 2: Process the request with the selected agent
      const response = await selectedAgent.process(request, context);
      
      console.log(`Supervisor: Agent "${selectedAgent.name}" completed with confidence: ${response.confidence}`);
      
      return response;
    } catch (error) {
      console.error(`Supervisor: Agent "${selectedAgent.name}" failed:`, error);
      
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : "Agent processing failed",
        confidence: 0,
        agentUsed: selectedAgent.name
      };
    }
  }

  private selectAgent(request: string): Agent | null {
    let bestAgent: Agent | null = null;
    let highestScore = 0;

    for (const agent of this.agents) {
      if (agent.canHandle(request)) {
        // For now, we use a simple boolean check
        // In a more sophisticated system, we could score agents
        if (!bestAgent) {
          bestAgent = agent;
          highestScore = 1;
        }
      }
    }

    // If no agent can handle, use default if available
    if (!bestAgent && this.config.defaultAgent) {
      bestAgent = this.agents.find(a => a.name === this.config.defaultAgent) || null;
    }

    return bestAgent;
  }

  getRegisteredAgents(): string[] {
    return this.agents.map(a => a.name);
  }
}

// Singleton instance
let supervisorInstance: Supervisor | null = null;

export function getSupervisor(): Supervisor {
  if (!supervisorInstance) {
    supervisorInstance = new Supervisor();
  }
  return supervisorInstance;
}
