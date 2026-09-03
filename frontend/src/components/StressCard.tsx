import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { StressBand } from '../types';

interface StressCardProps {
  score: number;
  band: StressBand;
}

export const StressCard: React.FC<StressCardProps> = ({ score, band }) => {
  const getBandStyles = (b: StressBand) => {
    switch (b) {
      case 'High':
        return {
          badgeBg: 'bg-rose-100/90 text-rose-800 border-rose-300',
          gaugeColor: '#f43f5e',
          textColor: 'text-rose-600',
          icon: AlertTriangle,
          statusText: 'High Strain (Action Required)'
        };
      case 'Elevated':
        return {
          badgeBg: 'bg-amber-100/90 text-amber-800 border-amber-300',
          gaugeColor: '#f59e0b',
          textColor: 'text-amber-600',
          icon: Activity,
          statusText: 'Elevated Strain (Monitor closely)'
        };
      case 'Optimal':
      default:
        return {
          badgeBg: 'bg-emerald-100/90 text-emerald-800 border-emerald-300',
          gaugeColor: '#10b981',
          textColor: 'text-emerald-600',
          icon: CheckCircle2,
          statusText: 'Autonomic Balance Normal'
        };
    }
  };

  const style = getBandStyles(band);
  const StatusIcon = style.icon;

  // SVG Circumference calculation with non-clipping viewBox (center 48,48, r 36)
  const strokeWidth = 7;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Stress Index</h3>
            <p className="text-[11px] text-slate-400 font-medium leading-tight">Real-time galvanic & HRV score</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${style.badgeBg}`}>
          {band} ({score}/100)
        </span>
      </div>

      {/* Main Gauge & Value Display */}
      <div className="flex items-center justify-between my-4">
        {/* Number Display */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-extrabold tracking-tight ${style.textColor}`}>{score}</span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-600">
            <StatusIcon className={`w-4 h-4 shrink-0 ${style.textColor}`} />
            <span className="truncate">{style.statusText}</span>
          </div>
        </div>

        {/* Circular Progress Gauge - Perfectly formatted with viewBox="0 0 96 96" to prevent clipping */}
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-20 h-20 transform -rotate-90 overflow-visible" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={style.gaugeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-extrabold text-slate-800 leading-none">{score}%</span>
          </div>
        </div>
      </div>

      {/* Progress Band Bar at Bottom */}
      <div className="pt-2 border-t border-slate-100 space-y-1.5">
        <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden p-[1px]">
          <div className="bg-emerald-400 h-full w-[40%] rounded-l-full" title="Optimal: 0-39" />
          <div className="bg-amber-400 h-full w-[30%]" title="Elevated: 40-69" />
          <div className="bg-rose-500 h-full w-[30%] rounded-r-full" title="High: 70-100" />
        </div>
        <div className="grid grid-cols-3 text-[10px] text-slate-400 font-medium text-center">
          <span className="text-left flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>0 (Optimal)</span>
          <span className="text-center flex items-center justify-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>40 (Elevated)</span>
          <span className="text-right flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>70 (High)</span>
        </div>
      </div>
    </div>
  );
};
