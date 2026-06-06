-- ============================================
-- Migration: Create medical_observations table
-- ============================================
-- This table stores structured medical observations extracted from uploaded reports
-- Each observation is linked to a patient and a specific report
-- Supports tracking health data over time across multiple reports

CREATE TABLE IF NOT EXISTS medical_observations (
  -- Primary key
  id SERIAL PRIMARY KEY,
  
  -- Foreign keys to link observation to patient and report
  patient_id INTEGER NOT NULL,
  report_id INTEGER NOT NULL,
  
  -- Observation classification
  observation_type VARCHAR(100) NOT NULL, -- vital, lab, medication, diagnosis, appointment, etc.
  observation_key VARCHAR(100) NOT NULL, -- blood_pressure, heart_rate, cholesterol, etc.
  
  -- Value storage (flexible to handle different data types)
  value_text TEXT, -- For text values like "148/95" or medication names
  value_number DECIMAL(10,2), -- For numeric values like 148 or 95
  value_json JSONB, -- For complex values like {"systolic": 148, "diastolic": 95}
  
  -- Metadata
  unit VARCHAR(50), -- mmHg, mg/dL, bpm, etc.
  normal_range_text TEXT, -- Normal range from report (e.g., "120-80 mmHg")
  report_interpretation VARCHAR(100), -- Interpretation from report (e.g., "high", "normal")
  source_text TEXT, -- Original text from report for traceability
  source_chunk_id INTEGER, -- Link to the chunk where this was found
  confidence DECIMAL(3,2), -- Extraction confidence (0-1)
  observed_at DATE, -- Date when the observation was made (from report)
  hospital_name VARCHAR(255), -- Hospital/clinic name from report
  
  -- Timestamps
  extracted_at TIMESTAMP DEFAULT NOW(), -- When AI extracted this observation
  created_at TIMESTAMP DEFAULT NOW(), -- When record was created
  updated_at TIMESTAMP DEFAULT NOW() -- When record was last updated
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Index on patient_id for fast patient-specific queries
CREATE INDEX IF NOT EXISTS idx_medical_observations_patient_id ON medical_observations(patient_id);

-- Index on report_id for fast report-specific queries
CREATE INDEX IF NOT EXISTS idx_medical_observations_report_id ON medical_observations(report_id);

-- Index on observation_type for filtering by type
CREATE INDEX IF NOT EXISTS idx_medical_observations_observation_type ON medical_observations(observation_type);

-- Index on observation_key for filtering by key
CREATE INDEX IF NOT EXISTS idx_medical_observations_observation_key ON medical_observations(observation_key);

-- Index on observed_at for chronological queries and trend analysis
CREATE INDEX IF NOT EXISTS idx_medical_observations_observed_at ON medical_observations(observed_at);

-- Composite index for patient + date queries (common for timeline views)
CREATE INDEX IF NOT EXISTS idx_medical_observations_patient_date ON medical_observations(patient_id, observed_at);

-- ============================================
-- Comments for Documentation
-- ============================================

COMMENT ON TABLE medical_observations IS 'Stores structured medical observations extracted from uploaded reports for long-term tracking and analysis';

COMMENT ON COLUMN medical_observations.observation_type IS 'Type of observation: vital, lab, medication, diagnosis, appointment, demographic, etc.';

COMMENT ON COLUMN medical_observations.observation_key IS 'Specific observation: blood_pressure, heart_rate, total_cholesterol, medication_name, etc.';

COMMENT ON COLUMN medical_observations.value_text IS 'Text representation of the value (e.g., "148/95", "Lisinopril 10 mg")';

COMMENT ON COLUMN medical_observations.value_number IS 'Numeric value for single-number observations (e.g., 148, 95, 245)';

COMMENT ON COLUMN medical_observations.value_json IS 'JSON object for complex values (e.g., {"systolic": 148, "diastolic": 95})';

COMMENT ON COLUMN medical_observations.confidence IS 'AI extraction confidence score from 0 to 1, where 1 is most confident';

COMMENT ON COLUMN medical_observations.observed_at IS 'Date when the observation was recorded in the original report';
