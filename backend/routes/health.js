const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const axios = require("axios");
const db = require("../config/db");

// ML Service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// Enhanced medication database with specific prescriptions
const MEDICATION_DATABASE = {
  CRITICAL: [
    {
      name: "Alprazolam (Xanax)",
      category: "Benzodiazepine - Fast Acting",
      dosage: "0.25-0.5 mg",
      frequency: "Every 6-8 hours as needed",
      max_daily: "4 mg per day",
      duration: "2-4 weeks maximum (short-term use)",
      purpose: "Immediate anxiety relief and panic attack management",
      sideEffects: "Drowsiness, dizziness, decreased coordination",
      warnings: "⚠️ Risk of dependency - Use only as prescribed",
      contraindications: "Avoid with alcohol, pregnancy, respiratory issues",
    },
    {
      name: "Lorazepam (Ativan)",
      category: "Benzodiazepine - Emergency Relief",
      dosage: "1-2 mg",
      frequency: "Every 8-12 hours as needed",
      max_daily: "6 mg per day",
      duration: "2-4 weeks maximum",
      purpose: "Severe anxiety and acute stress episodes",
      sideEffects: "Sedation, muscle weakness, confusion",
      warnings: "⚠️ Do not stop suddenly - requires gradual tapering",
      contraindications: "Not for long-term use, avoid with CNS depressants",
    },
    {
      name: "Propranolol (Inderal)",
      category: "Beta Blocker - Physical Symptoms",
      dosage: "10-40 mg",
      frequency: "30-60 minutes before stressful event",
      max_daily: "120 mg per day (divided doses)",
      duration: "As needed for situational anxiety",
      purpose: "Controls physical symptoms: rapid heartbeat, trembling, sweating",
      sideEffects: "Fatigue, cold hands/feet, dizziness",
      warnings: "Monitor blood pressure and heart rate",
      contraindications: "Asthma, bradycardia, heart block",
    },
  ],
  HIGH: [
    {
      name: "Sertraline (Zoloft)",
      category: "SSRI - First-line Treatment",
      dosage: "25-50 mg",
      frequency: "Once daily (morning or evening)",
      max_daily: "200 mg per day",
      duration: "6-12 months minimum for effectiveness",
      purpose: "Long-term anxiety and stress management",
      sideEffects: "Nausea, insomnia, decreased appetite, sexual dysfunction",
      warnings: "Takes 4-6 weeks for full effect",
      contraindications: "MAOIs, bleeding disorders",
    },
    {
      name: "Escitalopram (Lexapro)",
      category: "SSRI - Anxiety & Depression",
      dosage: "5-10 mg",
      frequency: "Once daily",
      max_daily: "20 mg per day",
      duration: "6-12 months",
      purpose: "Generalized anxiety disorder, persistent stress",
      sideEffects: "Headache, drowsiness, dry mouth",
      warnings: "May increase anxiety initially - persevere for 2-3 weeks",
      contraindications: "Pregnancy (consult doctor), liver disease",
    },
    {
      name: "Hydroxyzine (Vistaril)",
      category: "Antihistamine - Non-Addictive",
      dosage: "25-50 mg",
      frequency: "Every 6-8 hours as needed",
      max_daily: "400 mg per day",
      duration: "Short to medium-term",
      purpose: "Anxiety relief without addiction risk",
      sideEffects: "Drowsiness, dry mouth, headache",
      warnings: "Safe alternative to benzodiazepines",
      contraindications: "Early pregnancy, prolonged QT interval",
    },
  ],
  MODERATE: [
    {
      name: "Buspirone (BuSpar)",
      category: "Anxiolytic - Non-Sedating",
      dosage: "5-10 mg",
      frequency: "Twice or three times daily",
      max_daily: "60 mg per day",
      duration: "3-6 months",
      purpose: "Chronic anxiety without sedation",
      sideEffects: "Dizziness, nausea, nervousness",
      warnings: "Takes 2-4 weeks to show effects",
      contraindications: "MAOIs within 14 days",
    },
    {
      name: "L-Theanine (Supplement)",
      category: "Natural Supplement - OTC",
      dosage: "200 mg",
      frequency: "1-2 times daily",
      max_daily: "400 mg per day",
      duration: "Ongoing use is safe",
      purpose: "Mild anxiety reduction, promotes relaxation",
      sideEffects: "Minimal - rare headaches",
      warnings: "Natural amino acid from green tea",
      contraindications: "Generally safe, consult for pregnancy",
    },
  ],
};

