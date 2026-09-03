import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { BiometricReading } from '../types';
import { Activity, Clock } from 'lucide-react';

interface HeartRateTrendChartProps {
  data: BiometricReading[];
}

export const HeartRateTrendChart: React.FC<HeartRateTrendChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<'Live' | '1H' | '24H'>('Live');

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              Biometric Strain & Autonomic Trend
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Synchronized Heart Rate (bpm) vs Galvanic Stress Score (0-100) timeline
          </p>
        </div>

        {/* Time Filter Controls & Metric Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Stress Score
            </span>
            <span className="flex items-center gap-1.5 text-sky-700">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              Heart Rate (BPM)
            </span>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
            {(['Live', '1H', '24H'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-white text-slate-800 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[30, 140]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
              }}
              formatter={(value: any, name: string) => [
                value,
                name === 'stressScore' ? 'Stress Index (0-100)' : 'Heart Rate (bpm)'
              ]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            {/* Threshold line at 70 (High Stress) */}
            <ReferenceLine
              y={70}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              label={{ value: 'High Strain Threshold (70)', fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }}
            />

            <Area
              type="monotone"
              dataKey="stressScore"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#stressGrad)"
            />
            <Area
              type="monotone"
              dataKey="heartRate"
              stroke="#0284c7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#hrGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Updating every 3s via PPG Random-Walk Telemetry
        </span>
        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          Autonomic Stability: Normal
        </span>
      </div>
    </div>
  );
};
