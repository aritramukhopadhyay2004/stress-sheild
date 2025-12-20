import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE } from "../utils/api";
import io from "socket.io-client";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import StressChart from "../components/StressChart";

export default function Dashboard({ token, setToken }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [latestReading, setLatestReading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    setupSocket();
  }, []);

  const fetchData = async () => {
    try {
      const [historyRes, alertsRes] = await Promise.all([
        api.get("/api/health/history", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/alerts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setReadings(historyRes.data);
      setAlerts(alertsRes.data);
      if (historyRes.data.length > 0) {
        setLatestReading(historyRes.data[0]);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  const setupSocket = () => {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const socket = io(API_BASE);

    socket.on("connect", () => {
      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      socket.emit("join-user-room", userId);
    });

    socket.on("stress-alert", (data) => {
      toast.error(`⚠️ ${data.stress_level} Stress Detected!`, {
        duration: 5000,
      });
      fetchData();
    });

    return () => socket.disconnect();
  };

  const getStressColor = (level) => {
    const colors = {
      LOW: "text-green-600 bg-green-100",
      NORMAL: "text-blue-600 bg-blue-100",
      MODERATE: "text-yellow-600 bg-yellow-100",
      HIGH: "text-orange-600 bg-orange-100",
      CRITICAL: "text-red-600 bg-red-100",
    };
    return colors[level] || colors.NORMAL;
  };

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar handleLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Stress-Shield Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor your stress levels in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Current Status</p>
                {latestReading ? (
                  <p
                    className={`text-2xl font-bold mt-2 ${
                      getStressColor(latestReading.stress_level).split(" ")[0]
                    }`}
                  >
                    {latestReading.stress_level}
                  </p>
                ) : (
                  <p className="text-gray-400 mt-2">No data</p>
                )}
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Heart Rate</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {latestReading ? `${latestReading.heart_rate} bpm` : "--"}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Temperature</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {latestReading ? `${latestReading.temperature}°C` : "--"}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Readings</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {readings.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StressChart data={readings} />

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Alerts
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.length > 0 ? (
                alerts.slice(0, 10).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start p-4 bg-red-50 rounded-lg border-l-4 border-red-500"
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-red-800">
                        {alert.message}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No alerts yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/health-check")}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Submit New Health Data
          </button>
        </div>
      </div>
    </div>
  );
}
