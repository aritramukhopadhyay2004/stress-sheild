import { useState, useEffect, useRef, useCallback } from 'react';
import { BiometricReading, Medication, TriageResponse } from '../types';
import { requestGroqTriage } from '../lib/groqClient';

export function useTriageAssistant(
  currentBiometrics: BiometricReading,
  elevatedDurationMinutes: number,
  medications: Medication[]
) {
  const [triageResponse, setTriageResponse] = useState<TriageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const lastTriggeredScore = useRef<number | null>(null);

  const fetchTriageAnalysis = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await requestGroqTriage(currentBiometrics, elevatedDurationMinutes, medications);
      setTriageResponse(res);
      setIsAlertOpen(true);
    } catch (err) {
      console.error('[useTriageAssistant] Failed to fetch triage', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentBiometrics, elevatedDurationMinutes, medications]);

  // Monitor High stress threshold
  useEffect(() => {
    if (currentBiometrics.stressScore >= 70) {
      // Avoid re-triggering constantly for small variations if already triggered within 5 points
      if (!lastTriggeredScore.current || Math.abs(currentBiometrics.stressScore - lastTriggeredScore.current) >= 5) {
        lastTriggeredScore.current = currentBiometrics.stressScore;
        fetchTriageAnalysis();
      }
    }
  }, [currentBiometrics.stressScore, fetchTriageAnalysis]);

  const dismissAlert = () => {
    setIsAlertOpen(false);
  };

  return {
    triageResponse,
    isLoading,
    isAlertOpen,
    setIsAlertOpen,
    dismissAlert,
    requestTriageNow: fetchTriageAnalysis
  };
}
