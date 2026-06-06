// User & Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
}

// Medical Reports
export interface MedicalReport {
  id: string;
  name: string;
  date: string;
  type: 'Lab Report' | 'Clinical' | 'Imaging' | 'Cardiology';
  status: 'Analyzed' | 'Pending' | 'Processing';
  icon: string;
  fileUrl?: string;
  extractedText?: string;
}

// Medication
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  status: 'Taken' | 'Pending' | 'Partial' | 'Missed';
  nextDose: string;
  icon: string;
}

// Health Timeline Events
export interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  type: 'Vitals' | 'Medication' | 'Lab Test' | 'Activity' | 'Appointment';
  title: string;
  value: string;
  status: string;
  icon: string;
}

// Hospital
export interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  waitTime: string;
  rating: number;
  type: 'General' | 'Trauma' | 'Pediatric' | 'Teaching' | 'Clinic' | 'Specialty';
  emergency: boolean;
  icon: string;
  phone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// AI Chat Message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  sources?: SourceCitation[];
}

// Source Citation
export interface SourceCitation {
  sourceType: 'chunk' | 'observation';
  chunkId?: number;
  reportId: number;
  fileName?: string;
  observationKey?: string;
  textPreview: string;
  similarity?: number;
  confidence?: number;
}

// Health Stats
export interface HealthStats {
  heartRate: number;
  bloodPressure: string;
  weight: number;
  sleep: number;
}

// API Response
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Adherence Data
export interface AdherenceData {
  weekly: number;
  medicationsActive: number;
  nextReminder: string;
  history: Array<{
    day: string;
    percentage: number;
  }>;
}
