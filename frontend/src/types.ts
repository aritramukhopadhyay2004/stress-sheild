export type StressBand = 'Optimal' | 'Elevated' | 'High';

export interface BiometricReading {
  timestamp: string;
  heartRate: number; // bpm (55 - 140)
  stressScore: number; // 0 - 100
  dutyCycleActiveMinutes: number;
  dutyCycleRestMinutes: number;
  stressBand: StressBand;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string; // e.g., 'ICU Charge Nurse', 'IT Systems Admin', 'Airline Pilot'
  avatarUrl?: string;
  dutyShiftHours: number;
  lastRestBreak: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  scheduledTime: string;
  taken: boolean;
  notes?: string;
  category: 'supplement' | 'prescription' | 'otc';
}

export interface MicroIntervention {
  id: string;
  title: string;
  category: 'breathing' | 'hydration' | 'movement' | 'environment' | 'recovery';
  durationMinutes: number;
  description: string;
  iconName: string;
  recommendedFor: StressBand[];
  timestamp: string;
  completed: boolean;
}

export type TriageSeverity = 'moderate' | 'urgent' | 'emergency';

export interface TriageResponse {
  severity: TriageSeverity;
  plain_language_summary: string;
  recommended_care_type:
    | 'self-care sufficient'
    | 'consult GP'
    | 'consult cardiologist'
    | 'consult mental health professional'
    | 'seek emergency care immediately';
  general_next_steps: string[];
  medication_reminder: string | null;
  disclaimer: string;
  timestamp: string;
}
