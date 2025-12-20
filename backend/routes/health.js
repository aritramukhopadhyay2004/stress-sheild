const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const auth = require('../middleware/auth');
const axios = require('axios');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ML Service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// Enhanced medication database with specific prescriptions
const MEDICATION_DATABASE = {
  CRITICAL: [
    {
      name: 'Alprazolam (Xanax)',
      category: 'Benzodiazepine - Fast Acting',
      dosage: '0.25-0.5 mg',
      frequency: 'Every 6-8 hours as needed',
      max_daily: '4 mg per day',
      duration: '2-4 weeks maximum (short-term use)',
      purpose: 'Immediate anxiety relief and panic attack management',
      sideEffects: 'Drowsiness, dizziness, decreased coordination',
      warnings: '⚠️ Risk of dependency - Use only as prescribed',
      contraindications: 'Avoid with alcohol, pregnancy, respiratory issues',
    },
    {
      name: 'Lorazepam (Ativan)',
      category: 'Benzodiazepine - Emergency Relief',
      dosage: '1-2 mg',
      frequency: 'Every 8-12 hours as needed',
      max_daily: '6 mg per day',
      duration: '2-4 weeks maximum',
      purpose: 'Severe anxiety and acute stress episodes',
      sideEffects: 'Sedation, muscle weakness, confusion',
      warnings: '⚠️ Do not stop suddenly - requires gradual tapering',
      contraindications: 'Not for long-term use, avoid with CNS depressants',
    },
    {
      name: 'Propranolol (Inderal)',
      category: 'Beta Blocker - Physical Symptoms',
      dosage: '10-40 mg',
      frequency: '30-60 minutes before stressful event',
      max_daily: '120 mg per day (divided doses)',
      duration: 'As needed for situational anxiety',
      purpose: 'Controls physical symptoms: rapid heartbeat, trembling, sweating',
      sideEffects: 'Fatigue, cold hands/feet, dizziness',
      warnings: 'Monitor blood pressure and heart rate',
      contraindications: 'Asthma, bradycardia, heart block',
    },
  ],
  HIGH: [
    {
      name: 'Sertraline (Zoloft)',
      category: 'SSRI - First-line Treatment',
      dosage: '25-50 mg',
      frequency: 'Once daily (morning or evening)',
      max_daily: '200 mg per day',
      duration: '6-12 months minimum for effectiveness',
      purpose: 'Long-term anxiety and stress management',
      sideEffects: 'Nausea, insomnia, decreased appetite, sexual dysfunction',
      warnings: 'Takes 4-6 weeks for full effect',
      contraindications: 'MAOIs, bleeding disorders',
    },
    {
      name: 'Escitalopram (Lexapro)',
      category: 'SSRI - Anxiety & Depression',
      dosage: '5-10 mg',
      frequency: 'Once daily',
      max_daily: '20 mg per day',
      duration: '6-12 months',
      purpose: 'Generalized anxiety disorder, persistent stress',
      sideEffects: 'Headache, drowsiness, dry mouth',
      warnings: 'May increase anxiety initially - persevere for 2-3 weeks',
      contraindications: 'Pregnancy (consult doctor), liver disease',
    },
    {
      name: 'Hydroxyzine (Vistaril)',
      category: 'Antihistamine - Non-Addictive',
      dosage: '25-50 mg',
      frequency: 'Every 6-8 hours as needed',
      max_daily: '400 mg per day',
      duration: 'Short to medium-term',
      purpose: 'Anxiety relief without addiction risk',
      sideEffects: 'Drowsiness, dry mouth, headache',
      warnings: 'Safe alternative to benzodiazepines',
      contraindications: 'Early pregnancy, prolonged QT interval',
    },
  ],
  MODERATE: [
    {
      name: 'Buspirone (BuSpar)',
      category: 'Anxiolytic - Non-Sedating',
      dosage: '5-10 mg',
      frequency: 'Twice or three times daily',
      max_daily: '60 mg per day',
      duration: '3-6 months',
      purpose: 'Chronic anxiety without sedation',
      sideEffects: 'Dizziness, nausea, nervousness',
      warnings: 'Takes 2-4 weeks to show effects',
      contraindications: 'MAOIs within 14 days',
    },
    {
      name: 'L-Theanine (Supplement)',
      category: 'Natural Supplement - OTC',
      dosage: '200 mg',
      frequency: '1-2 times daily',
      max_daily: '400 mg per day',
      duration: 'Ongoing use is safe',
      purpose: 'Mild anxiety reduction, promotes relaxation',
      sideEffects: 'Minimal - rare headaches',
      warnings: 'Natural amino acid from green tea',
      contraindications: 'Generally safe, consult for pregnancy',
    },
  ],
};

