const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('crypto');

// Setup local JSON DB fallback path
const LOCAL_DB_PATH = path.join(__dirname, '../../database/local_db.json');

function loadLocalDB() {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initialData = { users: [], health_readings: [], alerts: [], interventions: [] };
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const content = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(content || '{"users":[],"health_readings":[],"alerts":[],"interventions":[]}');
  } catch (err) {
    console.error('Error loading local DB:', err);
    return { users: [], health_readings: [], alerts: [], interventions: [] };
  }
}

function saveLocalDB(data) {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving local DB:', err);
  }
}

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  } catch (e) {
    console.warn('⚠️ Supabase client initialization failed, fallback active.');
  }
}

// User Helpers
async function findUserByEmail(email) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      if (!error && data) return data;
    } catch (e) {
      console.warn('⚠️ Supabase fetch failed, fallback to local DB:', e.message);
    }
  }
  const db = loadLocalDB();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

async function findUserById(id) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) return data;
    } catch (e) {
      console.warn('⚠️ Supabase fetch failed, fallback to local DB:', e.message);
    }
  }
  const db = loadLocalDB();
  return db.users.find(u => u.id === id) || null;
}

async function createUser(userData) {
  const newUser = {
    id: userData.id || (uuidv4 ? uuidv4() : String(Date.now())),
    email: userData.email,
    password: userData.password,
    name: userData.name,
    age: userData.age || null,
    gender: userData.gender || null,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('⚠️ Supabase insert failed, storing in local DB:', e.message);
    }
  }

  const db = loadLocalDB();
  db.users.push(newUser);
  saveLocalDB(db);
  return newUser;
}

// Health Reading Helpers
async function insertHealthReading(reading) {
  const newReading = {
    id: reading.id || (uuidv4 ? uuidv4() : String(Date.now())),
    user_id: reading.user_id,
    heart_rate: reading.heart_rate,
    skin_conductance: reading.skin_conductance,
    temperature: reading.temperature,
    stress_level: reading.stress_level,
    stress_score: reading.stress_score,
    recorded_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .insert(newReading)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('⚠️ Supabase health reading insert failed, storing in local DB:', e.message);
    }
  }

  const db = loadLocalDB();
  db.health_readings.unshift(newReading);
  saveLocalDB(db);
  return newReading;
}

async function getHealthReadings(userId, limit = 20) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(limit);
      if (!error && data) return data;
    } catch (e) {
      console.warn('⚠️ Supabase health readings fetch failed, fallback to local DB:', e.message);
    }
  }

  const db = loadLocalDB();
  return db.health_readings
    .filter(r => r.user_id === userId)
    .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at))
    .slice(0, limit);
}

// Alert Helpers
async function insertAlert(alertData) {
  const newAlert = {
    id: alertData.id || (uuidv4 ? uuidv4() : String(Date.now())),
    user_id: alertData.user_id,
    message: alertData.message,
    alert_level: alertData.alert_level || alertData.severity || 'HIGH',
    is_read: false,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert(newAlert)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('⚠️ Supabase alert insert failed, storing in local DB:', e.message);
    }
  }

  const db = loadLocalDB();
  db.alerts.unshift(newAlert);
  saveLocalDB(db);
  return newAlert;
}

async function getAlerts(userId, limit = 20) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (!error && data) return data;
    } catch (e) {
      console.warn('⚠️ Supabase alerts fetch failed, fallback to local DB:', e.message);
    }
  }

  const db = loadLocalDB();
  return db.alerts
    .filter(a => a.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

// Intervention Helpers
async function insertInterventions(interventionsList) {
  const formatted = interventionsList.map(i => ({
    id: i.id || (uuidv4 ? uuidv4() : String(Date.now())),
    user_id: i.user_id,
    intervention_type: i.intervention_type,
    category: i.category,
    description: i.description,
    medications: i.medications || [],
    urgency: i.urgency || 'MEDIUM',
    medical_note: i.medical_note || null,
    completed: false,
    created_at: new Date().toISOString()
  }));

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .insert(formatted)
        .select();
      if (!error && data) return data;
    } catch (e) {
      console.warn('⚠️ Supabase interventions insert failed, storing in local DB:', e.message);
    }
  }

  const db = loadLocalDB();
  db.interventions.unshift(...formatted);
  saveLocalDB(db);
  return formatted;
}

async function getInterventions(userId) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('⚠️ Supabase interventions fetch failed, fallback to local DB:', e.message);
    }
  }

  const db = loadLocalDB();
  return db.interventions
    .filter(i => i.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function markInterventionComplete(id) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('⚠️ Supabase intervention update failed, updating in local DB:', e.message);
    }
  }

  const db = loadLocalDB();
  const item = db.interventions.find(i => i.id === id);
  if (item) {
    item.completed = true;
    item.completed_at = new Date().toISOString();
    saveLocalDB(db);
  }
  return item;
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  insertHealthReading,
  getHealthReadings,
  insertAlert,
  getAlerts,
  insertInterventions,
  getInterventions,
  markInterventionComplete
};
