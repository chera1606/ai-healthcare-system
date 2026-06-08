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
      initialized = true;
    })();
  }

  await initPromise;
}