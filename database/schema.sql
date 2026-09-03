-- =========================================================
-- STRESS-SHIELD DATABASE SCHEMA FOR SUPABASE / POSTGRESQL
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. HEALTH READINGS TABLE (Biometric data captured from IoT wearables / manual entry)
CREATE TABLE IF NOT EXISTS health_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    heart_rate NUMERIC(5,2) NOT NULL,
    skin_conductance NUMERIC(5,2) NOT NULL,
    temperature NUMERIC(4,2) NOT NULL,
    stress_level VARCHAR(50) NOT NULL, -- LOW, MODERATE, HIGH, CRITICAL
    stress_score NUMERIC(4,2) NOT NULL, -- 0.00 to 10.00
    source VARCHAR(50) DEFAULT 'MANUAL', -- MANUAL, ESP32_WEARABLE, SIMULATOR
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ALERTS TABLE (System alerts triggered by high/critical stress)
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reading_id UUID REFERENCES health_readings(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    alert_level VARCHAR(50) NOT NULL, -- HIGH, CRITICAL
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. INTERVENTIONS TABLE (Personalized recommendations, guided relaxation, duty-cycling rest, medications)
CREATE TABLE IF NOT EXISTS interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    intervention_type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    medications JSONB DEFAULT '[]'::jsonb,
    urgency VARCHAR(50) DEFAULT 'MEDIUM', -- IMMEDIATE, HIGH, MEDIUM, LOW
    medical_note TEXT,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_health_readings_user ON health_readings(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interventions_user ON interventions(user_id, created_at DESC);
