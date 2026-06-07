/**
 * TimelineMemoryAgent - Explains patient health history over time
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  TimelineMemoryInput,
  TimelineMemoryOutput,
  Trend,
  ObservationSource
} from './timelineMemory.types';
import { TIMELINE_EXPLANATION_PROMPT } from './timelineMemory.prompt';
import {
  detectTimelineObservationKeys,
  createTrend,
  formatObservationValue
} from './timelineMemory.utils';
import {
  getObservationHistoryByKeys,
  getLatestAndPreviousObservation
} from '../../observations/observations.repository';

export class TimelineMemoryAgent {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Main method to analyze timeline and generate explanation
   */
  async analyzeTimeline(input: TimelineMemoryInput): Promise<TimelineMemoryOutput> {
    console.log(`TimelineMemoryAgent: Analyzing timeline for patient ${input.patientId}`);
    console.log(`TimelineMemoryAgent: Question: "${input.question}"`);

    // Step 1: Determine relevant observation keys
    const observationKeys = input.observationKeys || detectTimelineObservationKeys(input.question);
    console.log(`TimelineMemoryAgent: Relevant observation keys: ${observationKeys.join(', ')}`);

    // Step 2: Get observation history
    const observations = await getObservationHistoryByKeys(input.patientId, observationKeys);
    console.log(`TimelineMemoryAgent: Found ${observations.length} observations`);

    if (observations.length === 0) {
      return this.createNoDataResponse();
    }

    // Step 3: Group observations by key
    const observationsByKey = new Map<string, any[]>();
    for (const obs of observations) {
      const key = obs.observation_key;
      if (!observationsByKey.has(key)) {
        observationsByKey.set(key, []);
      }
      observationsByKey.get(key)!.push(obs);
    }

    // Step 4: Calculate trends for each key
    const trends: Trend[] = [];
    for (const [key, obsList] of observationsByKey) {
      // Sort by observed_at ASC
      obsList.sort((a, b) => new Date(a.observed_at).getTime() - new Date(b.observed_at).getTime());

      // Get latest and previous
      const latest = obsList[obsList.length - 1];
      const previous = obsList.length > 1 ? obsList[obsList.length - 2] : null;

      const trend = createTrend(key, previous, latest);
      trends.push(trend);

      console.log(`TimelineMemoryAgent: Trend for ${key}: ${trend.changeDirection}`);
    }

    // Step 5: Create sources
    const sources = this.createSources(observations);

    // Step 6: Generate explanation using Gemini
    const answer = await this.generateExplanation(input.question, trends);

    // Step 7: Calculate confidence
    const confidence = this.calculateConfidence(trends);

    return {
      answer,
      trends,
      sources,
      confidence,
      disclaimer: 'This is informational and not medical advice. Please discuss findings with a qualified clinician.'
    };
  }

  /**
   * Creates response when no observations are found
   */
  private createNoDataResponse(): TimelineMemoryOutput {
    return {
      answer: 'No medical observations were found for this patient. Please upload a medical report first.',
      trends: [],
      sources: [],
      confidence: 0,
      disclaimer: 'This is informational and not medical advice. Please discuss findings with a qualified clinician.'
    };
  }

  /**
   * Creates source citations from observations
   */
  private createSources(observations: any[]): ObservationSource[] {
    const sources: ObservationSource[] = [];
    const seenNormalizedText = new Set<string>();

    for (const obs of observations) {
      // Use normalized source text for deduplication
      const normalizedText = obs.source_text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
      
      // Deduplicate by normalized text only
      if (seenNormalizedText.has(normalizedText)) continue;
      seenNormalizedText.add(normalizedText);

      sources.push({
        sourceType: 'observation',
        reportId: obs.report_id,
        observationKey: obs.observation_key,
        textPreview: obs.source_text.substring(0, 200) + (obs.source_text.length > 200 ? '...' : ''),
        observedAt: obs.observed_at,
        confidence: obs.confidence
      });
    }

    return sources;
  }

  /**
   * Generates explanation using Gemini AI
   */
  private async generateExplanation(question: string, trends: Trend[]): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build trends summary string
    const trendsSummary = trends.map(t => 
      `${t.observationKey}: latest=${t.latestValue} (${t.latestObservedAt}), previous=${t.previousValue || 'none'} (${t.previousObservedAt || 'none'}), direction=${t.changeDirection}`
    ).join('\n');

    const prompt = TIMELINE_EXPLANATION_PROMPT(question, trendsSummary);

    console.log(`TimelineMemoryAgent: Sending prompt to Gemini`);
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return reply;
  }

  /**
   * Calculates confidence based on number of trends and data quality
   */
  private calculateConfidence(trends: Trend[]): number {
    if (trends.length === 0) return 0;

    let totalConfidence = 0;
    for (const trend of trends) {
      if (trend.changeDirection === 'unknown') {
        totalConfidence += 0.5; // Lower confidence for unknown trends
      } else {
        totalConfidence += 0.9; // High confidence for calculated trends
      }
    }

    return totalConfidence / trends.length;
  }
}
