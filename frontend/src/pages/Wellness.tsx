import React, { useState } from 'react';
import { Header } from '../components/Header';
import { HeartPulse, Wind, Play, Pause, Sparkles, CheckCircle2 } from 'lucide-react';

export const Wellness: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(180);

  return (
    <div className="flex-1 min-w-0 bg-slate-50 min-h-screen pb-12">
      <Header stressBand="Optimal" />
      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Active Wellness & Vagal Resets</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Guided breathing modules and autonomic nervous system regulation exercises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guided 4-7-8 Breathing Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">4-7-8 Diaphragmatic Resets</h3>
                <p className="text-xs text-slate-400 font-medium">3-minute paced breathing cycle</p>
              </div>
            </div>

            <div className="w-48 h-48 rounded-full bg-emerald-50 border-4 border-emerald-300 mx-auto flex items-center justify-center flex-col shadow-inner">
              <span className="text-3xl font-extrabold text-emerald-800">
                {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold text-emerald-600 uppercase mt-1">
                {isActive ? 'Inhale 4s... Hold 7s... Exhale 8s' : 'Ready to begin'}
              </span>
            </div>

            <button
              onClick={() => setIsActive(!isActive)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? 'Pause Respiration Cycle' : 'Start 3-Minute Reset'}</span>
            </button>
          </div>

          {/* Autonomic Regulation Modules */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Recommended Micro-Resets
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Physiological Sighing (Huberman Protocol)', duration: '2 mins', desc: 'Double inhale through nose, long slow exhale through mouth.' },
                { title: 'Ciliary Muscle Distance Gaze', duration: '5 mins', desc: 'Relax optic nerve tension by focusing on distant outdoor horizon.' },
                { title: 'Cervical & Trapezius Release', duration: '3 mins', desc: 'Isometric neck stretches to clear muscular vascular compression.' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{item.duration}</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
