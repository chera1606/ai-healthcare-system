// ============================================
// Prompt Templates for ObservationExtractorAgent
// ============================================

/**
 * Generates the prompt for Gemini to extract structured medical observations
 * from report text for fields that are harder to extract with regex
 * 
 * @param reportText - The full text of the medical report
 * @returns The formatted prompt for the AI
 */
export function generateExtractionPrompt(reportText: string): string {
  return `You are a medical data extraction assistant. Extract structured medical observations from the following medical report text.

IMPORTANT RULES:
- Extract ONLY what is explicitly stated in the report.
- Do NOT invent or guess missing values.
- If a value is not found in the report, do not include it in the output.
- Do NOT diagnose or interpret the data.
- Extract the exact text from the report for source_text.
- Assign a confidence score (0.0 to 1.0) based on how clearly the value is stated in the report.

Report Text:
${reportText}

Please extract the following observations in JSON format:

1. Patient Information:
   - patient_name (demographic): Full name of the patient
   - gender (demographic): Male/Female/Other
   - medications (medication): List of medications with dosages (e.g., "Lisinopril 10 mg, Atorvastatin 20 mg")

2. Clinical Assessment:
   - assessment (diagnosis): The assessment or diagnosis stated in the report
   - recommendations (recommendation): Any recommendations or follow-up instructions

3. Appointments:
   - next_appointment (appointment): Date of next appointment

Output format (JSON array):
\`\`\`json
[
  {
    "observationType": "demographic",
    "observationKey": "patient_name",
    "valueText": "Sarah Johnson",
    "sourceText": "Patient: Sarah Johnson",
    "confidence": 0.95
  },
  {
    "observationType": "demographic",
    "observationKey": "gender",
    "valueText": "Female",
    "sourceText": "Gender: Female",
    "confidence": 0.95
  },
  {
    "observationType": "medication",
    "observationKey": "medications",
    "valueText": "Lisinopril 10 mg, Atorvastatin 20 mg",
    "sourceText": "Medications: Lisinopril 10 mg, Atorvastatin 20 mg",
    "confidence": 0.95
  },
  {
    "observationType": "diagnosis",
    "observationKey": "assessment",
    "valueText": "Stage 1 Hypertension, elevated cholesterol",
    "sourceText": "Assessment: Stage 1 Hypertension, elevated cholesterol",
    "confidence": 0.90
  },
  {
    "observationType": "recommendation",
    "observationKey": "recommendations",
    "valueText": "Continue current medications, follow up in 6 weeks",
    "sourceText": "Recommendations: Continue current medications, follow up in 6 weeks",
    "confidence": 0.90
  },
  {
    "observationType": "appointment",
    "observationKey": "next_appointment",
    "valueText": "July 15, 2026",
    "sourceText": "Next appointment: July 15, 2026",
    "confidence": 0.95
  }
]
\`\`\`

Return ONLY the JSON array. Do not include any other text.`;
}

/**
 * Generates a prompt to validate Gemini extraction results
 */
export function generateValidationPrompt(extractedData: string, reportText: string): string {
  return `You are a data validation assistant. Review the following extracted medical observations and validate them against the original report text.

Extracted Data:
${extractedData}

Original Report Text:
${reportText}

Validation Rules:
1. Check if each extracted value actually exists in the report text.
2. Verify the source_text matches the original report text exactly.
3. Check if the confidence score is appropriate for how clearly the value is stated.
4. Flag any observations that appear to be invented or guessed.

Return a JSON object with:
\`\`\`json
{
  "isValid": true/false,
  "issues": ["list of any issues found"],
  "validatedObservations": [array of validated observations]
}
\`\`\`

Return ONLY the JSON object. Do not include any other text.`;
}
