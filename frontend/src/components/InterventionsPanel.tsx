import React, { useState } from 'react';
import { MicroIntervention, StressBand } from '../types';
import { DEFAULT_INTERVENTIONS } from '../data/mockInterventions';
import { CheckCircle2, Circle, Wind, Droplets, Sun, Coffee, Activity, Sparkles } from 'lucide-react';

interface InterventionsPanelProps {
  currentStressBand: StressBand;
}

export const InterventionsPanel: React.FC<InterventionsPanelProps> = ({ currentStressBand }) => {
  const [interventions, setInterventions] = useState<MicroIntervention[]>(DEFAULT_INTERVENTIONS);

  const toggleIntervention = (id: string) => {
    setInterventions(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wind':
        return Wind;
      case 'Droplets':
        return Droplets;
      case 'Sun':
        return Sun;
      case 'Coffee':
        return Coffee;
      case 'Activity':
      default:
        return Activity;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Micro-Interventions</h3>
              <p className="text-[11px] text-slate-400 font-medium">Real-time physiological resets</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
            Context: {currentStressBand}
          </span>
        </div>

        {/* List of Interventions */}
        <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {interventions.map((item) => {
            const Icon = getIcon(item.iconName);
            const isRecommended = item.recommendedFor.includes(currentStressBand);

            return (
              <div
                key={item.id}
                onClick={() => toggleIntervention(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  item.completed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : isRecommended
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Completion Checkbox */}
                <button className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${
                        item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400">{item.durationMinutes} min</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Icon className="w-3 h-3 text-emerald-600" />
                      {item.category}
                    </span>
                    {isRecommended && !item.completed && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Active Rec
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer summary */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>Completed: {interventions.filter(i => i.completed).length} / {interventions.length}</span>
        <span className="text-emerald-600 font-semibold">Updated live</span>
      </div>
    </div>
  );
};
