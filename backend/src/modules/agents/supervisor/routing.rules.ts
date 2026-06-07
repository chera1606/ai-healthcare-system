import { RoutingRule } from './supervisor.types.js';

// ============================================
// Routing Rules for SupervisorAgent
// ============================================

/**
 * Defines routing rules for matching user messages to specialist agents
 * Rules are checked in order of priority (higher priority = checked first)
 * Emergency rules have highest priority to ensure urgent cases are caught first
 */
export const ROUTING_RULES: RoutingRule[] = [
  // EMERGENCY ESCALATOR - Highest Priority (Priority 1)
  // These keywords indicate potentially life-threatening situations
  {
    agent: 'emergency_escalator',
    keywords: [
      'chest pain',
      'can\'t breathe',
      'emergency',
      'severe pain',
      'fainting',
      'heart attack',
      'stroke',
      'bleeding',
      'unconscious',
      'call 911',
      'call ambulance'
    ],
    priority: 1,
    reason: 'The user is reporting symptoms that may indicate a medical emergency.'
  },

  // RISK ANALYZER - High Priority (Priority 2)
  // These keywords relate to understanding health risks and abnormal values
  {
    agent: 'risk_analyzer',
    keywords: [
      'risk',
      'danger',
      'high',
      'low',
      'normal',
      'abnormal',
      'blood pressure',
      'cholesterol',
      'glucose',
      'blood sugar',
      'elevated',
      'concern',
      'worry',
      'warning'
    ],
    priority: 2,
    reason: 'The user is asking about health risks or whether values are normal/abnormal.'
  },

  // TIMELINE MEMORY - High Priority (Priority 2)
  // These keywords relate to tracking changes over time and trends
  {
    agent: 'timeline_memory',
    keywords: [
      'changed over time',
      'trend',
      'history',
      'improved',
      'worse',
      'better',
      'compare',
      'between reports',
      'since my last report',
      'has my',
      'is my'
    ],
    priority: 2,
    reason: 'The user is asking about changes over time or trends in their health data.'
  },

  // MEDICATION CHECKER - Medium Priority (Priority 3)
  // These keywords relate to medications and dosages
  {
    agent: 'medication_checker',
    keywords: [
      'medicine',
      'medication',
      'drug',
      'dose',
      'dosage',
      'pill',
      'prescription',
      'taking',
      'side effect',
      'interaction'
    ],
    priority: 3,
    reason: 'The user is asking about medications or prescriptions.'
  },

  // CARE PLAN - Medium Priority (Priority 4)
  // These keywords relate to next steps and follow-up actions
  {
    agent: 'care_plan',
    keywords: [
      'what should i do',
      'next step',
      'care plan',
      'follow up',
      'recommendation',
      'advice',
      'treatment',
      'action',
      'plan'
    ],
    priority: 4,
    reason: 'The user is asking for recommendations or next steps.'
  },

  // REPORT EXPLAINER - Default/Lowest Priority (Priority 5)
  // These keywords relate to understanding report content
  // This is the fallback agent if no other rules match
  {
    agent: 'report_explainer',
    keywords: [
      'explain',
      'mean',
      'what is',
      'summarize',
      'report',
      'result',
      'test',
      'lab',
      'reading',
      'value',
      'understand',
      'tell me',
      'show me'
    ],
    priority: 5,
    reason: 'The user is asking to understand information from their medical report.'
  }
];

/**
 * Default agent to use if no rules match
 */
export const DEFAULT_AGENT: 'report_explainer' = 'report_explainer';
