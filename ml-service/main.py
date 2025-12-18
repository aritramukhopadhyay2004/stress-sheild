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

# Simple rule-based classifier (replace with trained model)
def classify_stress(heart_rate, skin_conductance, temperature):
    score = 0
    
    # Heart rate scoring (60-100 normal)
    if heart_rate > 100:
        score += (heart_rate - 100) / 20
    elif heart_rate < 60:
        score += (60 - heart_rate) / 20
    
    # Skin conductance (0-10 microsiemens, higher = more stress)
    score += skin_conductance / 2
    
    # Temperature (36.5-37.5°C normal)
    if temperature > 37.5:
        score += (temperature - 37.5) * 2
    elif temperature < 36.5:
        score += (36.5 - temperature) * 2
    
    # Normalize score to 0-10
    stress_score = min(max(score, 0), 10)
    
    # Classify
    if stress_score < 3:
        stress_level = "LOW"
    elif stress_score < 5:
        stress_level = "NORMAL"
    elif stress_score < 7:
        stress_level = "MODERATE"
    elif stress_score < 9:
        stress_level = "HIGH"
    else:
        stress_level = "CRITICAL"
    
    return stress_level, stress_score

@app.post("/predict")
async def predict_stress(data: HealthData) -> Dict:
    stress_level, stress_score = classify_stress(
        data.heart_rate,
        data.skin_conductance,
        data.temperature
    )
    
    return {
        "stress_level": stress_level,
        "stress_score": float(stress_score),
        "confidence": 0.92
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model": "rule-based-v1"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
