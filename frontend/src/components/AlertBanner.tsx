import React from 'react';
import { AlertTriangle, Stethoscope, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { BiometricReading } from '../types';

interface AlertBannerProps {
  reading: BiometricReading;
  isOpen: boolean;
  onDismiss: () => void;
  onOpenTriage: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  reading,
  isOpen,
  onDismiss,
  onOpenTriage
}) => {
  if (!isOpen || reading.stressBand === 'Optimal') return null;

  const isHigh = reading.stressBand === 'High';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-short">
      <div
        className={`rounded-2xl p-4 shadow-2xl border flex flex-col gap-3 backdrop-blur-md ${
          isHigh
            ? 'bg-rose-950/90 text-white border-rose-500/50 ring-4 ring-rose-500/20'
            : 'bg-amber-950/90 text-white border-amber-500/50 ring-4 ring-amber-500/20'
        }`}
      >
        {/* Banner Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isHigh ? 'bg-rose-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isHigh ? 'bg-rose-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <div className="flex items-center gap-1.5 font-bold text-sm tracking-wide">
              {isHigh ? (
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span>{isHigh ? 'HIGH STRAIN THRESHOLD CROSSED' : 'ELEVATED STRESS DETECTED'}</span>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Banner Details */}
        <div className="text-xs space-y-1 text-slate-200">
          <p>
            Current Stress: <strong className="text-white font-extrabold">{reading.stressScore} / 100</strong> • Heart Rate:{' '}
            <strong className="text-white font-extrabold">{reading.heartRate} bpm</strong>
          </p>
          <p className="text-slate-300 leading-normal">
            {isHigh
              ? 'Physiological markers indicate acute autonomic strain. Groq AI Triage Assistant has generated immediate guidance.'
              : 'Stress elevated above baseline. Initiate micro-interventions or request AI Triage review.'}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onDismiss}
            className="text-xs text-slate-400 hover:text-white font-medium underline"
          >
            Acknowledge & Dismiss
          </button>

          <button
            onClick={onOpenTriage}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all ${
              isHigh
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Launch Groq Triage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
