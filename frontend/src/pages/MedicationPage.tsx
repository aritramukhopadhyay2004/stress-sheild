import React from 'react';
import { Header } from '../components/Header';
import { MedicationTracker } from '../components/MedicationTracker';

export const MedicationPage: React.FC = () => {
  return (
    <div className="flex-1 min-w-0 bg-slate-50 min-h-screen pb-12">
      <Header stressBand="Optimal" />
      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Medication & Supplement Adherence</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Log active doses, supplements, and OTC electrolyte regimens for automatic Groq triage cross-referencing.
          </p>
        </div>
        <MedicationTracker />
      </main>
    </div>
  );
};
