// Agent System Initialization
import { getSupervisor } from "./supervisor/supervisor.service.js";
import { ReportExplainerAgent } from "./report-explainer/agent.service.js";
import { DoctorVoiceAnalyzerAgent } from "./doctor-voice-analyzer/agent.service.js";
import { CarePlanGeneratorAgent } from "./care-plan-generator/agent.service.js";
import { HospitalFinderAgent } from "./hospital-finder/agent.service.js";
import { RiskAnalysisAgent } from "./risk-analysis/agent.service.js";
import { TimelineMemoryAgent } from "./timeline-memory/agent.service.js";

export function initializeAgents() {
  const supervisor = getSupervisor();
  
  // Register all agents
  supervisor.registerAgent(new ReportExplainerAgent());
  supervisor.registerAgent(new DoctorVoiceAnalyzerAgent());
  supervisor.registerAgent(new CarePlanGeneratorAgent());
  supervisor.registerAgent(new HospitalFinderAgent());
  supervisor.registerAgent(new RiskAnalysisAgent());
  supervisor.registerAgent(new TimelineMemoryAgent());
  
  console.log("Agent System: All agents registered successfully");
  console.log("Registered agents:", supervisor.getRegisteredAgents());
  
  return supervisor;
}

export { getSupervisor } from "./supervisor/supervisor.service.js";
