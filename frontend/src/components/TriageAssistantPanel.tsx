import React from 'react';
import { TriageResponse } from '../types';
import {
  Stethoscope,
  AlertTriangle,
  PhoneCall,
  Pill,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface TriageAssistantPanelProps {
  triageData: TriageResponse | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const TriageAssistantPanel: React.FC<TriageAssistantPanelProps> = ({
  triageData,
  isLoading,
  onRefresh
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <div>
          <h3 className="text-base font-bold text-slate-800">Synthesizing Physiological Triage Analysis</h3>
          <p className="text-xs text-slate-500 mt-1">Connecting to Groq LLM endpoint (`llama-3.3-70b-versatile`)...</p>
        </div>
      </div>
    );
  }

  if (!triageData) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <Stethoscope className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Groq AI Triage Standby</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The Triage Assistant automatically analyzes your physiological strain when stress reaches the High band (≥70), or you can request an instant review at any time.
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Request Instant AI Triage
          </button>
        )}
      </div>
    );
  }

  const getSeverityBadge = (sev: TriageResponse['severity']) => {
    switch (sev) {
      case 'emergency':
        return {
          bg: 'bg-red-600 text-white animate-pulse',
          label: 'EMERGENCY FLAG',
          icon: AlertTriangle
        };
      case 'urgent':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          label: 'URGENT CONCERN',
          icon: AlertTriangle
        };
      case 'moderate':
      default:
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          label: 'MODERATE CONCERN',
          icon: ShieldCheck
        };
    }
  };

  const badge = getSeverityBadge(triageData.severity);
  const BadgeIcon = badge.icon;
  const isEmergency = triageData.severity === 'emergency';

  return (
    <div
      className={`bg-white rounded-2xl p-6 border shadow-sm space-y-5 transition-all ${
        isEmergency ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200/80'
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Stethoscope className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800 tracking-tight">Groq AI Triage Assessment</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                Groq LLM Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Generated at {triageData.timestamp}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border ${badge.bg}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            {badge.label}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              title="Re-run Triage Assessment"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Physiological Summary</h4>
        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          {triageData.plain_language_summary}
        </p>
      </div>

      {/* Recommended Care Type */}
      <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
        <span className="text-xs font-semibold text-slate-600">Recommended Care Pathway:</span>
        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300">
          {triageData.recommended_care_type}
        </span>
      </div>

      {/* General Next Steps */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Recommended First-Response Actions
        </h4>
        <ul className="space-y-2 pl-1">
          {triageData.general_next_steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
              <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Medication Reminder Cross-Reference */}
      {triageData.medication_reminder && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <Pill className="w-4 h-4 text-amber-600" />
            <span>Declared Medication Cross-Reference</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            {triageData.medication_reminder}
          </p>
        </div>
      )}

      {/* Mandatory Disclaimer & Emergency CTA */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <p className="text-[11px] text-slate-400 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
          ⚠️ <strong>Medical Disclaimer:</strong> {triageData.disclaimer}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="tel:911"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            Call Emergency Services (911)
          </a>
          <button
            onClick={() => alert('Initiating secure telehealth physician call routing...')}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all"
          >
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            Contact On-Call Doctor
          </button>
        </div>
      </div>
    </div>
  );
};
