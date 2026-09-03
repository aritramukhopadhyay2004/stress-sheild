import React from 'react';
import { Bell, Zap, Radio, ShieldCheck, Watch } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { StressBand } from '../types';
import { useWebBluetooth } from '../hooks/useWebBluetooth';

interface HeaderProps {
  stressBand: StressBand;
  onTriggerSpike?: () => void;
  onHeartRateReceived?: (bpm: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ stressBand, onTriggerSpike, onHeartRateReceived }) => {
  const { user } = useAuth();
  const { isConnected, deviceName, latestHR, connectSmartwatch, error } = useWebBluetooth(onHeartRateReceived);

  const bandColors = {
    Optimal: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    Elevated: 'bg-amber-500/10 text-amber-700 border-amber-300',
    High: 'bg-rose-500/10 text-rose-700 border-rose-300'
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      {/* Title & Status Subtitle */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Good shift, {user?.name?.split(' ')[0] || 'Alex'} 👋
          </h2>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              bandColors[stressBand] || bandColors.Optimal
            }`}
          >
            {stressBand} Zone
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Monitoring continuous PPG heart rate and duty-cycle autonomic strain.
        </p>
      </div>

      {/* Action Controls & Indicators */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Connect Smartwatch via Web Bluetooth */}
        <button
          onClick={connectSmartwatch}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-150 shadow-xs ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
          }`}
          title="Connect smartwatch / BLE heart rate sensor directly via browser"
        >
          <Watch className="w-3.5 h-3.5" />
          <span>{isConnected ? `Connected: ${deviceName} (${latestHR || '--'} bpm)` : 'Pair Smartwatch (BLE)'}</span>
        </button>

        {/* Quick Simulator Trigger Button for Demo */}
        {onTriggerSpike && (
          <button
            onClick={onTriggerSpike}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all duration-150 shadow-xs"
            title="Simulate acute physiological stress event for live triage testing"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Simulate Stress Spike
          </button>
        )}

        {/* System Online Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Radio className="w-3.5 h-3.5" />
          <span>System Online</span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
        </button>
      </div>

      {error && (
        <div className="w-full text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200 font-medium">
          ⚠️ {error}
        </div>
      )}
    </header>
  );
};
