// TODO: connect DB here
// When Supabase project URL and anon key are provided via environment variables,
// uncomment and initialize the createClient helper.

import { UserProfile, Medication, BiometricReading } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Stubbed Database Layer for NeuroRest MVP.
 * Pre-wired with in-memory persistence until Supabase / Firebase credentials are provided.
 */
export const dbService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    // TODO: connect DB here -> supabase.from('profiles').select('*').eq('id', userId).single()
    return null;
  },

  async saveMedications(userId: string, medications: Medication[]): Promise<boolean> {
    // TODO: connect DB here -> supabase.from('medications').upsert(medications)
    console.log(`[DB Stub] Saved ${medications.length} medications for user ${userId}`);
    return true;
  },

  async logBiometrics(userId: string, reading: BiometricReading): Promise<boolean> {
    // TODO: connect DB here -> supabase.from('biometrics').insert({ user_id: userId, ...reading })
    return true;
  }
};
