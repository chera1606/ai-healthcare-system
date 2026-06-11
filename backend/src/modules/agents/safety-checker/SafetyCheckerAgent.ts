import { getPool } from "../../../shared/database/pool.js";
import { ensureDatabase } from "../../../shared/database/init.js";
import type {
  SafetyCheckerInput,
  SafetyCheckerOutput,
  SafetyFlag
} from "./safetyChecker.types.js";
import {
  buildSafeFallbackResponse,
  calculateSafetyScore,
  ensureClinicianReview,
  ensureDisclaimer,
  pickResponseField
} from "./safetyChecker.utils.js";
import { evaluateSafetyRules } from "./safetyChecker.rules.js";

export class SafetyCheckerAgent {
  async checkResponse(input: SafetyCheckerInput): Promise<SafetyCheckerOutput> {
    const flags = evaluateSafetyRules(input);
    const hasHighSeverity = flags.some((flag) => flag.severity === "high");
    const hasMediumSeverity = flags.some((flag) => flag.severity === "medium");

    let safeResponse = input.aiResponse.trim();

    if (hasHighSeverity) {
      safeResponse = buildSafeFallbackResponse();
    } else {
      if (hasMediumSeverity) {
        safeResponse = ensureClinicianReview(safeResponse);
      }

      safeResponse = ensureDisclaimer(safeResponse);
    }

    const safetyScore = calculateSafetyScore(flags);
    const passed = !hasHighSeverity;
    const requiresHumanReview = hasHighSeverity || hasMediumSeverity;

    await this.saveSafetyCheck({
      patientId: input.patientId ?? null,
      agentUsed: input.agentUsed,
      userQuestion: input.userQuestion,
      aiResponse: safeResponse,
      passed,
      safetyScore,
      flags,
      requiresHumanReview
    });

    return {
      passed,
      safetyScore,
      flags,
      safeResponse,
      requiresHumanReview
    };
  }

  private async saveSafetyCheck(record: {
    patientId: number | null;
    agentUsed: string;
    userQuestion: string;
    aiResponse: string;
    safetyScore: number;
    passed: boolean;
    flags: SafetyFlag[];
    requiresHumanReview: boolean;
  }): Promise<void> {
    await ensureDatabase();

    await getPool().query(
      `
        INSERT INTO safety_checks (
          patient_id,
          agent_used,
          user_question,
          ai_response,
          safety_score,
          passed,
          flags,
          requires_human_review
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        record.patientId,
        record.agentUsed,
        record.userQuestion,
        record.aiResponse,
        record.safetyScore,
        record.passed,
        JSON.stringify(record.flags),
        record.requiresHumanReview
      ]
    );
  }
}

const safetyChecker = new SafetyCheckerAgent();

type SafetyResponsePayload = Record<string, unknown>;

export async function protectAgentResponse<T extends SafetyResponsePayload>(input: {
  patientId?: number;
  agentUsed: string;
  userQuestion: string;
  aiResponse?: string;
  sources?: unknown[];
  responsePayload: T;
}): Promise<T & { safetyCheck: SafetyCheckerOutput }> {
  const responseField = pickResponseField(input.responsePayload);
  const aiResponse =
    input.aiResponse ||
    (responseField ? String(input.responsePayload[responseField] ?? "") : "");

  const safetyCheck = await safetyChecker.checkResponse({
    patientId: input.patientId,
    agentUsed: input.agentUsed,
    userQuestion: input.userQuestion,
    aiResponse,
    sources: input.sources
  });

  const safePayload: Record<string, unknown> & { safetyCheck: SafetyCheckerOutput } = {
    ...input.responsePayload,
    safetyCheck
  };

  if (responseField) {
    safePayload[responseField] = safetyCheck.safeResponse;
  } else if (typeof safePayload.safeResponse !== "string") {
    safePayload.safeResponse = safetyCheck.safeResponse;
  }

  return safePayload as T & { safetyCheck: SafetyCheckerOutput };
}