function generateInterventions(stressLevel, stressScore, heartRate, temperature) {
  const interventions = [];

  if (stressLevel === "CRITICAL" || stressScore >= 8.5) {
    interventions.push({
      intervention_type: "EMERGENCY_MEDICATION",
      category: "PRESCRIPTION",
      description: "🚨 CRITICAL STRESS ALERT - Immediate Action Required",
      medications: MEDICATION_DATABASE.CRITICAL,
      urgency: "IMMEDIATE",
      medical_note: "⚠️ Consult emergency healthcare provider or psychiatrist immediately. These medications require prescription and medical supervision.",
    });

    interventions.push({
      intervention_type: "BREATHING",
      category: "IMMEDIATE_ACTION",
      description: "4-7-8 Emergency Breathing: Inhale 4s, hold 7s, exhale 8s. Repeat 10 times.",
      urgency: "IMMEDIATE",
    });

    interventions.push({
      intervention_type: "BREAK",
      category: "IMMEDIATE_ACTION",
      description: "Mandatory 30-minute complete work stop. Move to a quiet environment.",
      urgency: "IMMEDIATE",
    });
  } else if (stressLevel === "HIGH" || stressScore >= 6.5) {
    interventions.push({
      intervention_type: "PRESCRIPTION_MEDICATION",
      category: "PRESCRIPTION_OR_OTC",
      description: "HIGH STRESS ALERT - Pharmacological & Behavioral Interventions Recommended",
      medications: MEDICATION_DATABASE.HIGH,
      urgency: "HIGH",
      medical_note: "Consult with a physician or psychiatrist regarding SSRIs or short-term anxiolytics.",
    });

    interventions.push({
      intervention_type: "BREATHING",
      category: "IMMEDIATE_ACTION",
      description: "Box Breathing Technique: Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat for 5 minutes.",
      urgency: "HIGH",
    });

    interventions.push({
      intervention_type: "REST",
      category: "RECOVERY",
      description: "Take a 15-minute relaxation break. Step away from all screens.",
      urgency: "HIGH",
    });
  } else if (stressLevel === "MODERATE" || stressScore >= 4.0) {
    interventions.push({
      intervention_type: "OPTIONAL_MEDICATION",
      category: "SUPPORT",
      description: "MODERATE STRESS - Non-Prescription & Anxiolytic Options",
      medications: MEDICATION_DATABASE.MODERATE,
      urgency: "MEDIUM",
      medical_note: "Consider non-sedating options or natural supplements under medical guidance.",
    });

    interventions.push({
      intervention_type: "MEDITATION",
      category: "MENTAL_HEALTH",
      description: "Guided 10-minute mindfulness meditation session.",
      urgency: "MEDIUM",
    });

    interventions.push({
      intervention_type: "HYDRATION",
      category: "PHYSICAL",
      description: "Drink 500ml of cold water to lower core body temperature and pulse.",
      urgency: "MEDIUM",
    });
  } else {
    interventions.push({
      intervention_type: "PREVENTIVE",
      category: "WELLNESS",
      description: "Stress levels optimal. Maintain current work-rest balance.",
      urgency: "LOW",
    });
  }

  return interventions;
}

