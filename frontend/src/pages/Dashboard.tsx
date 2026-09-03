import React from 'react';
import { Header } from '../components/Header';
import { StressCard } from '../components/StressCard';
import { DutyCycleCard } from '../components/DutyCycleCard';
import { HeartRateCard } from '../components/HeartRateCard';
import { HeartRateTrendChart } from '../components/HeartRateTrendChart';
import { InterventionsPanel } from '../components/InterventionsPanel';
import { TriageAssistantPanel } from '../components/TriageAssistantPanel';
import { AlertBanner } from '../components/AlertBanner';
import { useBiometricSimulator } from '../hooks/useBiometricSimulator';
import { useTriageAssistant } from '../hooks/useTriageAssistant';
import { INITIAL_MOCK_MEDICATIONS } from '../data/mockUser';

export const Dashboard: React.FC = () => {
  const {
    currentReading,
    history,
    triggerSimulatedSpike,
    updateRealBluetoothHeartRate,
    elevatedDurationMinutes
  } = useBiometricSimulator(44, 78);

  const {
    triageResponse,
    isLoading,
    isAlertOpen,
    dismissAlert,
    requestTriageNow,
    setIsAlertOpen
  } = useTriageAssistant(currentReading, elevatedDurationMinutes, INITIAL_MOCK_MEDICATIONS);

  return (
    <div className="flex-1 min-w-0 bg-slate-50 min-h-screen pb-12">
      {/* Header with Bluetooth pairing capabilities */}
      <Header
        stressBand={currentReading.stressBand}
        onHeartRateReceived={updateRealBluetoothHeartRate}
        onTriggerSpike={() => {
          triggerSimulatedSpike(86, 122);
          setIsAlertOpen(true);
        }}
      />

      <main className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Top KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StressCard
            score={currentReading.stressScore}
            band={currentReading.stressBand}
          />
          <DutyCycleCard
            activeMinutes={currentReading.dutyCycleActiveMinutes}
            restMinutes={currentReading.dutyCycleRestMinutes}
          />
          <HeartRateCard
            heartRate={currentReading.heartRate}
          />
        </div>

        {/* Main Section: Chart + Micro-Interventions Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <HeartRateTrendChart data={history} />
          </div>
          <div className="lg:col-span-1">
            <InterventionsPanel currentStressBand={currentReading.stressBand} />
          </div>
        </div>

        {/* AI Triage Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                AI Triage & Clinical Care Escalation
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Structured Groq LLM clinical guidance, care level recommendations, and medication alerts.
              </p>
            </div>
            <button
              onClick={requestTriageNow}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Analyze Current Biometrics Now
            </button>
          </div>

          <TriageAssistantPanel
            triageData={triageResponse}
            isLoading={isLoading}
            onRefresh={requestTriageNow}
          />
        </div>
      </main>

      {/* Floating High Stress Threshold Alert Banner */}
      <AlertBanner
        reading={currentReading}
        isOpen={isAlertOpen}
        onDismiss={dismissAlert}
        onOpenTriage={() => {
          requestTriageNow();
          dismissAlert();
        }}
      />
    </div>
  );
};
