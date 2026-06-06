# Professional Architecture Plan for Multi-User Healthcare AI System

## Overview
This plan outlines the architecture needed to scale the healthcare AI system to support multiple users with multiple medical reports over time. The system must handle conflicting values, track observations across reports, and ensure safety at scale.

---

## 1. ObservationExtractorAgent

### Purpose
Extracts structured medical observations from uploaded reports and stores them in a database for long-term tracking and analysis.

### What It Will Do
- Parse uploaded PDF reports to extract structured medical data
- Identify key observations: blood pressure, cholesterol, glucose, medications, diagnoses, procedures
- Normalize data formats (e.g., "148/95 mmHg" → systolic: 148, diastolic: 95, unit: mmHg)
- Store observations in the `medical_observations` table with patient ID, report ID, and timestamp
- Handle multiple reports from different hospitals and dates
- Detect and flag duplicate observations

### Data It Needs
- Uploaded report file (PDF)
- Report metadata (patient ID, upload date, hospital name)
- Existing observations for the patient (to detect duplicates/conflicts)

### Files/Folders to Create
```
backend/src/modules/agents/observation-extractor/
├── ObservationExtractorAgent.ts
├── observationExtractor.types.ts
├── observationExtractor.rules.ts
└── observationExtractor.prompt.ts
```

### Database Table to Add
```sql
CREATE TABLE medical_observations (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users(id),
  report_id INTEGER REFERENCES reports(id),
  observation_type VARCHAR(100), -- blood_pressure, cholesterol, medication, diagnosis, etc.
  observation_key VARCHAR(100), -- systolic, diastolic, ldl, hdl, etc.
  observation_value TEXT, -- 148, 95, 165, etc.
  unit VARCHAR(20), -- mmHg, mg/dL, etc.
  normalized_value DECIMAL(10,2), -- for numeric comparisons
  source_text TEXT, -- original text from report
  confidence DECIMAL(3,2), -- extraction confidence
  extracted_at TIMESTAMP DEFAULT NOW(),
  hospital_name VARCHAR(255),
  report_date DATE,
  is_duplicate BOOLEAN DEFAULT FALSE,
  duplicate_of_id INTEGER REFERENCES medical_observations(id),
  INDEX idx_patient_id (patient_id),
  INDEX idx_observation_type (observation_type),
  INDEX idx_report_date (report_date)
);
```

### How It Supports Multi-User System
- Each observation is linked to a specific `patient_id`
- Observations from different reports are stored separately with `report_id`
- Timestamps and report dates enable tracking changes over time
- Duplicate detection prevents storing the same observation multiple times

---

## 2. TimelineMemoryAgent

### Purpose
Maintains a chronological timeline of a patient's health observations across all reports, enabling trend analysis and historical context.

### What It Will Do
- Query all observations for a specific patient ordered by date
- Build a timeline showing how values change over time (e.g., blood pressure trends)
- Identify patterns (improving, worsening, stable)
- Provide historical context when answering user questions
- Support queries like "How has my blood pressure changed over the last 6 months?"

### Data It Needs
- Patient ID
- Date range (optional, for filtering)
- Observation types to include (optional, for filtering)

### Files/Folders to Create
```
backend/src/modules/agents/timeline-memory/
├── TimelineMemoryAgent.ts
├── timelineMemory.types.ts
└── timelineMemory.queries.ts
```

### Database Table to Add
```sql
CREATE TABLE observation_timeline (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users(id),
  observation_type VARCHAR(100),
  observation_key VARCHAR(100),
  value DECIMAL(10,2),
  unit VARCHAR(20),
  observation_date DATE,
  report_id INTEGER REFERENCES reports(id),
  hospital_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_patient_date (patient_id, observation_date)
);
```

### How It Supports Multi-User System
- Timeline is patient-specific (linked to `patient_id`)
- Enables each user to see their own health history
- Supports comparing trends across different time periods
- Provides context for understanding current values in historical perspective

---

## 3. ConflictDetectorAgent

### Purpose
Detects conflicting medical information across different reports and flags them for review.

### What It Will Do
- Compare observations of the same type from different reports
- Identify significant discrepancies (e.g., blood pressure 120/80 in one report, 150/95 in another)
- Check if conflicts are within acceptable measurement error ranges
- Flag conflicts for user attention
- Provide possible explanations (different measurement times, different hospitals, measurement errors)

### Data It Needs
- All observations for a specific patient
- Conflict thresholds for each observation type
- Time between measurements (to determine if change is expected)

### Files/Folders to Create
```
backend/src/modules/agents/conflict-detector/
├── ConflictDetectorAgent.ts
├── conflictDetector.types.ts
├── conflictDetector.rules.ts
└── conflictDetector.thresholds.ts
```

### Database Table to Add
```sql
CREATE TABLE observation_conflicts (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users(id),
  observation_type VARCHAR(100),
  observation_key VARCHAR(100),
  value_1 DECIMAL(10,2),
  value_2 DECIMAL(10,2),
  report_1_id INTEGER REFERENCES reports(id),
  report_2_id INTEGER REFERENCES reports(id),
  date_1 DATE,
  date_2 DATE,
  hospital_1 VARCHAR(255),
  hospital_2 VARCHAR(255),
  difference DECIMAL(10,2),
  severity VARCHAR(20), -- low, medium, high
  detected_at TIMESTAMP DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  INDEX idx_patient_id (patient_id),
  INDEX idx_severity (severity)
);
```

