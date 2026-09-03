import React from 'react';
import { Header } from '../components/Header';
import { LineChart, BarChart3, TrendingUp, Calendar, Zap, ShieldCheck } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="flex-1 min-w-0 bg-slate-50 min-h-screen pb-12">
      <Header stressBand="Optimal" />
      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Shift Strain Analytics & Trends</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Long-term physiological recovery patterns and circadian stress band distribution.
          </p>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Weekly Stress Variance</h3>
            <p className="text-2xl font-extrabold text-emerald-600">-14%</p>
            <p className="text-xs text-slate-500">Reduction in peak strain events during night shifts vs last month.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Mean HRV Baseline</h3>
            <p className="text-2xl font-extrabold text-sky-600">64 ms</p>
            <p className="text-xs text-slate-500">Parasympathetic tone recovery score during off-duty rest cycles.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Duty Shift Compliance</h3>
            <p className="text-2xl font-extrabold text-purple-600">96%</p>
            <p className="text-xs text-slate-500">Micro-break protocol adherence rate across 12 completed shifts.</p>
          </div>
        </div>

        {/* Detailed Chart Stub */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <LineChart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Circadian Strain Heatmap</h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            Historical 30-day circadian strain breakdown shows optimal physiological recovery when rest breaks are timed every 90 minutes.
          </p>
        </div>
      </main>
    </div>
  );
};
