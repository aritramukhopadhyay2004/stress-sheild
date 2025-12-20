import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StressChart({ data }) {
  const chartData = data.slice(0, 20).reverse().map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    'Heart Rate': reading.heart_rate,
    'Stress Score': reading.stress_score * 10,
    'Temperature': reading.temperature * 2.5
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Health Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Heart Rate" stroke="#ef4444" strokeWidth={2} />
          <Line type="monotone" dataKey="Stress Score" stroke="#f59e0b" strokeWidth={2} />
          <Line type="monotone" dataKey="Temperature" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
