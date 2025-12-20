const express = require('express');
const router = express.Router();
const axios = require('axios');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// Submit health reading
router.post('/reading', authMiddleware, async (req, res) => {
  try {
    const { heart_rate, skin_conductance, temperature } = req.body;
    const userId = req.userId;
    
    // Call ML service for stress classification
    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, {
      heart_rate,
      skin_conductance,
      temperature
    });
    
    const { stress_level, stress_score } = mlResponse.data;
    
    // Store reading
    const { data: reading, error } = await supabase
      .from('health_readings')
      .insert([{
        user_id: userId,
        heart_rate,
        skin_conductance,
        temperature,
        stress_level,
        stress_score
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // If high stress, create alert and intervention
    if (stress_level === 'HIGH' || stress_level === 'CRITICAL') {
      await supabase.from('alerts').insert([{
        user_id: userId,
        alert_type: 'STRESS_WARNING',
        message: `High stress detected! Score: ${stress_score.toFixed(2)}`
      }]);
      
      const interventions = getInterventions(stress_level);
      await supabase.from('interventions').insert(
        interventions.map(int => ({
          user_id: userId,
          reading_id: reading.id,
          intervention_type: int.type,
          recommendation: int.text
        }))
      );
      
      // Send real-time alert via Socket.io
      req.app.locals.io.to(`user-${userId}`).emit('stress-alert', {
        stress_level,
        stress_score,
        interventions
      });
    }
    
    res.json({ reading, stress_level, stress_score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's health history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('health_readings')
      .select('*')
      .eq('user_id', req.userId)
      .order('timestamp', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getInterventions(stressLevel) {
  const interventions = [
    { type: 'BREATHING', text: 'Take 5 minutes for deep breathing: Inhale for 4 seconds, hold for 4, exhale for 6.' },
    { type: 'BREAK', text: 'Take a 15-minute break. Step away from your workspace and stretch.' },
    { type: 'HYDRATION', text: 'Drink a glass of water. Dehydration can increase stress levels.' }
  ];
  
  if (stressLevel === 'CRITICAL') {
    interventions.push({ type: 'MEDICATION', text: 'Consider taking prescribed stress medication if available.' });
    interventions.push({ type: 'REST', text: 'Schedule immediate rest. Avoid strenuous activities for the next hour.' });
  }
  
  return interventions;
}

module.exports = router;
