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
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
          gaugeColor: '#f43f5e',
          textColor: 'text-rose-600',
          icon: AlertTriangle,
          statusText: 'High Strain (Action Required)'
        };
      case 'Elevated':
        return {
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          gaugeColor: '#f59e0b',
          textColor: 'text-amber-600',
          icon: Activity,
          statusText: 'Elevated Strain (Monitor closely)'
        };
      case 'Optimal':
      default:
        return {
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          gaugeColor: '#10b981',
          textColor: 'text-emerald-600',
          icon: CheckCircle2,
          statusText: 'Autonomic Balance Normal'
        };
    }
  };

  const style = getBandStyles(band);
  const StatusIcon = style.icon;

  // SVG Circumference calculation for progress ring
  const strokeWidth = 8;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stress Index</h3>
            <p className="text-[11px] text-slate-400 font-medium">Real-time galvanic & HRV score</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${style.badgeBg}`}>
          {band} ({score}/100)
        </span>
      </div>

      {/* Main Gauge & Value Display */}
      <div className="flex items-center justify-between my-3">
        {/* Number Display */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-extrabold tracking-tight ${style.textColor}`}>{score}</span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-slate-600">
            <StatusIcon className={`w-3.5 h-3.5 ${style.textColor}`} />
            <span>{style.statusText}</span>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
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
          <span className="absolute text-xs font-bold text-slate-700">{score}%</span>
        </div>
      </div>

      {/* Progress Band Bar at Bottom */}
      <div className="space-y-1">
        <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
          <div className="bg-emerald-400 h-full w-[39%]" title="Optimal: 0-39" />
          <div className="bg-amber-400 h-full w-[30%]" title="Elevated: 40-69" />
          <div className="bg-rose-500 h-full w-[31%]" title="High: 70-100" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
          <span>0 (Optimal)</span>
          <span>40 (Elevated)</span>
          <span>70-100 (High)</span>
        </div>
      </div>
    </div>
  );
};
