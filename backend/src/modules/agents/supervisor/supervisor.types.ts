// ============================================
// TypeScript Interfaces for SupervisorAgent
// ============================================

/**
 * Supported specialist agent types
 */
export type AgentType = 
  | 'report_explainer'
  | 'risk_analyzer'
  | 'care_plan'
  | 'emergency_escalator'
  | 'medication_checker'
  | 'timeline_memory'
  | 'conflict_detector';

/**
 * Input for the SupervisorAgent routing function
 */
export interface SupervisorInput {
  message: string;
  patientId?: string;
  reportId?: string;
}

/**
 * Output from the SupervisorAgent routing function
 */
export interface SupervisorOutput {
  selectedAgent: AgentType;
  confidence: number;
  reason: string;
}

/**
 * Routing rule for matching user messages to agents
 */
export interface RoutingRule {
  agent: AgentType;
  keywords: string[];
  priority: number; // Higher priority = checked first
  reason: string;
}