// Helper function to generate comprehensive interventions with medications
function generateInterventions(stressLevel, stressScore, heartRate, temperature) {
  const interventions = [];

  if (stressLevel === 'CRITICAL' || stressScore >= 9) {
    const criticalMeds = MEDICATION_DATABASE.CRITICAL;
    
    interventions.push({
      intervention_type: 'EMERGENCY_MEDICATION',
      category: 'PRESCRIPTION',
      description: `🚨 CRITICAL STRESS ALERT - Medical Intervention Required`,
      medications: criticalMeds,
      urgency: 'IMMEDIATE',
      medical_note: '⚠️ Consult emergency healthcare provider or psychiatrist immediately. These medications require prescription and medical supervision.',
    });

    interventions.push({
      intervention_type: 'BREATHING',
      category: 'IMMEDIATE_ACTION',
      description: '4-7-8 Emergency Breathing Technique: Inhale through nose for 4 seconds, hold for 7 seconds, exhale through mouth for 8 seconds. Repeat 10 times.',
      urgency: 'IMMEDIATE',
    });

    interventions.push({
      intervention_type: 'EMERGENCY_CONTACT',
      category: 'SUPPORT',
      description: '📞 Contact crisis helpline: 1-800-273-8255 (National Suicide Prevention Lifeline) or text HOME to 741741 (Crisis Text Line)',
      urgency: 'IMMEDIATE',
    });

    interventions.push({
      intervention_type: 'REST',
      category: 'RECOVERY',
      description: '🛏️ Mandatory rest period: Take immediate 3-4 hour break. Remove yourself from stressful environment. Consider medical leave if symptoms persist.',
      urgency: 'HIGH',
    });

    interventions.push({
      intervention_type: 'HYDRATION',
      category: 'PHYSICAL',
      description: '💧 Drink 500ml water immediately. Severe stress causes dehydration which worsens symptoms.',
      urgency: 'HIGH',
    });

  } else if (stressLevel === 'HIGH' || stressScore >= 7) {
    const highMeds = MEDICATION_DATABASE.HIGH;
    
    interventions.push({
      intervention_type: 'PRESCRIPTION_MEDICATION',
      category: 'PRESCRIPTION',
      description: '💊 Recommended Medications for High Stress Management',
      medications: highMeds,
      urgency: 'HIGH',
      medical_note: '⚠️ Consult your doctor or psychiatrist before starting any medication. Prescriptions required.',
    });

    interventions.push({
      intervention_type: 'BREATHING',
      category: 'IMMEDIATE_ACTION',
      description: '🫁 Box Breathing Exercise: Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat for 5-10 minutes.',
      urgency: 'HIGH',
    });

    interventions.push({
      intervention_type: 'BREAK',
      category: 'TIME_MANAGEMENT',
      description: '⏰ Take 30-minute break immediately. Walk outside, practice grounding techniques (5-4-3-2-1 method).',
      urgency: 'HIGH',
    });

    interventions.push({
      intervention_type: 'MEDITATION',
      category: 'MENTAL_HEALTH',
      description: '🧘 Guided meditation: Use apps like Calm, Headspace, or Insight Timer for 15-minute stress relief session.',
      urgency: 'MEDIUM',
    });

    interventions.push({
      intervention_type: 'PROFESSIONAL_HELP',
      category: 'SUPPORT',
      description: '👨‍⚕️ Schedule appointment with mental health professional within 48 hours. Consider therapy (CBT) along with medication.',
      urgency: 'HIGH',
    });

  } else if (stressLevel === 'MODERATE' || stressScore >= 5) {
    const moderateMeds = MEDICATION_DATABASE.MODERATE;
    
    interventions.push({
      intervention_type: 'OPTIONAL_MEDICATION',
      category: 'PRESCRIPTION_OR_OTC',
      description: '💊 Optional Medication Support for Moderate Stress',
      medications: moderateMeds,
      urgency: 'MEDIUM',
      medical_note: 'Consult healthcare provider. Some options available over-the-counter.',
    });

    interventions.push({
      intervention_type: 'BREATHING',
      category: 'SELF_CARE',
      description: '🫁 Deep Breathing: Take 10 slow, deep breaths. Focus on extending exhale longer than inhale.',
      urgency: 'MEDIUM',
    });

    interventions.push({
      intervention_type: 'BREAK',
      category: 'TIME_MANAGEMENT',
      description: '☕ 15-minute break: Step away from work. Do light stretching or take a short walk.',
      urgency: 'MEDIUM',
    });

    interventions.push({
      intervention_type: 'ACTIVITY',
      category: 'PHYSICAL',
      description: '🏃 Physical activity: 20-30 minutes of exercise (walking, yoga, or light cardio) to reduce cortisol.',
      urgency: 'MEDIUM',
    });

  } else {
    interventions.push({
      intervention_type: 'MAINTENANCE',
      category: 'WELLNESS',
      description: '✅ Excellent stress management! Continue your current wellness routine.',
      urgency: 'LOW',
    });

    interventions.push({
      intervention_type: 'PREVENTIVE',
      category: 'WELLNESS',
      description: '🌿 Preventive care: Maintain regular sleep schedule (7-8 hours), balanced diet, and daily exercise.',
      urgency: 'LOW',
    });
  }

  return interventions;
}