### How It Supports Multi-User System
- Conflicts are tracked per patient
- Helps users understand discrepancies in their medical records
- Enables healthcare providers to review conflicting information
- Supports data quality improvement over time

---

## 4. SafetyCheckerAgent

### Purpose
Performs safety checks on all AI-generated responses before they are shown to users, ensuring no harmful or dangerous advice is provided.

### What It Will Do
- Check responses for prohibited content (diagnoses, prescriptions, treatment recommendations)
- Verify that appropriate disclaimers are included
- Detect potentially dangerous advice (e.g., "stop taking your medication")
- Flag responses that need human review
- Provide safety scores for each response

### Data It Needs
- AI-generated response text
- User question context
- Selected agent type
- Safety rules and thresholds

### Files/Folders to Create
```
backend/src/modules/agents/safety-checker/
├── SafetyCheckerAgent.ts
├── safetyChecker.types.ts
├── safetyChecker.rules.ts
└── safetyChecker.patterns.ts
```

### Database Table to Add
```sql
CREATE TABLE safety_checks (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES users(id),
  agent_used VARCHAR(50),
  user_question TEXT,
  ai_response TEXT,
  safety_score DECIMAL(3,2),
  flags JSONB, -- array of safety flags
  passed BOOLEAN,
  checked_at TIMESTAMP DEFAULT NOW(),
  requires_human_review BOOLEAN DEFAULT FALSE,
  INDEX idx_patient_id (patient_id),
  INDEX idx_safety_score (safety_score),
  INDEX idx_requires_review (requires_human_review)
);
```

### How It Supports Multi-User System
- All responses are safety-checked before delivery
- Safety history is tracked per patient
- Enables monitoring of AI safety performance across all users
- Supports regulatory compliance and audit requirements

---

## 5. Updated Database Schema Overview

### New Tables
1. `medical_observations` - Stores structured medical data extracted from reports
2. `observation_timeline` - Chronological view of observations for trend analysis
3. `observation_conflicts` - Tracks conflicting information across reports
4. `safety_checks` - Logs all safety checks performed on AI responses

### Existing Tables to Update
1. `users` - Add fields for patient profile, preferences
2. `reports` - Add fields for hospital name, report date, processing status
3. `document_chunks` - Add link to observation_id for traceability

---

## 6. Updated Agent Flow

### Current Flow (Single Report)
```
User question
  ↓
SupervisorAgent (routes to specialist)
  ↓
RiskAnalyzerAgent / ReportExplainerAgent
  ↓
RAG retrieval from current report
  ↓
AI response with sources
```

### New Flow (Multi-User, Multi-Report)
```
User question
  ↓
SupervisorAgent (routes to specialist)
  ↓
TimelineMemoryAgent (retrieves historical context)
  ↓
RiskAnalyzerAgent / ReportExplainerAgent
  ↓
RAG retrieval from all reports + historical observations
  ↓
ConflictDetectorAgent (checks for conflicting data)
  ↓
SafetyCheckerAgent (validates response safety)
  ↓
AI response with sources + historical context + conflict flags
```

---

## 7. Implementation Priority

### Phase 1: Foundation (Current)
- ✅ ReportExplainerAgent
- ✅ RiskAnalyzerAgent
- ✅ SupervisorAgent
- ✅ Source citations
- ✅ Duplicate source removal

### Phase 2: Observation Extraction (Next)
- ObservationExtractorAgent
- medical_observations table
- Normalize and store structured data

### Phase 3: Timeline & Context
- TimelineMemoryAgent
- observation_timeline table
- Historical trend analysis

### Phase 4: Conflict Detection
- ConflictDetectorAgent
- observation_conflicts table
- Discrepancy flagging

### Phase 5: Safety at Scale
- SafetyCheckerAgent
- safety_checks table
- Response validation

---

## 8. Key Benefits

### For Users
- See health trends over time
- Understand conflicting information
- Get safer AI responses
- Track progress across multiple reports

### For Healthcare Providers
- Review patient history easily
- Identify data quality issues
- Monitor AI safety
- Support clinical decision-making

### For System Scalability
- Handle millions of observations
- Support thousands of users
- Maintain data quality
- Ensure regulatory compliance

---

## 9. Technical Considerations

### Performance
- Index database tables for fast queries
- Use caching for frequently accessed timelines
- Implement pagination for large datasets
- Consider time-series database for observations

### Privacy
- Encrypt sensitive patient data
- Implement access controls per patient
- Audit logs for all data access
- HIPAA compliance considerations

### Reliability
- Idempotent observation extraction
- Conflict resolution workflows
- Safety check fallbacks
- Graceful degradation

---

## 10. Next Steps

1. Implement ObservationExtractorAgent
2. Create medical_observations table
3. Test extraction with sample reports
4. Implement TimelineMemoryAgent
5. Add historical context to existing agents
6. Implement ConflictDetectorAgent
7. Implement SafetyCheckerAgent
8. Add monitoring and alerting
9. Performance testing at scale
10. User acceptance testing
