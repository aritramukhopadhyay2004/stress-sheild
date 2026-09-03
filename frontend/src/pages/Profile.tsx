import React from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Briefcase, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 min-w-0 bg-slate-50 min-h-screen pb-12">
      <Header stressBand="Optimal" />
      <main className="p-8 max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Shift Professional Profile</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Private authenticated medical profile & duty cycle settings.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&auto=format&fit=crop'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-800">{user?.name || 'Dr. Alex Vance'}</h3>
              <p className="text-xs font-semibold text-emerald-700">{user?.role || 'ICU Shift Specialist'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'alex.vance@neurorest.health'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Duty Assignment</span>
              </div>
              <p className="text-xs text-slate-600">{user?.role || 'ICU Charge Nurse'}</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Standard Shift Length</span>
              </div>
              <p className="text-xs text-slate-600">{user?.dutyShiftHours || 12} Hours Continuous</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Heart className="w-4 h-4 text-emerald-600" />
                <span>Resting Heart Rate Baseline</span>
              </div>
              <p className="text-xs text-slate-600">64 bpm (Normal Autonomic Tone)</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Data Isolation & Privacy</span>
              </div>
              <p className="text-xs text-slate-600">HIPAA Compliant Private Tenant</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