// POST new health reading
router.post('/', auth, async (req, res) => {
  try {
    const { heart_rate, skin_conductance, temperature } = req.body;

    // Validate input
    if (!heart_rate || !skin_conductance || !temperature) {
      return res.status(400).json({ error: 'All health metrics are required' });
    }

    // ✅ ======== UPDATED SECTION STARTS HERE ========
    // Call ML service for stress prediction with robust fallback
    let stressLevel = 'MODERATE';
    let stressScore = 5.0;

    try {
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
        heart_rate: parseFloat(heart_rate),
        skin_conductance: parseFloat(skin_conductance),
        temperature: parseFloat(temperature),
      }, {
        timeout: 10000, // ✅ Increased timeout to 10 seconds
      });

      stressLevel = mlResponse.data.stress_level;
      stressScore = mlResponse.data.stress_score;
      
      console.log('✅ ML Service responded:', { stressLevel, stressScore });
    } catch (mlError) {
      console.error('⚠️ ML Service unavailable, using fallback calculation:', mlError.message);
      
      // ✅ IMPROVED FALLBACK: More accurate stress calculation
      const hr = parseFloat(heart_rate);
      const sc = parseFloat(skin_conductance);
      const temp = parseFloat(temperature);
      
      // Normalize each metric (0-10 scale)
      const hrScore = Math.max(0, Math.min(10, (hr - 60) / 8)); // 60-140 bpm range
      const scScore = Math.min(10, sc); // Direct skin conductance
      const tempScore = Math.max(0, Math.min(10, (temp - 36.5) * 5)); // 36.5-38.5°C range
      
      // Weighted average (HR: 40%, SC: 40%, Temp: 20%)
      stressScore = (hrScore * 0.4 + scScore * 0.4 + tempScore * 0.2);
      stressScore = Math.max(0, Math.min(10, parseFloat(stressScore.toFixed(2))));

      // Determine stress level
      if (stressScore >= 8.5) stressLevel = 'CRITICAL';
      else if (stressScore >= 6.5) stressLevel = 'HIGH';
      else if (stressScore >= 4.0) stressLevel = 'MODERATE';
      else stressLevel = 'LOW';
      
      console.log('📊 Fallback calculation:', { hr, sc, temp, stressScore, stressLevel });
    }
    // ✅ ======== UPDATED SECTION ENDS HERE ========

    // Insert health reading
    const now = new Date().toISOString();
    const { data: reading, error: readingError } = await supabase
      .from('health_readings')
      .insert({
        user_id: req.user.id,
        heart_rate: parseFloat(heart_rate),
        skin_conductance: parseFloat(skin_conductance),
        temperature: parseFloat(temperature),
        stress_level: stressLevel,
        stress_score: parseFloat(stressScore.toFixed(2)),
        recorded_at: now,
        created_at: now,
      })
      .select()
      .single();

    if (readingError) throw readingError;

    // Create alert if stress is high or critical
    if (stressLevel === 'HIGH' || stressLevel === 'CRITICAL') {
      const { error: alertError } = await supabase
        .from('alerts')
        .insert({
          user_id: req.user.id,
          reading_id: reading.id,
          severity: stressLevel,
          message: `${stressLevel.charAt(0) + stressLevel.slice(1).toLowerCase()} stress detected! Score: ${stressScore.toFixed(2)}`,
        });

      if (alertError) console.error('Alert creation error:', alertError);
    }

    // Generate comprehensive interventions with medications
    const interventionsData = generateInterventions(
      stressLevel, 
      stressScore, 
      parseFloat(heart_rate), 
      parseFloat(temperature)
    );
    
    if (interventionsData.length > 0) {
      const interventionsToInsert = interventionsData.map(intervention => ({
        user_id: req.user.id,
        reading_id: reading.id,
        intervention_type: intervention.intervention_type,
        category: intervention.category,
        description: intervention.description,
        urgency: intervention.urgency,
        medications: intervention.medications ? JSON.stringify(intervention.medications) : null,
        medical_note: intervention.medical_note || null,
        completed: false,
      }));

      const { error: interventionError } = await supabase
        .from('interventions')
        .insert(interventionsToInsert);

      if (interventionError) console.error('Intervention creation error:', interventionError);
    }

    // Emit socket event for real-time updates
    if (req.app.get('io')) {
      req.app.get('io').to(`user_${req.user.id}`).emit('new_reading', {
        reading,
        stressLevel,
        stressScore,
        interventions: interventionsData,
      });
    }

    res.status(201).json({
      message: 'Health data recorded successfully',
      reading,
      stressLevel,
      stressScore,
      interventions: interventionsData,
    });
  } catch (error) {
    console.error('Error recording health data:', error);
    res.status(500).json({ error: 'Failed to record health data' });
  }
});

