// Agent System Type Definitions

export interface Agent {
  name: string;
  description: string;
  canHandle(request: string): boolean;
  process(request: string, context?: AgentContext): Promise<AgentResponse>;
}

export interface AgentContext {
  userId?: number;
  conversationHistory?: ConversationMessage[];
  patientData?: any;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  success: boolean;
  data: any;
  message: string;
  confidence: number;
  agentUsed: string;
  metadata?: Record<string, any>;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentUsed?: string;
}

export interface SupervisorConfig {
  defaultAgent?: string;
  enableMultiAgent: boolean;
  maxConfidenceThreshold: number;
}