// POST new health reading
router.post("/", auth, async (req, res) => {
  try {
    const { heart_rate, skin_conductance, temperature } = req.body;

    if (!heart_rate || !skin_conductance || !temperature) {
      return res.status(400).json({ error: "All biometric fields are required" });
    }

    let stressLevel = "MODERATE";
    let stressScore = 5.0;

    try {
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
        heart_rate: parseFloat(heart_rate),
        skin_conductance: parseFloat(skin_conductance),
        temperature: parseFloat(temperature),
      });
      stressLevel = mlResponse.data.stress_level;
      stressScore = mlResponse.data.stress_score;
    } catch (mlError) {
      console.error("ML service error, using fallback heuristic:", mlError.message);
    }

    const reading = await db.insertHealthReading({
      user_id: req.user.id,
      heart_rate: parseFloat(heart_rate),
      skin_conductance: parseFloat(skin_conductance),
      temperature: parseFloat(temperature),
      stress_level: stressLevel,
      stress_score: parseFloat(stressScore.toFixed(2)),
    });

    if (stressLevel === "HIGH" || stressLevel === "CRITICAL") {
      await db.insertAlert({
        user_id: req.user.id,
        message: `${stressLevel.charAt(0) + stressLevel.slice(1).toLowerCase()} stress detected! Score: ${stressScore.toFixed(2)}`,
        alert_level: stressLevel,
      });
    }

    const interventionsData = generateInterventions(
      stressLevel,
      stressScore,
      parseFloat(heart_rate),
      parseFloat(temperature)
    );

    if (interventionsData.length > 0) {
      const interventionsToInsert = interventionsData.map((intervention) => ({
        user_id: req.user.id,
        intervention_type: intervention.intervention_type,
        category: intervention.category,
        description: intervention.description,
        urgency: intervention.urgency,
        medications: intervention.medications || [],
        medical_note: intervention.medical_note || null,
      }));

      await db.insertInterventions(interventionsToInsert);
    }

    res.status(201).json({
      message: "Health data recorded successfully",
      reading,
      stressLevel,
      stressScore,
      interventions: interventionsData,
    });
  } catch (error) {
    console.error("Error recording health data:", error);
    res.status(500).json({ error: "Failed to record health data" });
  }
});

// GET user's health readings
router.get("/", auth, async (req, res) => {
  try {
    const readings = await db.getHealthReadings(req.user.id, 50);
    res.json(readings || []);
  } catch (error) {
    console.error("Error fetching health readings:", error);
    res.status(500).json({ error: "Failed to fetch health readings" });
  }
});

// GET user's interventions
router.get("/interventions", auth, async (req, res) => {
  try {
    const interventions = await db.getInterventions(req.user.id);
    res.json(interventions || []);
  } catch (error) {
    console.error("Error fetching interventions:", error);
    res.status(500).json({ error: "Failed to fetch interventions" });
  }
});

// Mark intervention as completed
router.patch("/interventions/:id/complete", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.markInterventionComplete(id);
    res.json(data || { success: true });
  } catch (error) {
    console.error("Error updating intervention:", error);
    res.status(500).json({ error: "Failed to update intervention" });
  }
});

// GET dashboard stats
router.get("/stats", auth, async (req, res) => {
  try {
    const readings = await db.getHealthReadings(req.user.id, 1);
    const latestReading = readings[0] || null;
    const currentStatus = latestReading?.stress_level || "N/A";

    res.json({
      currentStatus,
      latestReading,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Hardware / ESP32 Ingestion Endpoint
router.post("/iot-sensor-data", async (req, res) => {
  try {
    const { device_id, heart_rate, skin_conductance, temperature, user_id } = req.body;

    if (!heart_rate || !skin_conductance || !temperature) {
      return res.status(400).json({ error: "Missing biometric sensor readings (heart_rate, skin_conductance, temperature)" });
    }

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
      heart_rate: parseFloat(heart_rate),
      skin_conductance: parseFloat(skin_conductance),
      temperature: parseFloat(temperature),
    });

    const { stress_level, stress_score, confidence, model_type } = mlResponse.data;
    const targetUserId = user_id || req.body.userId || "demo-user-id";

    const io = req.app.locals.io;
    if (io) {
      io.to(`user-${targetUserId}`).emit("iot-live-reading", {
        device_id: device_id || "ESP32-WEARABLE-01",
        heart_rate,
        skin_conductance,
        temperature,
        stress_level,
        stress_score,
        timestamp: new Date().toISOString()
      });

      if (stress_level === "HIGH" || stress_level === "CRITICAL") {
        io.to(`user-${targetUserId}`).emit("stress-alert", {
          level: stress_level,
          message: `🚨 Hardware Alert: ${stress_level} Stress detected by ESP32 sensor (Score: ${stress_score})`,
          timestamp: new Date().toISOString()
        });
      }
    }

    res.json({
      success: true,
      device_id: device_id || "ESP32-WEARABLE-01",
      biometrics: { heart_rate, skin_conductance, temperature },
      analysis: { stress_level, stress_score, confidence, model_type }
    });
  } catch (error) {
    console.error("Error processing IoT sensor data:", error.message);
    res.status(500).json({ error: "Failed to process hardware sensor reading" });
  }
});

module.exports = router;
