// API Endpoints
export const API_ENDPOINTS = {
  REPORTS: '/reports',
  UPLOAD_REPORT: '/reports/upload',
  AI_CHAT: '/ai/chat',
  ANALYZE_REPORT: '/ai/analyze-report',
  MEDICATIONS: '/medications',
  TIMELINE: '/timeline',
  HEALTH_STATS: '/health/stats',
  HOSPITALS_NEARBY: '/hospitals/nearby',
  HOSPITALS_SEARCH: '/hospitals/search',
  USER_PROFILE: '/user/profile',
  USER_SETTINGS: '/user/settings',
} as const;

// Report Types
export const REPORT_TYPES = {
  LAB_REPORT: 'Lab Report',
  CLINICAL: 'Clinical',
  IMAGING: 'Imaging',
  CARDIOLOGY: 'Cardiology',
} as const;

// Medication Status
export const MEDICATION_STATUS = {
  TAKEN: 'Taken',
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  MISSED: 'Missed',
} as const;

// Hospital Types
export const HOSPITAL_TYPES = {
  GENERAL: 'General',
  TRAUMA: 'Trauma',
  PEDIATRIC: 'Pediatric',
  TEACHING: 'Teaching',
  CLINIC: 'Clinic',
  SPECIALTY: 'Specialty',
} as const;

// Timeline Event Types
export const TIMELINE_EVENT_TYPES = {
  VITALS: 'Vitals',
  MEDICATION: 'Medication',
  LAB_TEST: 'Lab Test',
  ACTIVITY: 'Activity',
  APPOINTMENT: 'Appointment',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  MEDICATION_REMINDER: 'medication_reminder',
  APPOINTMENT_REMINDER: 'appointment_reminder',
  HEALTH_ALERT: 'health_alert',
  EMAIL_NOTIFICATION: 'email_notification',
} as const;

// Time Ranges
export const TIME_RANGES = {
  DAYS_7: '7',
  DAYS_30: '30',
  DAYS_90: '90',
} as const;

// Units
export const UNITS = {
  METRIC: 'metric',
  IMPERIAL: 'imperial',
} as const;

// Default Values
export const DEFAULT_VALUES = {
  HOSPITAL_SEARCH_RADIUS: 10, // km
  TIMELINE_DAYS: 7,
  PAGE_SIZE: 10,
} as const;
