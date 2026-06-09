import { getPool } from "./pool.js";

let initialized = false;
let initPromise: Promise<void> | null = null;

const createReportsTableSql = `
  CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    original_name TEXT NOT NULL,
    stored_name TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    extracted_text TEXT NOT NULL,
    source_kind TEXT NOT NULL,
    embedding vector(3072),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

const createChunksTableSql = `
  CREATE TABLE IF NOT EXISTS document_chunks (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding vector(3072),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

const createObservationsTableSql = `
  CREATE TABLE IF NOT EXISTS medical_observations (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    report_id INTEGER NOT NULL,
    observation_type VARCHAR(100) NOT NULL,
    observation_key VARCHAR(100) NOT NULL,
    value_text TEXT,
    value_number DECIMAL(10,2),
    value_json JSONB,
    unit VARCHAR(50),
    normal_range_text TEXT,
    report_interpretation VARCHAR(100),
    source_text TEXT,
    source_chunk_id INTEGER,
    confidence DECIMAL(3,2),
    observed_at DATE,
    hospital_name VARCHAR(255),
    extracted_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_medical_observations_patient_id ON medical_observations(patient_id);
  CREATE INDEX IF NOT EXISTS idx_medical_observations_report_id ON medical_observations(report_id);
  CREATE INDEX IF NOT EXISTS idx_medical_observations_observation_type ON medical_observations(observation_type);
  CREATE INDEX IF NOT EXISTS idx_medical_observations_observation_key ON medical_observations(observation_key);
  CREATE INDEX IF NOT EXISTS idx_medical_observations_observed_at ON medical_observations(observed_at);
  CREATE INDEX IF NOT EXISTS idx_medical_observations_patient_date ON medical_observations(patient_id, observed_at);
`;

const createConflictsTableSql = `
  CREATE TABLE IF NOT EXISTS observation_conflicts (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    observation_key VARCHAR(100) NOT NULL,
    conflict_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    observation_1_id INTEGER,
    observation_2_id INTEGER,
    report_1_id INTEGER,
    report_2_id INTEGER,
    value_1_text TEXT,
    value_2_text TEXT,
    value_1_number DECIMAL(10,2),
    value_2_number DECIMAL(10,2),
    difference DECIMAL(10,2),
    explanation TEXT,
    detected_at TIMESTAMP DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_obs_conflicts_patient_id ON observation_conflicts(patient_id);
  CREATE INDEX IF NOT EXISTS idx_obs_conflicts_observation_key ON observation_conflicts(observation_key);
  CREATE INDEX IF NOT EXISTS idx_obs_conflicts_severity ON observation_conflicts(severity);
  CREATE INDEX IF NOT EXISTS idx_obs_conflicts_resolved ON observation_conflicts(resolved);
  CREATE INDEX IF NOT EXISTS idx_obs_conflicts_detected_at ON observation_conflicts(detected_at);
`;

const createSafetyChecksTableSql = `
  CREATE TABLE IF NOT EXISTS safety_checks (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER,
    agent_used VARCHAR(100) NOT NULL,
    user_question TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    safety_score DECIMAL(3,2) NOT NULL,
    passed BOOLEAN NOT NULL,
    flags JSONB,
    requires_human_review BOOLEAN DEFAULT FALSE,
    checked_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_safety_checks_patient_id ON safety_checks(patient_id);
  CREATE INDEX IF NOT EXISTS idx_safety_checks_agent_used ON safety_checks(agent_used);
  CREATE INDEX IF NOT EXISTS idx_safety_checks_passed ON safety_checks(passed);
  CREATE INDEX IF NOT EXISTS idx_safety_checks_requires_human_review ON safety_checks(requires_human_review);
  CREATE INDEX IF NOT EXISTS idx_safety_checks_checked_at ON safety_checks(checked_at);
`;

export async function ensureDatabase(): Promise<void> {
  if (initialized) {
    return;
  }

  if (!initPromise) {
    initPromise = (async () => {
      // pgvector extension is already enabled in Supabase
      await getPool().query(createReportsTableSql);
      await getPool().query(createChunksTableSql);
      await getPool().query(createObservationsTableSql);
      await getPool().query(createConflictsTableSql);
      await getPool().query(createSafetyChecksTableSql);
      initialized = true;
    })();
  }

  await initPromise;
}
