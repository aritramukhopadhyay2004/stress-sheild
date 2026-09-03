import React from 'react';
import { Heart, TrendingUp, Pulse, ShieldCheck } from 'lucide-react';

interface HeartRateCardProps {
  heartRate: number;
}

export const HeartRateCard: React.FC<HeartRateCardProps> = ({ heartRate }) => {
  const isHigh = heartRate >= 105;
  const isElevated = heartRate >= 90 && heartRate < 105;

  let hrColor = 'text-emerald-600';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let statusMsg = 'Normal Resting Rhythm';

  if (isHigh) {
    hrColor = 'text-rose-600';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
    statusMsg = 'Tachycardia / High Effort';
  } else if (isElevated) {
    hrColor = 'text-amber-600';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    statusMsg = 'Moderate Autonomic Activity';
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
            <Heart className="w-4 h-4 fill-rose-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Heart Rate</h3>
            <p className="text-[11px] text-slate-400 font-medium">PPG Optical Waveform</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeBg}`}>
          {statusMsg}
        </span>
      </div>

      {/* Main HR Display */}
      <div className="flex items-center justify-between my-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold tracking-tight ${hrColor}`}>{heartRate}</span>
            <span className="text-sm font-semibold text-slate-400">BPM</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            <span>+3 bpm vs 30-day baseline (68 bpm)</span>
          </div>
        </div>

        {/* Pulsing Visual Waveform Box */}
        <div className="w-20 h-16 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-center relative overflow-hidden">
          <div className="flex items-center gap-1">
            <div className="w-1.5 bg-rose-400 rounded-full animate-bounce h-6" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 bg-rose-500 rounded-full animate-bounce h-10" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 bg-rose-400 rounded-full animate-bounce h-7" style={{ animationDelay: '300ms' }} />
            <div className="w-1.5 bg-rose-300 rounded-full animate-bounce h-4" style={{ animationDelay: '450ms' }} />
          </div>
        </div>
      </div>

      {/* Bottom Range Stats */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Session Min: <strong className="text-slate-700">62 bpm</strong></span>
        <span>Session Max: <strong className="text-slate-700">114 bpm</strong></span>
      </div>
    </div>
  );
};