// GET user's health readings
router.get('/', auth, async (req, res) => {
  try {
    const { data: readings, error } = await supabase
      .from('health_readings')
      .select('*')
      .eq('user_id', req.user.id)
      .order('recorded_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json(readings);
  } catch (error) {
    console.error('Error fetching health readings:', error);
    res.status(500).json({ error: 'Failed to fetch health readings' });
  }
});

// GET user's interventions
router.get('/interventions', auth, async (req, res) => {
  try {
    const { data: interventions, error } = await supabase
      .from('interventions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('recommended_at', { ascending: false })
      .limit(15);

    if (error) throw error;

    // Parse medications JSON for each intervention
    const parsedInterventions = interventions.map(intervention => ({
      ...intervention,
      medications: intervention.medications ? JSON.parse(intervention.medications) : null,
    }));

    res.json(parsedInterventions);
  } catch (error) {
    console.error('Error fetching interventions:', error);
    res.status(500).json({ error: 'Failed to fetch interventions' });
  }
});

// Mark intervention as completed
router.patch('/interventions/:id/complete', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('interventions')
      .update({ 
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating intervention:', error);
    res.status(500).json({ error: 'Failed to update intervention' });
  }
});

// GET dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const { data: readings, error } = await supabase
      .from('health_readings')
      .select('*')
      .eq('user_id', req.user.id)
      .order('recorded_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    const latestReading = readings[0] || null;
    const currentStatus = latestReading?.stress_level || 'N/A';

    res.json({
      currentStatus,
      latestReading,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
