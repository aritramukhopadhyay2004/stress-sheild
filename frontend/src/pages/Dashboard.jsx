import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity,
  Heart,
  Thermometer,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Pill,
  Lightbulb,
  Coffee,
  Wind,
  Moon,
  Dumbbell,
  AlertCircle,
  Phone,
  Shield,
  Clock,
  Info,
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [statsRes, readingsRes, alertsRes, interventionsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/health/stats`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/health`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/alerts`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/api/health/interventions`, config),
      ]);

      setStats(statsRes.data);
      setReadings(readingsRes.data);
      setAlerts(alertsRes.data);
      setInterventions(interventionsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const markInterventionComplete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/health/interventions/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchDashboardData();
    } catch (error) {
      console.error('Error marking intervention as complete:', error);
    }
  };

  const getStressColor = (level) => {
    const colors = {
      LOW: 'text-green-600',
      MODERATE: 'text-yellow-600',
      HIGH: 'text-orange-600',
      CRITICAL: 'text-red-600',
    };
    return colors[level] || 'text-gray-600';
  };

  const getStressBgColor = (level) => {
    const colors = {
      LOW: 'bg-green-50 border-green-200',
      MODERATE: 'bg-yellow-50 border-yellow-200',
      HIGH: 'bg-orange-50 border-orange-200',
      CRITICAL: 'bg-red-50 border-red-200',
    };
    return colors[level] || 'bg-gray-50 border-gray-200';
  };

  const getUrgencyBadge = (urgency) => {
    const styles = {
      IMMEDIATE: 'bg-red-100 text-red-800 border-red-300',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      LOW: 'bg-green-100 text-green-800 border-green-300',
    };
    return styles[urgency] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getInterventionIcon = (type) => {
    switch (type) {
      case 'EMERGENCY_MEDICATION':
      case 'PRESCRIPTION_MEDICATION':
      case 'OPTIONAL_MEDICATION':
        return <Pill className="w-6 h-6 text-blue-600" />;
      case 'BREATHING':
        return <Wind className="w-6 h-6 text-green-600" />;
      case 'BREAK':
        return <Coffee className="w-6 h-6 text-yellow-600" />;
      case 'HYDRATION':
        return <Heart className="w-6 h-6 text-cyan-600" />;
      case 'REST':
        return <Moon className="w-6 h-6 text-indigo-600" />;
      case 'MEDITATION':
        return <Lightbulb className="w-6 h-6 text-purple-600" />;
      case 'ACTIVITY':
        return <Dumbbell className="w-6 h-6 text-orange-600" />;
      case 'EMERGENCY_CONTACT':
        return <Phone className="w-6 h-6 text-red-600" />;
      case 'PROFESSIONAL_HELP':
        return <Shield className="w-6 h-6 text-blue-600" />;
      case 'PREVENTIVE':
      case 'MAINTENANCE':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Info className="w-6 h-6 text-gray-600" />;
    }
  };

  const getInterventionColor = (category) => {
    const colors = {
      PRESCRIPTION: 'border-blue-400 bg-blue-50',
      PRESCRIPTION_OR_OTC: 'border-indigo-400 bg-indigo-50',
      IMMEDIATE_ACTION: 'border-red-400 bg-red-50',
      SUPPORT: 'border-purple-400 bg-purple-50',
      RECOVERY: 'border-orange-400 bg-orange-50',
      PHYSICAL: 'border-cyan-400 bg-cyan-50',
      TIME_MANAGEMENT: 'border-yellow-400 bg-yellow-50',
      MENTAL_HEALTH: 'border-pink-400 bg-pink-50',
      SELF_CARE: 'border-green-400 bg-green-50',
      WELLNESS: 'border-teal-400 bg-teal-50',
    };
    return colors[category] || 'border-gray-300 bg-gray-50';
  };

  const formatChartData = () => {
    return readings.slice(0, 10).reverse().map((reading) => ({
      time: new Date(reading.recorded_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      heartRate: reading.heart_rate,
      temperature: reading.temperature,
      stressScore: reading.stress_score,
    }));
  };

  // Medication Modal Component
  const MedicationModal = ({ medication, onClose }) => {
    if (!medication) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-1">{medication.name}</h3>
                <p className="text-blue-100">{medication.category}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Purpose */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-900 mb-2">💊 Purpose</h4>
              <p className="text-blue-800">{medication.purpose}</p>
            </div>

            {/* Dosage Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">📏 Starting Dosage</h4>
                <p className="text-green-800 text-lg font-semibold">{medication.dosage}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-purple-900 mb-2">⏰ Frequency</h4>
                <p className="text-purple-800">{medication.frequency}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-bold text-orange-900 mb-2">⚠️ Maximum Daily</h4>
                <p className="text-orange-800 font-semibold">{medication.max_daily}</p>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-bold text-indigo-900 mb-2">📅 Duration</h4>
                <p className="text-indigo-800">{medication.duration}</p>
              </div>
            </div>

            {/* Side Effects */}
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-bold text-yellow-900 mb-2">⚠️ Common Side Effects</h4>
              <p className="text-yellow-800">{medication.sideEffects}</p>
            </div>

            {/* Warnings */}
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-red-900 mb-2">🚨 Important Warnings</h4>
              <p className="text-red-800 font-semibold">{medication.warnings}</p>
            </div>

            {/* Contraindications */}
            <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
              <h4 className="font-bold text-pink-900 mb-2">🚫 Contraindications</h4>
              <p className="text-pink-800">{medication.contraindications}</p>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
              <p className="text-gray-700 text-sm">
                <strong>Medical Disclaimer:</strong> This information is for educational purposes only. 
                Always consult with a qualified healthcare provider before starting, stopping, or changing 
                any medication. Individual responses may vary. Do not use this as a substitute for 
                professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Stress-Shield Dashboard
          </h1>
          <p className="text-gray-600">Monitor your stress levels in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <p className={`text-2xl font-bold ${getStressColor(stats?.currentStatus)}`}>
                  {stats?.currentStatus || 'N/A'}
                </p>
              </div>
              <Activity className="w-12 h-12 text-indigo-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Heart Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.latestReading?.heart_rate || 0} bpm
                </p>
              </div>
              <Heart className="w-12 h-12 text-red-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.latestReading?.temperature || 0}°C
                </p>
              </div>
              <Thermometer className="w-12 h-12 text-orange-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Readings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {readings.length || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Health Trends Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#ef4444"
                  name="Heart Rate"
                />
                <Line
                  type="monotone"
                  dataKey="stressScore"
                  stroke="#f59e0b"
                  name="Stress Score"
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  name="Temperature"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${getStressBgColor(alert.severity)}`}
                  >
                    <div className="flex items-start">
                      <AlertTriangle className={`w-5 h-5 mr-3 mt-0.5 ${getStressColor(alert.severity)}`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{alert.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No alerts yet</p>
              )}
            </div>
          </div>
        </div>

        {/* ENHANCED: Suggested Medication and Tips */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-purple-600">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
            <Pill className="w-7 h-7 mr-3 text-purple-600" />
            Personalized Medication & Wellness Plan
          </h2>
          
          <div className="space-y-6">
            {interventions.length > 0 ? (
              interventions.map((intervention) => (
                <div
                  key={intervention.id}
                  className={`rounded-xl border-2 transition-all duration-300 ${
                    intervention.completed
                      ? 'bg-gray-50 border-gray-300 opacity-70'
                      : `${getInterventionColor(intervention.category)} shadow-md hover:shadow-lg`
                  }`}
                >
                  {/* Intervention Header */}
                  <div className="p-5 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className="mr-4 mt-1 p-3 bg-white rounded-xl shadow-sm">
                          {getInterventionIcon(intervention.intervention_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="font-bold text-xl text-gray-800">
                              {intervention.intervention_type.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getUrgencyBadge(intervention.urgency)}`}>
                              <Clock className="w-3 h-3 inline mr-1" />
                              {intervention.urgency}
                            </span>
                            {intervention.completed && (
                              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center font-semibold">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {intervention.description}
                          </p>
                          {intervention.medical_note && (
                            <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                              <p className="text-sm text-yellow-800">
                                <strong>Medical Note:</strong> {intervention.medical_note}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      {!intervention.completed && (
                        <button
                          onClick={() => markInterventionComplete(intervention.id)}
                          className="ml-4 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                          ✓ Done
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Medication Details */}
                  {intervention.medications && intervention.medications.length > 0 && (
                    <div className="p-5 bg-white bg-opacity-60">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                        <Pill className="w-5 h-5 mr-2 text-blue-600" />
                        Recommended Medications:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {intervention.medications.map((med, idx) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer hover:shadow-md"
                            onClick={() => setSelectedMedication(med)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-bold text-blue-900 text-sm">{med.name}</h5>
                              <Info className="w-4 h-4 text-blue-500" />
                            </div>
                            <p className="text-xs text-blue-700 mb-2">{med.category}</p>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-700">
                                <strong>Dosage:</strong> {med.dosage}
                              </p>
                              <p className="text-xs text-gray-700">
                                <strong>Frequency:</strong> {med.frequency}
                              </p>
                            </div>
                            <button className="mt-3 w-full bg-blue-600 text-white text-xs py-2 rounded-md hover:bg-blue-700 transition">
                              View Full Details
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-dashed border-purple-300">
                <Lightbulb className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold text-lg mb-2">No recommendations yet</p>
                <p className="text-sm text-gray-500">
                  Submit health data to get personalized medication and wellness plans
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit New Data Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/submit')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Submit New Health Data
          </button>
        </div>
      </div>

      {/* Medication Modal */}
      {selectedMedication && (
        <MedicationModal
          medication={selectedMedication}
          onClose={() => setSelectedMedication(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
