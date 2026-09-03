import React, { useState } from 'react';
import { Medication } from '../types';
import { INITIAL_MOCK_MEDICATIONS } from '../data/mockUser';
import { Pill, Plus, CheckCircle2, Clock, Check, Sparkles, Trash2 } from 'lucide-react';

export const MedicationTracker: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MOCK_MEDICATIONS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    scheduledTime: '12:00',
    notes: '',
    category: 'supplement' as Medication['category']
  });

  const toggleTaken = (id: string) => {
    setMedications(prev =>
      prev.map(m => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  const deleteMed = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.dosage) return;

    const created: Medication = {
      id: `med_${Date.now()}`,
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      scheduledTime: newMed.scheduledTime,
      taken: false,
      notes: newMed.notes,
      category: newMed.category
    };

    setMedications(prev => [...prev, created]);
    setNewMed({
      name: '',
      dosage: '',
      frequency: 'Once daily',
      scheduledTime: '12:00',
      notes: '',
      category: 'supplement'
    });
    setIsAddOpen(false);
  };

  const takenCount = medications.filter(m => m.taken).length;
  const totalCount = medications.length;
  const progressPercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <Pill className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">Medication & Supplement Schedule</h3>
              <p className="text-xs text-slate-400 font-medium">Cross-referenced by Groq AI during stress events</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-600 font-medium flex items-center gap-2">
            <span>Adherence:</span>
            <strong className="text-teal-700 font-extrabold">{takenCount} / {totalCount} Taken</strong>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Dose
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Daily Compliance Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Medication List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map(med => (
          <div
            key={med.id}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
              med.taken
                ? 'bg-emerald-50/30 border-emerald-200/80'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      med.category === 'prescription'
                        ? 'bg-rose-100 text-rose-700'
                        : med.category === 'supplement'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {med.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800 mt-1.5">{med.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{med.dosage}</p>
                </div>

                <button
                  onClick={() => toggleTaken(med.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    med.taken
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {med.taken ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Taken
                    </>
                  ) : (
                    'Mark Taken'
                  )}
                </button>
              </div>

              {med.notes && (
                <p className="text-xs text-slate-500 mt-2.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  💡 {med.notes}
                </p>
              )}
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Scheduled: {med.scheduledTime} ({med.frequency})
              </span>
              <button
                onClick={() => deleteMed(med.id)}
                className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Medication Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Add New Dose / Supplement</h3>
            <form onSubmit={handleAddMedication} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Magnesium Glycinate, Ashwagandha"
                  value={newMed.name}
                  onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 200mg"
                    value={newMed.dosage}
                    onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                  <select
                    value={newMed.category}
                    onChange={e => setNewMed({ ...newMed, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="supplement">Supplement</option>
                    <option value="prescription">Prescription</option>
                    <option value="otc">OTC / Electrolyte</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Notes / Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Take with evening break"
                  value={newMed.notes}
                  onChange={e => setNewMed({ ...newMed, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Schedule Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
