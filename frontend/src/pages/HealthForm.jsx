import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function HealthForm({ token }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    heart_rate: 75,
    skin_conductance: 2.5,
    temperature: 37.0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/health/reading", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Health data submitted successfully!");

      if (
        response.data.stress_level === "HIGH" ||
        response.data.stress_level === "CRITICAL"
      ) {
        toast.error(`Alert: ${response.data.stress_level} stress detected!`, {
          duration: 5000,
        });
      }

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Health Check
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your current biometric readings
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              value={formData.heart_rate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heart_rate: parseFloat(e.target.value),
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="40"
              max="200"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Normal: 60-100 bpm</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skin Conductance (μS)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.skin_conductance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skin_conductance: parseFloat(e.target.value),
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="0"
              max="10"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Normal: 1-5 μS</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  temperature: parseFloat(e.target.value),
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="35"
              max="42"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Normal: 36.5-37.5°C</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Submit Health Data"}
          </button>
        </form>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-4 text-indigo-600 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
