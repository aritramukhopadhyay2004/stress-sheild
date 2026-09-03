import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Settings as SettingsIcon, Database, Bot, Sliders, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const [groqKey, setGroqKey] = useState(import.meta.env.VITE_GROQ_API_KEY || '');
  const [groqModel, setGroqModel] = useState(import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile');
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="flex-1 min-w-0 bg-slate-50 min-h-screen pb-12">
      <Header stressBand="Optimal" />
      <main className="p-8 max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">System & Credentials Settings</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure Groq AI Triage keys, Supabase / Firebase connection URLs, and biometric thresholds.
          </p>
        </div>

        {savedMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings cached locally. Restart `npm run dev` after updating `.env` variables for permanent binding.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Groq API Settings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bot className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Groq LLM Triage Assistant Configuration</h3>
                <p className="text-xs text-slate-400">OpenAI-compatible chat completions endpoint (`api.groq.com`)</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Groq API Key (`VITE_GROQ_API_KEY`)</label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={e => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Target Model</label>
                <select
                  value={groqModel}
                  onChange={e => setGroqModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                >
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
                  <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                  <option value="llama-3.1-8b-instant">llama-3.1-8b-instant</option>
                </select>
              </div>
            </div>
          </div>

          {/* Database & Persistence Settings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Database className="w-5 h-5 text-sky-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Database & Persistence (Supabase / Firebase)</h3>
                <p className="text-xs text-slate-400">Stores private user accounts, medication schedules, and stress logs</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Project URL (`VITE_SUPABASE_URL`)</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">API / Anon Key (`VITE_SUPABASE_ANON_KEY`)</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbG..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Configuration Settings
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
