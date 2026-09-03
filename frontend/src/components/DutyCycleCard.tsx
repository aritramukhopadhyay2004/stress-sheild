import React from 'react';
import { Clock, Coffee, BatteryCharging } from 'lucide-react';

interface DutyCycleCardProps {
  activeMinutes: number;
  restMinutes: number;
}

export const DutyCycleCard: React.FC<DutyCycleCardProps> = ({ activeMinutes, restMinutes }) => {
  const totalMinutes = activeMinutes + restMinutes;
  const activeHours = Math.floor(activeMinutes / 60);
  const activeRems = activeMinutes % 60;
  const restHours = Math.floor(restMinutes / 60);
  const restRems = restMinutes % 60;

  const activePercent = Math.round((activeMinutes / totalMinutes) * 100);

  // SVG Circular progress ring
  const strokeWidth = 8;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (activePercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Duty Cycle Ratio</h3>
            <p className="text-[11px] text-slate-400 font-medium">Work vs Physiological Recovery</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
          Optimal Shift Ratio
        </span>
      </div>

      {/* Main Gauge & Value Display */}
      <div className="flex items-center justify-between my-3">
        <div>
          <div className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {activeHours}h {activeRems}m <span className="text-xs font-medium text-slate-400">Active</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Coffee className="w-3 h-3" />
              {restHours}h {restRems}m Rest
            </span>
            <span className="flex items-center gap-1 text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              <BatteryCharging className="w-3 h-3" />
              88% Recovery
            </span>
          </div>
        </div>

        {/* Ring Chart */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#10b981" // Rest portion color
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#0284c7" // Active portion color
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-xs font-extrabold text-slate-800">{activePercent}%</span>
            <span className="block text-[8px] font-semibold text-slate-400 uppercase">Duty</span>
          </div>
        </div>
      </div>

      {/* Duty Bar Summary */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium">Next Recommended Rest Break:</span>
        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          In 45 mins
        </span>
      </div>
    </div>
  );
};
