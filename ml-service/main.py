from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
from typing import Dict
import os

app = FastAPI(title="Stress-Shield ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthData(BaseModel):
    heart_rate: float
    skin_conductance: float
    temperature: float

# Load Ensemble Model & Scaler
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "model.joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.joblib")

model = None
scaler = None

if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        print("Loaded trained Ensemble ML Model (Random Forest + Gradient Boosting)")
    except Exception as e:
        print(f"Error loading model: {e}")

LABEL_MAP = {0: "LOW", 1: "MODERATE", 2: "HIGH", 3: "CRITICAL"}

def classify_stress_heuristic(heart_rate, skin_conductance, temperature):
    score = 0
    if heart_rate > 100:
        score += (heart_rate - 100) / 20
    elif heart_rate < 60:
        score += (60 - heart_rate) / 20
    
    score += skin_conductance / 2
    
    if temperature > 37.5:
        score += (temperature - 37.5) * 2
    elif temperature < 36.5:
        score += (36.5 - temperature) * 2
    
    stress_score = min(max(score, 0), 10)
    
    if stress_score < 3:
        stress_level = "LOW"
    elif stress_score < 5:
        stress_level = "MODERATE"
    elif stress_score < 7:
        stress_level = "HIGH"
    else:
        stress_level = "CRITICAL"
        
    return stress_level, stress_score, 0.85, "Heuristic Fallback"

@app.post("/predict")
async def predict_stress(data: HealthData) -> Dict:
    if model is not None and scaler is not None:
        features = np.array([[data.heart_rate, data.skin_conductance, data.temperature]])
        features_scaled = scaler.transform(features)
        
        probabilities = model.predict_proba(features_scaled)[0]
        class_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[class_idx])
        
        # Calculate continuous score scaled 0-10 from class probabilities
        continuous_score = float(np.sum(probabilities * np.array([1.5, 4.0, 6.5, 9.0])))
        stress_level = LABEL_MAP.get(class_idx, "MODERATE")
        
        return {
            "stress_level": stress_level,
            "stress_score": round(continuous_score, 2),
            "confidence": round(confidence, 2),
            "model_type": "Ensemble (Random Forest + Gradient Boosting)"
        }
    else:
        level, score, conf, model_type = classify_stress_heuristic(
            data.heart_rate, data.skin_conductance, data.temperature
        )
        return {
            "stress_level": level,
            "stress_score": round(score, 2),
            "confidence": conf,
            "model_type": model_type
        }

@app.get("/")
async def root():
    return {
        "service": "Stress-Shield ML Service",
        "status": "online",
        "model_loaded": model is not None,
        "model_type": "Ensemble (Random Forest + Gradient Boosting)" if model is not None else "Heuristic",
        "endpoints": {
            "predict": "POST /predict",
            "health": "GET /health",
            "docs": "GET /docs"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_type": "Ensemble (Random Forest + Gradient Boosting)" if model is not None else "Heuristic"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
