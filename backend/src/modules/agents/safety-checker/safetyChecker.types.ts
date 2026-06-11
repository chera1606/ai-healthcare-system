export type SafetySeverity = "low" | "medium" | "high";

export interface SafetyFlag {
  type: string;
  severity: SafetySeverity;
  message: string;
}

export interface SafetyCheckerInput {
  patientId?: number;
  agentUsed: string;
  userQuestion: string;
  aiResponse: string;
  sources?: unknown[];
}

export interface SafetyCheckerOutput {
  passed: boolean;
  safetyScore: number;
  flags: SafetyFlag[];
  safeResponse: string;
  requiresHumanReview: boolean;
}

export interface SafetyCheckPersistedRecord extends SafetyCheckerOutput {
  patientId: number | null;
  agentUsed: string;
  userQuestion: string;
  aiResponse: string;
}

